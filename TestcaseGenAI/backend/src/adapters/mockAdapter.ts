export interface GeneratedStep {
  action: string;
  expected: string;
}

export interface GeneratedTestCase {
  id?: string;
  title: string;
  type: 'functional' | 'non-functional';
  preconditions?: string[];
  steps: GeneratedStep[];
  priority?: string;
  labels?: string[];
  notes?: string;
}

export class MockAdapter {
  async generateTests(requirementText: string): Promise<GeneratedTestCase[]> {
    // Very simple deterministic mock: split sentences and build one test with steps
    const sentences = requirementText
      .split(/(?<=[.?!])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    const steps = sentences.map((s, i) => ({ action: `Step ${i + 1}: ${s}`, expected: `Expected result for: ${s}` }));

    const functional: GeneratedTestCase = {
      title: sentences.slice(0, 2).join(' ').slice(0, 120) || 'Generated functional test',
      type: 'functional',
      preconditions: [],
      steps,
      priority: 'Medium',
      labels: ['generated']
    };

    // Simple heuristic: if text contains words like "latency", "load", "throughput", produce a performance NFR
    const nfrKeywords = ['latency', 'throughput', 'load', 'performance', 'response time', 'concurrent'];
    const lower = requirementText.toLowerCase();
    const nfrs: GeneratedTestCase[] = [];
    if (nfrKeywords.some(k => lower.includes(k))) {
      nfrs.push({
        title: 'Performance test - generated',
        type: 'non-functional',
        preconditions: [],
        steps: [{ action: 'Run load scenario', expected: '95th percentile latency < TBD' }],
        priority: 'High',
        labels: ['nfr', 'performance']
      });
    }

    return [functional, ...nfrs];
  }
}
