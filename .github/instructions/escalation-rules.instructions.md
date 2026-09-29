---
description: Failure detection, escalation rules, blocker handling, workflow recovery procedures, and governance standards for multi-agent workflows.
applyTo: '**'
---

# Escalation Rules

## Purpose

This document defines when agents must:

- Stop work.
- Declare uncertainty.
- Report blockers.
- Escalate issues.
- Request reassignment.
- Trigger workflow recovery.

Escalation exists to prevent:

- Hallucinated conclusions.
- Endless implementation loops.
- Invalid assumptions.
- Low-quality outputs.
- Context loss.
- Hidden failures.

When in doubt, escalate rather than invent information.

---

# Escalation Principles

Always:

- Surface uncertainty.
- Report blockers immediately.
- Document missing requirements.
- Escalate unresolved risks.
- Prefer transparency over speculation.

Never:

- Invent missing facts.
- Hide failure.
- Ignore known risks.
- Continue on invalid assumptions.
- Mark blocked work as complete.

---

# Confidence Requirements

Every agent must report:

```text
Confidence:
High
Medium
Low
```

## High

Requirements are understood.

Evidence is sufficient.

Deliverables are validated.

Proceed normally.

---

## Medium

Minor uncertainty exists.

Document assumptions.

Proceed cautiously.

---

## Low

Significant uncertainty exists.

Escalation required.

Work should not continue without intervention.

---

# Escalation Triggers

Escalation is mandatory when any trigger below occurs.

---

## Missing Information

Trigger:

- Required inputs unavailable.
- Missing requirements.
- Incomplete task definition.
- Missing dependencies.

Escalate To:

```text
Research
```

or

```text
Orchestrator
```

Required Action:

Request missing information.

Do not invent requirements.

---

## Conflicting Information

Trigger:

- Sources disagree.
- Requirements contradict.
- Multiple valid interpretations exist.

Escalate To:

```text
Research
```

then

```text
Orchestrator
```

Required Action:

Document all conflicting evidence.

Request clarification or decision.

---

## Architectural Uncertainty

Trigger:

- Undefined interfaces.
- Undefined contracts.
- Architecture conflicts.
- Scalability concerns.
- Security concerns affecting design.

Escalate To:

```text
Architect
```

Required Action:

Suspend implementation until architecture is clarified.

---

## Implementation Failure

Trigger:

- Repeated failed attempts.
- Dependency issues.
- Integration issues.
- Inability to implement approved design.

Escalate To:

```text
Architect
```

and notify:

```text
Orchestrator
```

Required Action:

Document technical blocker.

Recommend alternative approaches.

---

## Review Failure

Trigger:

- Critical bug discovered.
- Security vulnerability discovered.
- Data integrity concern.
- Reliability issue.
- Architecture violation.

Escalate To:

```text
Builder
```

Required Action:

Remediation required before approval.

Re-review required.

---

## AI Reliability Failure

Trigger:

- Hallucination risk.
- Prompt injection vulnerability.
- Unsafe behavior.
- Tool misuse.
- Unstable outputs.

Escalate To:

```text
Prompt Engineer
```

Required Action:

Mitigation required.

Retesting required.

---

# Iteration Limits

To prevent infinite loops:

## Builder Review Cycle

Maximum:

```text
Builder
↓
Reviewer
↓
Builder
↓
Reviewer
```

After:

```text
2 failed review cycles
```

Escalate To:

```text
Architect
```

Required Action:

Root-cause review.

Potential redesign.

---

## AI Optimization Cycle

Maximum:

```text
Prompt Engineer
↓
AI Evaluator
↓
Prompt Engineer
↓
AI Evaluator
```

After:

```text
2 failed evaluation cycles
```

Escalate To:

```text
Architect
```

Required Action:

Workflow redesign.

---

# Blocked Status Rules

Agents must declare:

```text
Status: Blocked
```

when:

- Missing information prevents progress.
- Required dependency unavailable.
- Confidence is low.
- Failure cannot be resolved independently.
- Escalation threshold reached.

Blocked work may not be marked complete.

---

# Blocker Report Template

```text
=== BLOCKER REPORT ===

Agent:
[Agent Name]

Status:
Blocked

Reason:
[Description]

Missing Inputs:
- Item
- Item

Risks:
- Risk

Attempted Actions:
- Action
- Action

Confidence:
Low

Recommended Next Agent:
[Agent]

Required Resolution:
[Resolution]
```

---

# Handoff Rejection Rules

Receiving agents must reject handoffs when:

- Objective missing.
- Deliverables missing.
- Risks undocumented.
- Confidence omitted.
- Required validation absent.

Required Response:

```text
HANDOFF REJECTED

Reason:
Incomplete Handoff

Return To:
Previous Agent
```

---

# Orchestrator Intervention Rules

The Orchestrator must intervene when:

## Repeated Failure

Trigger:

Same issue survives three workflow passes.

Example:

```text
Builder
↓
Reviewer
↓
Builder
↓
Reviewer
↓
Builder
```

Action:

```text
Workflow Pause
```

Required:

- Root cause analysis.
- Workflow redesign.
- Reassignment if necessary.

---

## Contradictory Recommendations

Trigger:

Two agents recommend materially different solutions.

Action:

```text
Decision Review
```

Required:

- Document options.
- Document tradeoffs.
- Select preferred approach.

---

## Scope Expansion

Trigger:

Task scope materially exceeds original request.

Examples:

- Additional systems required.
- New objectives introduced.
- Significant architecture changes discovered.

Action:

```text
Workflow Replanning
```

Required:

Updated objectives and success criteria.

---

# Emergency Escalations

## Security Risk

Priority:

```text
Critical
```

Escalation Path:

```text
Reviewer
→ Architect
→ Orchestrator
```

Required:

Immediate review.

Work may not proceed until risk is addressed.

---

## Data Integrity Risk

Priority:

```text
Critical
```

Escalation Path:

```text
Reviewer
→ Architect
→ Orchestrator
```

Required:

Validation before deployment.

---

## Production Stability Risk

Priority:

```text
High
```

Escalation Path:

```text
Builder
→ Reviewer
→ Architect
→ Orchestrator
```

Required:

Risk assessment and mitigation plan.

---

# Failure Report Template

```text
=== FAILURE REPORT ===

Agent:
[Agent Name]

Failure Type:
Knowledge Gap
Architecture Issue
Implementation Failure
Review Failure
AI Reliability Failure
Security Risk
Other

Description:
[Details]

Impact:
[Impact]

Attempted Resolution:
[Actions]

Confidence:
Low

Status:
Blocked

Recommended Escalation:
[Agent]
```

---

# Recovery Workflow

```text
Failure Detected
        ↓
Failure Report Created
        ↓
Escalation Triggered
        ↓
Specialist Assigned
        ↓
Root Cause Identified
        ↓
Corrective Action Taken
        ↓
Validation Performed
        ↓
Workflow Resumes
```

---

# Escalation Golden Rules

1. Escalate early.
2. Never hide uncertainty.
3. Never invent missing information.
4. Blocked work is not completed work.
5. Risk must be visible.
6. Security issues always take priority.
7. Low confidence requires escalation.
8. Repeated failures require intervention.
9. Quality is more important than speed.
10. Transparency is mandatory.