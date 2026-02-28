"""
Risk Scorer
Computes composite fraud risk score from all analyser flags.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.analysers.pdf_forensics import Flag

# Maximum contribution per category (these sum to 145 — the denominator for normalisation)
CATEGORY_CAPS: dict[str, float] = {
    "pdf_forensics": 25.0,
    "ai_content": 35.0,
    "consistency": 30.0,
    "cross_reference": 20.0,
    "broker_risk": 20.0,
    "identity": 15.0,
}

SEVERITY_MULTIPLIER: dict[str, float] = {
    "critical": 1.0,
    "high": 0.70,
    "medium": 0.35,
    "low": 0.12,
}

MAX_POSSIBLE = sum(CATEGORY_CAPS.values())  # 145


@dataclass
class ScoringResult:
    score: int            # 0-100
    risk_level: str       # low | medium | high | critical
    recommended_action: str  # approve | manual_review | reject
    summary: str
    category_scores: dict[str, float]
    flag_counts: dict[str, int]


def score(flags: list[Flag]) -> ScoringResult:
    category_raw: dict[str, float] = {cat: 0.0 for cat in CATEGORY_CAPS}
    flag_counts: dict[str, int] = {"critical": 0, "high": 0, "medium": 0, "low": 0}

    for flag in flags:
        cat = flag.category if flag.category in CATEGORY_CAPS else "pdf_forensics"
        contribution = flag.weight * SEVERITY_MULTIPLIER.get(flag.severity, 0.35)
        category_raw[cat] = min(category_raw[cat] + contribution, CATEGORY_CAPS[cat])
        flag_counts[flag.severity] = flag_counts.get(flag.severity, 0) + 1

    raw_total = sum(category_raw.values())
    normalized = min(100, int((raw_total / MAX_POSSIBLE) * 100))

    if normalized >= 70:
        risk_level = "critical"
        action = "reject"
    elif normalized >= 45:
        risk_level = "high"
        action = "manual_review"
    elif normalized >= 20:
        risk_level = "medium"
        action = "manual_review"
    else:
        risk_level = "low"
        action = "approve"

    summary = _build_summary(flags, normalized, flag_counts, risk_level)

    return ScoringResult(
        score=normalized,
        risk_level=risk_level,
        recommended_action=action,
        summary=summary,
        category_scores={k: round(v, 1) for k, v in category_raw.items()},
        flag_counts=flag_counts,
    )


def _build_summary(
    flags: list[Flag],
    score: int,
    counts: dict[str, int],
    risk_level: str,
) -> str:
    critical = [f for f in flags if f.severity == "critical"]
    high = [f for f in flags if f.severity == "high"]

    parts = [f"Fraud risk score: {score}/100 ({risk_level.upper()})."]

    total = sum(counts.values())
    if total == 0:
        parts.append("No fraud indicators detected. Documents appear consistent with genuine submissions.")
        return " ".join(parts)

    parts.append(f"{total} indicator(s) detected: {counts.get('critical', 0)} critical, {counts.get('high', 0)} high, {counts.get('medium', 0)} medium, {counts.get('low', 0)} low.")

    if critical:
        parts.append("Critical findings: " + "; ".join(f.title for f in critical[:3]) + ("." if len(critical) <= 3 else f" (+{len(critical)-3} more)."))

    if high and not critical:
        parts.append("High-severity findings: " + "; ".join(f.title for f in high[:3]) + ".")

    action_text = {
        "reject": "Recommendation: REJECT this application. Escalate to fraud team immediately.",
        "manual_review": "Recommendation: MANUAL REVIEW required before proceeding.",
        "approve": "Recommendation: No significant fraud indicators. Standard processing may proceed.",
    }
    parts.append(action_text.get(
        "reject" if score >= 70 else "manual_review" if score >= 20 else "approve", ""
    ))

    return " ".join(parts)
