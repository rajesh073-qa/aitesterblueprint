# Task Plan

This file documents the overall plan, phases, goals, and checklists for the project.

IMPORTANT: The Blueprint section below must be reviewed and explicitly APPROVED by you before any code or tooling is written.

---

## Overview

Short description: (fill this in)

Owner: (fill in)

Start date: (fill in)

Target delivery: (fill in)

---

## Phases

- Phase 1 — Discovery (questions, constraints, acceptance criteria)  [CURRENT]
- Phase 2 — Design (architecture, data models, API contract, UX)
- Phase 3 — Implementation (coding, integration)
- Phase 4 — Testing (unit, integration, E2E, performance)
- Phase 5 — Delivery & Handover (docs, README, deployment)

---

## Goals

- Deliver a minimal working product satisfying the agreed acceptance criteria.
- Keep work incremental and review Blueprint before coding.
- Provide tests and minimal docs for reproducibility.

---

## Phase checklists

Phase 1 — Discovery
- [ ] Gather requirements and constraints
- [ ] Agree success criteria and non-goals
- [ ] Approve Blueprint in this file

Phase 2 — Design
- [ ] Create architecture diagram (text)
- [ ] Define interfaces, data shapes, and error modes

Phase 3 — Implementation
- [ ] Implement MVP
- [ ] Add unit tests (happy path + edge cases)

Phase 4 — Testing
- [ ] Run tests and fix failures
- [ ] Validate performance and security checks

Phase 5 — Delivery
- [ ] Final README and usage instructions
- [ ] Hand-off notes and open issues

---

## Blueprint (REQUIRES APPROVAL)


Blueprint summary: Suggested Blueprint based on initial project inputs (change as needed)

We will build a test-case generator application that converts Jira requirement descriptions into structured functional and non-functional test cases in Jira-friendly format. The system will provide a TypeScript Node.js backend that orchestrates LLM calls (configurable to use Ollama, LM Studio, Grok, OpenAI, Claude, Gemini), a React frontend for settings and manual review, and connectors for exporting test cases back to Jira (via Jira API) or as downloadable artifacts.

Key decisions (suggested - adjust if needed):
- Tech stack: Node.js (>=18) + TypeScript for backend and generator; React + TypeScript for frontend. Vite or Next.js for React app (choose during design).
- LLM integrations: Pluggable adapters for Ollama, LM Studio, Grok, OpenAI, Claude, Gemini. Default selection configurable in UI and per-run overrides supported.
- Platform(s): Cross-platform development (Windows primary); deployable to Linux servers or containers for production.
- Data formats: Input: free-text Jira requirement (copy/paste or API). Also support OpenAPI/Swagger or example payloads if provided. Output: Jira test case structure (CSV/JSON that maps to Jira fields) and direct Jira API export.
- Storage: Optional persistence of generated tests in a small database (SQLite by default for local) or as files under a repo subfolder. Secrets and API keys use environment variables or platform secret stores (not checked into repo).
- Non-functional constraints: Respect data privacy (no storing of PII unless explicitly allowed); configurable model cost/latency tradeoffs; allow rate limiting for LLM/API calls.

Acceptance criteria (suggested - please confirm or modify):
- AC1: Given a Jira requirement text, the system generates at least one complete functional test case with the following fields: Title, Preconditions, Test Steps, Expected Results, Priority, Estimated Effort, Related Requirement ID.
- AC2: Given a Jira requirement text, the system can also generate at least one non-functional test case (performance, security, usability, reliability) when the requirement implies NFRs; each NFR case must include Test Type, Metrics/Thresholds, Steps, and Measurement Method.
- AC3: Generated outputs can be exported as a Jira-compatible JSON payload and as CSV suitable for bulk import into Jira.
- AC4: A settings UI enables selecting an LLM provider, configuring model, temperature, max-tokens, and toggling output verbosity.
- AC5: End-to-end tests (manual/automated) validate that the generator produces expected fields for 80%+ of sample requirements from a provided sample set.

To approve the Blueprint: edit this file and add a single-line Approval entry under an "Approval" heading, for example:

Approval: Approved by <name> on <date>

Notes:
- No code will be written until you explicitly approve the Blueprint here and answer Discovery questions in `findings.md` or via chat.
- If you prefer, I can also place this Suggested Blueprint into `findings.md` or open a PR/branch. Tell me which you prefer.

---

## Notes

- No code or scripts will be written until the Blueprint is explicitly approved and Discovery questions are answered.
