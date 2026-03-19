import React, { useState } from 'react';
import axios from 'axios';

type GeneratedStep = { action: string; expected: string };
type GeneratedTestCase = { title: string; type: string; steps: GeneratedStep[]; priority?: string; labels?: string[] };

export default function App() {
  const [text, setText] = useState('');
  const [tests, setTests] = useState<GeneratedTestCase[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const resp = await axios.post('/api/generate', { requirementText: text });
      setTests(resp.data.tests || []);
    } catch (err) {
      console.error(err);
      alert('Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    // call backend to get CSV as download
    axios.post('/api/export/csv', { tests }, { responseType: 'blob' }).then(resp => {
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tests.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>TestcaseGenAI</h1>
      <div>
        <label>Paste Jira requirement:</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={6} style={{ width: '100%' }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={generate} disabled={loading || !text}>Generate</button>
        <button onClick={downloadCsv} disabled={tests.length === 0} style={{ marginLeft: 8 }}>Export CSV</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <h2>Generated Tests</h2>
        {tests.length === 0 && <div>No tests yet</div>}
        {tests.map((t, idx) => (
          <div key={idx} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
            <strong>{t.title}</strong> <span style={{ marginLeft: 8 }}>{t.type}</span>
            <div>Priority: {t.priority}</div>
            <ol>
              {t.steps.map((s, i) => (
                <li key={i}>
                  <div>{s.action}</div>
                  <div style={{ fontStyle: 'italic' }}>{s.expected}</div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
