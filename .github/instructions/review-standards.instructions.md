---
description: Code review, architecture review, security review, quality assurance, and approval standards for all project work.
applyTo: '**'
---

# Review Standards

## Purpose

This document defines how work must be reviewed before acceptance.

Reviews exist to:

- Find defects.
- Reduce risk.
- Improve maintainability.
- Improve reliability.
- Improve security.
- Ensure project standards are followed.

Reviews are intended to improve outcomes, not assign blame.

---

# Review Principles

Always:

- Be objective.
- Focus on evidence.
- Prioritize impact.
- Explain findings clearly.
- Recommend corrective actions.

Never:

- Approve work solely because it functions.
- Ignore security concerns.
- Ignore maintainability concerns.
- Hide uncertainty.
- Reject work without explanation.

---

# Review Categories

Every review should consider the following areas.

## Correctness

Verify:

- Requirements are met.
- Behavior matches expectations.
- Logic is sound.
- Edge cases are considered.
- Error handling exists.

Potential Findings:

- Logic bugs
- Missing validation
- Incorrect assumptions
- Broken workflows

---

## Security

Verify:

- Inputs are validated.
- Sensitive data is protected.
- Access controls are respected.
- Secrets are not exposed.
- Dependencies do not introduce known risks.

Potential Findings:

- Injection risks
- Authorization issues
- Authentication weaknesses
- Sensitive data exposure
- Insecure defaults

---

## Reliability

Verify:

- Failure scenarios are handled.
- Recovery paths exist.
- Dependencies are managed.
- System behavior is predictable.

Potential Findings:

- Crash conditions
- Data corruption risks
- Failure recovery gaps
- Operational instability

---

## Performance

Verify:

- Resource usage is reasonable.
- Expensive operations are justified.
- Scalability concerns are identified.

Potential Findings:

- Slow queries
- Excessive API calls
- Memory inefficiencies
- Scalability bottlenecks

---

## Maintainability

Verify:

- Code is understandable.
- Components have clear responsibilities.
- Duplication is minimized.
- Complexity is reasonable.

Potential Findings:

- Overengineering
- Tight coupling
- Technical debt
- Poor separation of concerns

---

## Testing

Verify:

- Testing approach is documented.
- Important paths are covered.
- Edge cases are evaluated.

Potential Findings:

- Missing tests
- Weak coverage
- Untested failure scenarios

---

# Severity Levels

Every finding must have a severity.

---

## Critical

Definition:

Issue can cause:

- Security compromise
- Data loss
- Major service failure
- Regulatory violation

Examples:

- Secret exposure
- Privilege escalation
- Data deletion risks
- Critical architectural failures

Required Action:

Must be fixed before approval.

---

## High

Definition:

Issue presents substantial risk.

Examples:

- Significant bugs
- Reliability failures
- Architectural weaknesses
- Security concerns

Required Action:

Normally fixed before approval.

---

## Medium

Definition:

Issue impacts quality or maintainability.

Examples:

- Missing validation
- Missing tests
- Performance concerns
- Maintainability issues

Required Action:

Fix before completion when practical.

---

## Low

Definition:

Issue has limited impact.

Examples:

- Naming problems
- Minor refactoring opportunities
- Documentation gaps
- Style inconsistencies

Required Action:

Optional unless accumulated debt becomes significant.

---

# Required Review Output

Every review must include:

```text
# Review Summary

[Overall assessment]

# Findings

### Finding

Severity:
Critical | High | Medium | Low

Category:
Correctness
Security
Reliability
Performance
Maintainability
Testing

Problem:
[Description]

Impact:
[Impact]

Recommendation:
[Recommended Fix]

# Positive Findings

- Positive observation

# Approval Recommendation

Approve
Approve With Minor Changes
Requires Changes
Reject
```

---

# Approval Rules

## Approve

Conditions:

- No Critical findings.
- No unresolved High findings.
- Risks understood and acceptable.

---

## Approve With Minor Changes

Conditions:

- Only Low findings exist.
- Minor Medium findings may exist.
- No significant risk remains.

---

## Requires Changes

Conditions:

- One or more High findings.
- Multiple Medium findings.
- Validation incomplete.

Approval withheld pending remediation.

---

## Reject

Conditions:

- Critical findings.
- Severe architectural concerns.
- Severe security concerns.
- Major requirement failures.

Work must be reworked before reconsideration.

---

# Architecture Review Standards

Review:

- System boundaries
- Component responsibilities
- Interface design
- Scalability assumptions
- Reliability assumptions
- Tradeoffs

Verify:

- Architecture supports requirements.
- Complexity is justified.
- Risks are documented.

---

# Implementation Review Standards

Review:

- Code quality
- Error handling
- Input validation
- Maintainability
- Technical debt

Verify:

- Implementation matches architecture.
- Acceptance criteria are met.

---

# AI Review Standards

For prompts, agents, or AI workflows review:

- Accuracy risks
- Hallucination risks
- Prompt injection risks
- Tool misuse risks
- Reliability concerns

Verify:

- Evaluation was performed.
- Risks are documented.
- Safety constraints exist.

---

# Security Review Requirements

Security review is mandatory when work involves:

- Authentication
- Authorization
- User data
- API access
- External integrations
- Secrets management
- AI tool execution

Security findings take priority over all other findings.

---

# Review Anti-Patterns

Avoid:

- Reviewing style before correctness.
- Reviewing performance before security.
- Focusing only on happy paths.
- Ignoring assumptions.
- Ignoring operational risks.

Priority Order:

1. Security
2. Correctness
3. Reliability
4. Maintainability
5. Performance
6. Style

---

# Escalation Requirements

Escalate immediately when:

- Critical findings are discovered.
- Data loss risk exists.
- Security compromise is possible.
- System stability is threatened.

Follow escalation procedures defined in:

```text
02-escalation-rules.md
```

---

# Reviewer Definition Of Success

A reviewer is successful when:

- Significant risks are identified.
- Findings are actionable.
- Unnecessary rework is avoided.
- Quality improves.
- Approval decisions are justified.

The goal is not to find flaws.

The goal is to protect quality, reliability, security, and maintainability.