"""
Cross-Reference Analyser
Validates Australian-specific data: ABN, BSB, ABS wage benchmarks.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import httpx
from rapidfuzz import fuzz

from app.analysers.pdf_forensics import Flag
from app.core.config import settings

# Cached data paths (populated on first use)
_BSB_CACHE: dict[str, dict] | None = None
_ABS_BENCHMARKS: dict[str, dict] | None = None


# ---------------------------------------------------------------------------
# ABN Validation
# ---------------------------------------------------------------------------

def _validate_abn_checksum(abn: str) -> bool:
    """ABN checksum: subtract 1 from first digit, weight [10,1,3,5,7,9,11,13,15,17,19], sum % 89 == 0."""
    digits = re.sub(r"\s", "", abn)
    if not re.match(r"^\d{11}$", digits):
        return False
    weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    d = [int(c) for c in digits]
    d[0] -= 1
    total = sum(w * n for w, n in zip(weights, d))
    return total % 89 == 0


async def lookup_abn(abn: str) -> dict:
    """Query the Australian Business Register API."""
    abn_clean = re.sub(r"\s", "", abn)
    result: dict[str, Any] = {
        "abn": abn_clean,
        "valid_format": _validate_abn_checksum(abn_clean),
        "exists": False,
        "active": False,
        "entity_name": None,
        "entity_type": None,
    }

    if not result["valid_format"]:
        return result

    if not settings.abn_api_guid:
        # No API key — skip live check, return format-only result
        result["warning"] = "ABN_API_GUID not configured; live lookup skipped"
        return result

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://api.abn.business.gov.au/20200010/AbnLookup/SearchByAbn",
                params={
                    "searchString": abn_clean,
                    "includeHistoricalDetails": "N",
                    "authenticationGuid": settings.abn_api_guid,
                },
            )
            data = resp.json()

        entity = data.get("BusinessEntity202001")
        if entity:
            result["exists"] = True
            status_code = entity.get("EntityStatus", {}).get("EntityStatusCode", "")
            result["active"] = status_code == "Active"
            result["entity_name"] = entity.get("MainName", {}).get("OrganisationName")
            result["entity_type"] = entity.get("EntityType", {}).get("EntityTypeCode")
    except Exception:
        result["lookup_error"] = True

    return result


async def check_abn(abn: str, stated_employer: str, document_id: str | None = None) -> list[Flag]:
    flags: list[Flag] = []
    abn_clean = re.sub(r"\s", "", abn or "")

    if not abn_clean:
        return []

    if not _validate_abn_checksum(abn_clean):
        flags.append(Flag(
            category="cross_reference", code="INVALID_ABN_FORMAT",
            title="ABN fails checksum validation",
            description=(
                f"The ABN '{abn}' does not pass the mathematical checksum required for all "
                f"valid Australian Business Numbers. This ABN cannot exist."
            ),
            severity="critical", weight=10,
            evidence={"abn": abn_clean},
            document_id=document_id,
        ))
        return flags

    result = await lookup_abn(abn_clean)

    if result.get("lookup_error"):
        return flags  # Network error — don't penalise

    if not result["exists"]:
        flags.append(Flag(
            category="cross_reference", code="ABN_NOT_FOUND",
            title="ABN not found in Australian Business Register",
            description=(
                f"The ABN '{abn}' does not exist in the Australian Business Register. "
                f"All Australian employers must be registered with an active ABN."
            ),
            severity="critical", weight=10,
            evidence={"abn": abn_clean},
            document_id=document_id,
        ))
        return flags

    if not result["active"]:
        flags.append(Flag(
            category="cross_reference", code="ABN_INACTIVE",
            title="Employer ABN is cancelled or inactive",
            description=(
                f"The ABN '{abn}' exists but is not active. A cancelled or deregistered business "
                f"cannot issue current payslips or employ staff."
            ),
            severity="high", weight=8,
            evidence={"abn": abn_clean, "entity_name": result.get("entity_name")},
            document_id=document_id,
        ))

    # Name matching
    if result.get("entity_name") and stated_employer:
        similarity = fuzz.token_sort_ratio(
            result["entity_name"].lower(), stated_employer.lower()
        )
        if similarity < 70:
            flags.append(Flag(
                category="cross_reference", code="EMPLOYER_NAME_ABN_MISMATCH",
                title="Employer name does not match ABN registration",
                description=(
                    f"The document states employer '{stated_employer}', but ABN {abn} is "
                    f"registered to '{result['entity_name']}' (similarity: {similarity}%). "
                    f"This discrepancy requires direct verification."
                ),
                severity="high", weight=8,
                evidence={
                    "stated_name": stated_employer,
                    "registered_name": result["entity_name"],
                    "similarity_pct": similarity,
                },
                document_id=document_id,
            ))

    return flags


# ---------------------------------------------------------------------------
# BSB Validation
# ---------------------------------------------------------------------------

def _load_bsb_cache() -> dict[str, dict]:
    global _BSB_CACHE
    if _BSB_CACHE is not None:
        return _BSB_CACHE

    cache_path = Path(__file__).parent.parent.parent / "data" / "bsb_directory.json"
    if cache_path.exists():
        with open(cache_path) as f:
            _BSB_CACHE = json.load(f)
    else:
        # Minimal known-good BSB prefixes for Australian banks
        _BSB_CACHE = {
            "prefixes": {
                "01": "ANZ", "06": "CBA", "08": "NAB", "03": "Westpac",
                "73": "Bendigo Bank", "61": "CUA", "48": "HSBC",
                "10": "BankSA", "11": "St George", "12": "Bank of Melbourne",
                "30": "Bankwest", "32": "ING", "33": "Macquarie",
                "38": "Suncorp", "40": "BOQ", "76": "Citi",
                "55": "Adelaide Bank", "63": "Heritage Bank",
                "72": "Delphi Bank", "77": "Greater Bank",
            }
        }
    return _BSB_CACHE


def check_bsb(bsb: str, document_id: str | None = None) -> list[Flag]:
    flags: list[Flag] = []
    bsb_clean = re.sub(r"[\s\-]", "", bsb or "")

    if not bsb_clean:
        return []

    if not re.match(r"^\d{6}$", bsb_clean):
        flags.append(Flag(
            category="cross_reference", code="INVALID_BSB_FORMAT",
            title="BSB number is not in valid format",
            description=f"BSB '{bsb}' is not a valid 6-digit Australian BSB number.",
            severity="high", weight=6,
            evidence={"bsb": bsb_clean},
            document_id=document_id,
        ))
        return flags

    cache = _load_bsb_cache()
    prefix = bsb_clean[:2]
    known_prefixes = cache.get("prefixes", {})

    if known_prefixes and prefix not in known_prefixes:
        flags.append(Flag(
            category="cross_reference", code="UNKNOWN_BSB_PREFIX",
            title="BSB number prefix does not match any known Australian bank",
            description=(
                f"The BSB '{bsb}' has prefix '{prefix}' which does not correspond to any "
                f"known Australian financial institution. Verify the bank account details."
            ),
            severity="medium", weight=5,
            evidence={"bsb": bsb_clean, "prefix": prefix},
            document_id=document_id,
        ))

    return flags


# ---------------------------------------------------------------------------
# Income plausibility
# ---------------------------------------------------------------------------

def _load_abs_benchmarks() -> dict:
    global _ABS_BENCHMARKS
    if _ABS_BENCHMARKS is not None:
        return _ABS_BENCHMARKS

    cache_path = Path(__file__).parent.parent.parent / "data" / "abs_wage_benchmarks.json"
    if cache_path.exists():
        with open(cache_path) as f:
            _ABS_BENCHMARKS = json.load(f)
    else:
        # ABS 2023-24 median full-time earnings by broad occupation (AUD)
        _ABS_BENCHMARKS = {
            "manager": {"p50": 120000, "p75": 160000, "p90": 220000},
            "professional": {"p50": 95000, "p75": 130000, "p90": 180000},
            "technician": {"p50": 80000, "p75": 110000, "p90": 150000},
            "clerical": {"p50": 65000, "p75": 85000, "p90": 110000},
            "sales": {"p50": 60000, "p75": 80000, "p90": 105000},
            "labourer": {"p50": 60000, "p75": 80000, "p90": 100000},
            "operator": {"p50": 70000, "p75": 90000, "p90": 120000},
        }
    return _ABS_BENCHMARKS


def check_income_plausibility(
    stated_annual_income: float,
    occupation: str | None = None,
    document_id: str | None = None,
) -> list[Flag]:
    flags: list[Flag] = []

    if stated_annual_income <= 0:
        return flags

    # Absolute floor/ceiling checks
    if stated_annual_income < 5000:
        flags.append(Flag(
            category="cross_reference", code="INCOME_IMPLAUSIBLY_LOW",
            title="Stated annual income is unrealistically low",
            description=f"Stated annual income of ${stated_annual_income:,.0f} is below minimum wage levels.",
            severity="medium", weight=4,
            evidence={"stated_income": stated_annual_income},
            document_id=document_id,
        ))

    if stated_annual_income > 5_000_000:
        flags.append(Flag(
            category="cross_reference", code="INCOME_IMPLAUSIBLY_HIGH",
            title="Stated annual income is extremely high",
            description=f"Stated annual income of ${stated_annual_income:,.0f} exceeds $5M. Manual verification required.",
            severity="medium", weight=5,
            evidence={"stated_income": stated_annual_income},
            document_id=document_id,
        ))

    # Occupation-based check
    if occupation:
        benchmarks = _load_abs_benchmarks()
        occ_lower = occupation.lower()
        matched_key = next((k for k in benchmarks if k in occ_lower), None)

        if matched_key:
            p90 = benchmarks[matched_key]["p90"]
            if stated_annual_income > p90 * 1.5:
                flags.append(Flag(
                    category="cross_reference", code="INCOME_HIGH_FOR_OCCUPATION",
                    title=f"Stated income is very high for a {occupation}",
                    description=(
                        f"${stated_annual_income:,.0f} is significantly above the 90th percentile "
                        f"(${p90:,.0f}) for {occupation}. This does not mean fraud, but warrants verification."
                    ),
                    severity="medium", weight=4,
                    evidence={"stated_income": stated_annual_income, "p90_benchmark": p90, "occupation": occupation},
                    document_id=document_id,
                ))

    return flags
