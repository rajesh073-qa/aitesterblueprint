import { GeneratedTestCase } from './adapters/mockAdapter';

export function toCsv(tests: GeneratedTestCase[]): string {
  const header = ['Summary', 'Description', 'Issue Type', 'Priority', 'Labels'];
  const rows = tests.map(t => {
    const description = t.steps.map((s, i) => `${i + 1}. ${s.action}\n   Expected: ${s.expected}`).join('\n');
    return [
      csvSafe(t.title),
      csvSafe(description + (t.notes ? '\nNotes: ' + t.notes : '')),
      'Test',
      t.priority || 'Medium',
      (t.labels || []).join(',')
    ].join(',');
  });
  return `${header.join(',')}\n${rows.join('\n')}`;
}

export function toJiraJson(tests: GeneratedTestCase[]) {
  // Minimal mapping for Jira create API - consumer should map fields appropriately for their Jira instance
  return tests.map(t => ({
    fields: {
      summary: t.title,
      description: t.steps.map((s, i) => `${i + 1}. ${s.action}\nExpected: ${s.expected}`).join('\n'),
      issuetype: { name: 'Test' },
      priority: t.priority ? { name: t.priority } : undefined,
      labels: t.labels || []
    }
  }));
}

function csvSafe(s?: string) {
  if (!s) return '';
  return '"' + s.replace(/"/g, '""') + '"';
}
