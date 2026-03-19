# Chapter 1: Foundation Model

- **Author:** Prrammod Dutta
- **Role:** Principal SDET
- **Website:** [The Testing Academy](https://thetestingacademy.com/)
- **LinkedIn:** [linkedin.com/in/pramoddutta](https://www.linkedin.com/in/pramoddutta/)

---

## Overview

This chapter covers the foundational concepts and rules for QA professionals working with AI systems.

---

## Contents

### 📚 Core Concepts (`core_concepts/`)

- [ML vs AI vs Deep Learning](core_concepts/ch_01_ml_ai_deep_learning.md) - Foundational concepts and differences
- [LLM Comparisons](core_concepts/ch_01_llm_comparisons.md) - Closed-source vs open-source models for QA
- [Glossary](core_concepts/ch_01_glossary.md) - Quick reference for key terms

### ✅ Rules & Checklists (`rules_checklists/`)

- [Anti-Hallucination Rules](rules_checklists/ch_01_anti_hallucination.md) - Strict verification rules to prevent AI hallucinations
- [LLM QA Verification Checklist](rules_checklists/ch_01_llm_qa_verification_checklist.md) - Manual + automated validation checklist

### 🛠️ Practical Guides (`practical_guides/`)

- [Local LLM Setup with Ollama](practical_guides/ch_01_local_llm_setup_ollama.md) - Run private LLMs locally for QA
- [PRD to Test Cases with Ollama](practical_guides/ch_01_prd_to_test_cases_ollama.md) - Generate test cases from PRDs
- [PRD to Test Cases (Part 2)](practical_guides/ch_01_prd_to_test_cases_ollama_part2.md) - Output examples and extensions

### 🤖 Agent Architecture (`agent_architecture/`)

- [Anti-Hallucination Guard Agent](agent_architecture/ch_01_anti_hallucination_guard_agent.yaml) - Agent-level enforcement for LangFlow

### 📝 Learning & Practice (`learning_practice/`)

- [Exercises](learning_practice/ch_01_exercises.md) - Active learning exercises
- [Exercises - Solutions](learning_practice/ch_01_exercises_solutions.md) - Answer key for exercises
- [Case Study: QA with AI](learning_practice/ch_01_case_study_qa_ai.md) - Applied learning with real-world examples
- [Case Study - Solutions](learning_practice/ch_01_case_study_solutions.md) - Answer key for case study

---

## Directory Structure

```
chapter_01_foundation_model/
├── ch_01_foundation_model.md          # This file (main overview)
│
├── core_concepts/
│   ├── ch_01_ml_ai_deep_learning.md
│   ├── ch_01_llm_comparisons.md
│   └── ch_01_glossary.md
│
├── rules_checklists/
│   ├── ch_01_anti_hallucination.md
│   └── ch_01_llm_qa_verification_checklist.md
│
├── practical_guides/
│   ├── ch_01_local_llm_setup_ollama.md
│   ├── ch_01_prd_to_test_cases_ollama.md
│   └── ch_01_prd_to_test_cases_ollama_part2.md
│
├── agent_architecture/
│   └── ch_01_anti_hallucination_guard_agent.yaml
│
└── learning_practice/
    ├── ch_01_exercises.md
    ├── ch_01_exercises_solutions.md
    ├── ch_01_case_study_qa_ai.md
    └── ch_01_case_study_solutions.md
```