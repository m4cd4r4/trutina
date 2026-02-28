"""
AI Content Detector
Uses Claude to semantically analyse document text for AI-generated or falsified content.
"""
from __future__ import annotations

import json
import re

import anthropic

from app.analysers.pdf_forensics import Flag
from app.core.config import settings

SYSTEM_PROMPT = """You are an expert mortgage fraud analyst for an Australian lending institution.
You will be given the extracted text of a financial document submitted as part of a home loan application.
Your job is to detect signs that this document was AI-generated, digitally fabricated, or altered.
You must check Australian-specific details carefully.
Respond ONLY with valid JSON — no commentary, no markdown, no code fences."""

ANALYSIS_PROMPT = """Analyse this {doc_type} document extracted from a mortgage application.

Document text:
{document_text}

Respond with this exact JSON structure:
{{
  "authenticity_assessment": "genuine" | "suspicious" | "likely_fraudulent",
  "confidence": 0.0-1.0,
  "ai_generation_indicators": [
    {{
      "indicator": "description of what you found",
      "severity": "low" | "medium" | "high" | "critical",
      "evidence": "exact text or value from the document"
    }}
  ],
  "consistency_issues": [
    {{
      "issue": "description of the inconsistency",
      "expected": "what should be there",
      "found": "what is actually present",
      "severity": "low" | "medium" | "high" | "critical"
    }}
  ],
  "australian_anomalies": [
    {{
      "anomaly": "description",
      "severity": "low" | "medium" | "high" | "critical"
    }}
  ],
  "key_fields_extracted": {{
    "employer_name": null,
    "employer_abn": null,
    "employee_name": null,
    "gross_pay": null,
    "net_pay": null,
    "tax_withheld": null,
    "super": null,
    "ytd_gross": null,
    "pay_period_start": null,
    "pay_period_end": null,
    "payment_date": null,
    "pay_frequency": null,
    "bsb": null,
    "account_number": null,
    "super_fund": null,
    "opening_balance": null,
    "closing_balance": null,
    "occupation": null
  }}
}}

Check specifically for:
1. Generic or AI-typical phrasing (unusually perfect grammar, no abbreviations, etc.)
2. Incorrect Australian payroll terminology (PAYG, SGC, TFN, STP, etc.)
3. ABN format issues (11 digits, space formatting like XX XXX XXX XXX)
4. BSB format issues (6 digits, usually formatted as XXX-XXX)
5. Superannuation: 11.5% rate from 1 July 2024, valid fund names
6. Tax withheld: plausible under 2024-25 ATO tax tables
7. Date formats consistent with Australian standards
8. Figures that look like they were randomly generated vs calculated
9. For bank statements: transactions with unrealistic descriptions or round numbers
10. Missing mandatory fields for the document type

Return null for any field you cannot find. Be conservative — mark as suspicious only when there is genuine evidence."""


def _map_severity_to_weight(severity: str) -> int:
    return {"critical": 9, "high": 7, "medium": 4, "low": 2}.get(severity, 3)


async def analyse(
    ocr_text: str,
    doc_type: str,
    document_id: str | None = None,
) -> tuple[list[Flag], dict]:
    """
    Run Claude analysis on extracted document text.
    Returns (flags, extracted_fields).
    """
    if not settings.anthropic_api_key:
        return [], {}

    if not ocr_text or len(ocr_text.strip()) < 50:
        return [Flag(
            category="ai_content", code="INSUFFICIENT_TEXT",
            title="Insufficient text could be extracted from document",
            description="The document contains very little extractable text. This may indicate a scanned image with no text layer, which prevents automated verification.",
            severity="medium", weight=5, document_id=document_id,
        )], {}

    prompt = ANALYSIS_PROMPT.format(
        doc_type=doc_type,
        document_text=ocr_text[:40000],
    )

    try:
        client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text
    except Exception as exc:
        return [Flag(
            category="ai_content", code="CLAUDE_API_ERROR",
            title="AI analysis service error",
            description=f"The AI analysis could not complete: {exc}",
            severity="low", weight=1, document_id=document_id,
        )], {}

    # Parse JSON response
    try:
        # Strip potential markdown fences
        clean = re.sub(r"```(?:json)?|```", "", raw).strip()
        result = json.loads(clean)
    except json.JSONDecodeError:
        return [], {}

    flags: list[Flag] = []

    # Overall assessment flag
    assessment = result.get("authenticity_assessment", "genuine")
    confidence = float(result.get("confidence", 0.5))

    if assessment == "likely_fraudulent" and confidence >= 0.7:
        flags.append(Flag(
            category="ai_content", code="AI_ASSESSMENT_FRAUDULENT",
            title="AI analysis: document assessed as likely fraudulent",
            description=f"Claude's semantic analysis assessed this document as likely fraudulent with {confidence:.0%} confidence.",
            severity="critical", weight=9,
            evidence={"assessment": assessment, "confidence": confidence},
            document_id=document_id,
        ))
    elif assessment == "suspicious":
        flags.append(Flag(
            category="ai_content", code="AI_ASSESSMENT_SUSPICIOUS",
            title="AI analysis: document assessed as suspicious",
            description=f"Claude's semantic analysis flagged this document as suspicious ({confidence:.0%} confidence). Manual review recommended.",
            severity="high", weight=6,
            evidence={"assessment": assessment, "confidence": confidence},
            document_id=document_id,
        ))

    # AI generation indicators
    for item in result.get("ai_generation_indicators", []):
        if not item.get("indicator"):
            continue
        severity = item.get("severity", "medium")
        flags.append(Flag(
            category="ai_content", code="AI_GENERATION_INDICATOR",
            title=f"AI generation indicator: {item['indicator'][:80]}",
            description=item["indicator"],
            severity=severity,
            weight=_map_severity_to_weight(severity),
            evidence={"evidence": item.get("evidence")},
            document_id=document_id,
        ))

    # Consistency issues
    for item in result.get("consistency_issues", []):
        if not item.get("issue"):
            continue
        severity = item.get("severity", "medium")
        flags.append(Flag(
            category="ai_content", code="SEMANTIC_CONSISTENCY_ISSUE",
            title=f"Consistency: {item['issue'][:80]}",
            description=f"{item['issue']} Expected: {item.get('expected')}. Found: {item.get('found')}.",
            severity=severity,
            weight=_map_severity_to_weight(severity),
            evidence={"expected": item.get("expected"), "found": item.get("found")},
            document_id=document_id,
        ))

    # Australian anomalies
    for item in result.get("australian_anomalies", []):
        if not item.get("anomaly"):
            continue
        severity = item.get("severity", "medium")
        flags.append(Flag(
            category="ai_content", code="AUSTRALIAN_ANOMALY",
            title=f"Australian compliance: {item['anomaly'][:80]}",
            description=item["anomaly"],
            severity=severity,
            weight=_map_severity_to_weight(severity),
            evidence={},
            document_id=document_id,
        ))

    extracted_fields = result.get("key_fields_extracted", {})
    return flags, extracted_fields
