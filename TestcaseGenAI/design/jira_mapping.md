# Jira Mapping

Default mapping from generated test fields to Jira fields (customize per Jira instance):

- Summary -> `summary`
- Description -> `description` (markdown with steps)
- Steps -> included in `description` as ordered list or stored in a custom `test_steps` field if available
- Expected Result -> inside each step's expected outcome
- Issue Type -> `Test`
- Priority -> `priority`
- Labels -> `labels`
- Components -> `components`
- Epic Link -> `epic_link`

Export formats
- Jira JSON: follows Jira REST API field structure. Provide a configurable mapping file for different Jira projects.
- CSV: columns for Summary, Description, Issue Type, Priority, Labels, Components.
