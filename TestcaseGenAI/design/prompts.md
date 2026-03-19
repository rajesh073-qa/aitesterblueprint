# Prompt Templates

Store editable prompt templates here. Each provider may require small adjustments; keep a generic canonical prompt and provider-specific variants.

Canonical prompt (human-readable):

Given the following Jira requirement, produce structured test cases in JSON with fields: title, type (functional|non-functional), preconditions, steps (array of step objects with action and expected), priority, estimates, labels, and any metrics (for NFRs). Provide at least one functional test case and include NFRs if applicable.

Example template variables:
- {{requirement_text}}
- {{tone}} (concise / detailed)

Provider hints
- For local providers, prefer shorter prompts and lower token usage.
- For high-quality providers, increase instruction detail and include examples.
