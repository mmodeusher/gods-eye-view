---
description: Agent-to-agent handoff standards for multi-agent workflows.
---

# Workflow Handoff Standards

Load when:
- Multiple agents participate in a task.
- Work is delegated between agents.
- Deliverables are transferred between phases.
- The Orchestrator coordinates execution.

## Universal Handoff Requirements

Every handoff must include:

- Objective
- Deliverables
- Assumptions
- Constraints
- Risks
- Open Questions
- Confidence Level
- Recommended Next Agent

## Confidence Levels

### High

Requirements are understood.
Risks are known.
Deliverables are complete.

### Medium

Work is substantially complete.
Some assumptions remain.

### Low

Significant uncertainty exists.
Escalation may be required.

---

## Required Handoff Template

```text
=== HANDOFF ===

Objective:
[Objective]

Deliverables:
- Deliverable
- Deliverable

Assumptions:
- Assumption

Constraints:
- Constraint

Risks:
- Risk

Open Questions:
- Question

Confidence:
High | Medium | Low

Recommended Next Agent:
[Agent]