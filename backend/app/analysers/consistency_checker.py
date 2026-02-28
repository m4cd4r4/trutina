"""
Consistency Checker
Deterministic math, date, and logic validation for financial documents.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from decimal import Decimal, InvalidOperation
from typing import Any

from app.analysers.pdf_forensics import Flag

SUPER_GUARANTEE_RATE = Decimal("0.115")  # 11.5% from 1 July 2024


def _parse_currency(value: Any) -> Decimal | None:
    if value is None:
        return None
    try:
        cleaned = re.sub(r"[^\d.]", "", str(value))
        return Decimal(cleaned) if cleaned else None
    except InvalidOperation:
        return None


def _parse_date(value: Any) -> date | None:
    if not value:
        return None
    if isinstance(value, date):
        return value
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%d %B %Y", "%d %b %Y"):
        try:
            return datetime.strptime(str(value).strip(), fmt).date()
        except ValueError:
            continue
    return None


def _get_fy_start(d: date) -> date:
    """Australian financial year starts 1 July."""
    if d.month >= 7:
        return date(d.year, 7, 1)
    return date(d.year - 1, 7, 1)


def _periods_elapsed(fy_start: date, period_end: date, frequency: str) -> float:
    days_elapsed = (period_end - fy_start).days
    if frequency == "weekly":
        return days_elapsed / 7
    elif frequency == "fortnightly":
        return days_elapsed / 14
    elif frequency == "monthly":
        return days_elapsed / 30.44
    return days_elapsed / 14  # default fortnightly


def _detect_pay_frequency(text: str) -> str:
    text_lower = text.lower()
    if "weekly" in text_lower:
        return "weekly"
    if "fortnightly" in text_lower or "fortnight" in text_lower:
        return "fortnightly"
    if "monthly" in text_lower:
        return "monthly"
    return "fortnightly"


def check_payslip(fields: dict, full_text: str, document_id: str | None = None) -> list[Flag]:
    flags: list[Flag] = []

    gross = _parse_currency(fields.get("gross_pay") or fields.get("gross_annual"))
    tax = _parse_currency(fields.get("tax_withheld") or fields.get("tax"))
    net = _parse_currency(fields.get("net_pay") or fields.get("net"))
    super_contrib = _parse_currency(fields.get("super") or fields.get("superannuation"))
    ytd_gross = _parse_currency(fields.get("ytd_gross"))
    period_start = _parse_date(fields.get("pay_period_start"))
    period_end = _parse_date(fields.get("pay_period_end"))
    payment_date = _parse_date(fields.get("payment_date"))

    # Rule 1: Gross - Tax = Net
    if gross and tax and net:
        expected_net = gross - tax
        diff = abs(expected_net - net)
        if diff > Decimal("1.00"):
            flags.append(Flag(
                category="consistency",
                code="PAYSLIP_MATH_DOESNT_ADD_UP",
                title="Payslip figures do not reconcile",
                description=(
                    f"Gross pay (${gross:,.2f}) minus tax withheld (${tax:,.2f}) = ${expected_net:,.2f}, "
                    f"but net pay shown is ${net:,.2f}. This ${diff:,.2f} discrepancy indicates "
                    f"the figures were not calculated together — a primary indicator of document manipulation."
                ),
                severity="critical",
                weight=10,
                evidence={"gross": float(gross), "tax": float(tax), "stated_net": float(net), "calculated_net": float(expected_net)},
                document_id=document_id,
            ))

    # Rule 2: Super ~11.5% of gross (±2% tolerance)
    if gross and super_contrib and gross > 0:
        expected_super = gross * SUPER_GUARANTEE_RATE
        tolerance = gross * Decimal("0.02")
        diff = abs(expected_super - super_contrib)
        if diff > tolerance:
            flags.append(Flag(
                category="consistency",
                code="SUPER_RATE_ANOMALY",
                title="Superannuation contribution is not at the legislated rate",
                description=(
                    f"At the 11.5% Superannuation Guarantee rate (from 1 July 2024), "
                    f"super on ${gross:,.2f} gross should be ~${expected_super:,.2f}. "
                    f"The stated contribution of ${super_contrib:,.2f} differs by ${diff:,.2f} "
                    f"(outside the ±2% tolerance for salary sacrifice)."
                ),
                severity="high",
                weight=7,
                evidence={
                    "gross": float(gross), "stated_super": float(super_contrib),
                    "expected_super": float(expected_super), "sg_rate": "11.5%",
                },
                document_id=document_id,
            ))

    # Rule 3: YTD vs pay periods elapsed
    if ytd_gross and period_end and gross and gross > 0:
        fy_start = _get_fy_start(period_end)
        frequency = _detect_pay_frequency(full_text)
        periods = _periods_elapsed(fy_start, period_end, frequency)
        expected_ytd = gross * Decimal(str(periods))
        ratio = float(ytd_gross / expected_ytd) if expected_ytd > 0 else 0

        if ratio > 1.5 or ratio < 0.5:
            flags.append(Flag(
                category="consistency",
                code="YTD_FIGURE_IMPLAUSIBLE",
                title="Year-to-date earnings are inconsistent with the pay period",
                description=(
                    f"With {periods:.1f} {frequency} pay periods elapsed since 1 July {fy_start.year}, "
                    f"YTD gross should be approximately ${float(expected_ytd):,.2f}. "
                    f"The stated YTD of ${float(ytd_gross):,.2f} ({ratio:.1f}x expected) is outside a plausible range."
                ),
                severity="high",
                weight=8,
                evidence={
                    "pay_frequency": frequency, "periods_elapsed": round(periods, 1),
                    "single_period_gross": float(gross),
                    "stated_ytd": float(ytd_gross), "expected_ytd": float(expected_ytd),
                },
                document_id=document_id,
            ))

    # Rule 4: Pay period dates
    if period_start and period_end:
        if period_end <= period_start:
            flags.append(Flag(
                category="consistency", code="IMPOSSIBLE_PAY_PERIOD_DATES",
                title="Pay period end date is before start date",
                description=f"Period start {period_start} is after or equal to period end {period_end}. This is impossible.",
                severity="critical", weight=10,
                evidence={"period_start": str(period_start), "period_end": str(period_end)},
                document_id=document_id,
            ))

    # Rule 5: Payment date before period ends
    if payment_date and period_end and payment_date < period_end:
        flags.append(Flag(
            category="consistency", code="PAYMENT_BEFORE_PERIOD_END",
            title="Payment date precedes pay period end date",
            description=(
                f"Payment date ({payment_date}) is before the pay period ends ({period_end}). "
                f"Employees cannot be paid before their pay period concludes."
            ),
            severity="high", weight=7,
            evidence={"payment_date": str(payment_date), "period_end": str(period_end)},
            document_id=document_id,
        ))

    # Rule 6: Future payment date
    if payment_date and payment_date > date.today() + timedelta(days=30):
        flags.append(Flag(
            category="consistency", code="FUTURE_PAYMENT_DATE",
            title="Payment date is in the future",
            description=f"The payslip shows a payment date of {payment_date}, which is in the future.",
            severity="high", weight=6,
            evidence={"payment_date": str(payment_date)},
            document_id=document_id,
        ))

    return flags


def check_bank_statement(fields: dict, transactions: list[dict], document_id: str | None = None) -> list[Flag]:
    flags: list[Flag] = []

    opening = _parse_currency(fields.get("opening_balance"))
    closing = _parse_currency(fields.get("closing_balance"))

    if opening is not None and closing is not None and transactions:
        total_credits = sum(
            _parse_currency(t.get("amount")) or Decimal(0)
            for t in transactions if t.get("type") == "credit"
        )
        total_debits = sum(
            _parse_currency(t.get("amount")) or Decimal(0)
            for t in transactions if t.get("type") == "debit"
        )
        expected_closing = opening + total_credits - total_debits
        diff = abs(expected_closing - closing)

        if diff > Decimal("0.02"):
            flags.append(Flag(
                category="consistency",
                code="BANK_STATEMENT_BALANCE_MISMATCH",
                title="Bank statement balance does not reconcile",
                description=(
                    f"Opening balance (${float(opening):,.2f}) + credits (${float(total_credits):,.2f}) "
                    f"− debits (${float(total_debits):,.2f}) = ${float(expected_closing):,.2f}, "
                    f"but closing balance shown is ${float(closing):,.2f}. "
                    f"This ${float(diff):,.2f} discrepancy is a primary indicator of falsification."
                ),
                severity="critical", weight=10,
                evidence={
                    "opening": float(opening), "closing": float(closing),
                    "total_credits": float(total_credits), "total_debits": float(total_debits),
                    "expected_closing": float(expected_closing),
                },
                document_id=document_id,
            ))

    return flags


def cross_document_income_check(
    payslip_fields: dict,
    bank_fields: dict,
    bank_transactions: list[dict],
    document_ids: dict | None = None,
) -> list[Flag]:
    """Compare claimed income on payslip against regular salary credits on bank statement."""
    flags: list[Flag] = []
    gross = _parse_currency(payslip_fields.get("gross_pay"))
    net = _parse_currency(payslip_fields.get("net_pay"))

    if not net or not bank_transactions:
        return flags

    # Find regular salary-like credits (large, recurring amounts)
    credit_amounts = sorted(
        [_parse_currency(t.get("amount")) for t in bank_transactions
         if t.get("type") == "credit" and _parse_currency(t.get("amount"))],
        reverse=True
    )

    if not credit_amounts:
        return flags

    largest_credit = credit_amounts[0]
    # Allow 10% variance (tax refunds, bonuses)
    tolerance = net * Decimal("0.10")

    if abs(largest_credit - net) > tolerance and abs(largest_credit - net) > Decimal("500"):
        flags.append(Flag(
            category="consistency",
            code="INCOME_PAYSLIP_BANK_MISMATCH",
            title="Payslip net pay does not match bank statement credits",
            description=(
                f"The payslip claims net pay of ${float(net):,.2f}, but the largest salary credit "
                f"on the bank statement is ${float(largest_credit):,.2f} "
                f"(difference: ${float(abs(largest_credit - net)):,.2f}). "
                f"These should match closely for genuine documents submitted together."
            ),
            severity="high", weight=8,
            evidence={
                "payslip_net": float(net),
                "largest_bank_credit": float(largest_credit),
                "difference": float(abs(largest_credit - net)),
            },
        ))

    return flags
