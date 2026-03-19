import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { MockAdapter } from './adapters/mockAdapter';
import { toCsv, toJiraJson } from './jiraExporter';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// For now, use the mock adapter. Real adapters go in ./adapters and implement the same interface.
const adapter = new MockAdapter();

app.post('/api/generate', async (req, res) => {
  const { requirementText, options } = req.body || {};
  if (!requirementText || typeof requirementText !== 'string') {
    return res.status(400).json({ error: 'requirementText is required' });
  }
  try {
    const tests = await adapter.generateTests(requirementText, options || {});
    return res.json({ tests });
  } catch (err: any) {
    console.error('Generation error', err);
    return res.status(500).json({ error: err?.message || 'generation failed' });
  }
});

app.post('/api/export/csv', (req, res) => {
  const { tests } = req.body || {};
  if (!Array.isArray(tests)) return res.status(400).json({ error: 'tests array required' });
  const csv = toCsv(tests);
  res.setHeader('Content-Disposition', 'attachment; filename=tests.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

app.post('/api/export/jira', (req, res) => {
  const { tests } = req.body || {};
  if (!Array.isArray(tests)) return res.status(400).json({ error: 'tests array required' });
  const jiraPayload = toJiraJson(tests);
  res.json({ jira: jiraPayload });
});

app.listen(PORT, () => {
  console.log(`TestcaseGenAI backend listening on http://localhost:${PORT}`);
});
