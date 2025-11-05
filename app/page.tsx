"use client";

import { useCallback, useMemo, useState } from 'react';

type GenerateResponse = {
  html: string;
  keywords: { primary: string[]; secondary: string[] };
  meta: { title: string; description: string };
};

export default function HomePage() {
  const [words, setWords] = useState<number>(1200);
  const [location, setLocation] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("helpful");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);

  const canSubmit = useMemo(() => {
    return !loading && words >= 300 && !!field.trim();
  }, [loading, words, field]);

  const onSubmit = useCallback(async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setLoading(true);
    setData(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words, location, field, topic, tone })
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = (await res.json()) as GenerateResponse;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [words, location, field, topic, tone]);

  const copyHtml = useCallback(async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.html);
  }, [data]);

  const downloadHtml = useCallback(() => {
    if (!data) return;
    const blob = new Blob([data.html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <main className="grid">
      <section className="card">
        <form className="form" onSubmit={onSubmit}>
          <div>
            <label>Target word count</label>
            <input type="number" min={300} max={5000} value={words} onChange={(e) => setWords(parseInt(e.target.value || '0', 10))} placeholder="e.g. 1200" />
          </div>
          <div>
            <label>Location (optional)</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. New York, US" />
          </div>
          <div className="full">
            <label>Field / Industry</label>
            <input value={field} onChange={(e) => setField(e.target.value)} placeholder="e.g. Real Estate Marketing" />
          </div>
          <div className="full">
            <label>Topic (optional)</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Neighborhood SEO Strategies" />
          </div>
          <div>
            <label>Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="helpful">Helpful</option>
              <option value="expert">Expert</option>
              <option value="storytelling">Storytelling</option>
              <option value="conversational">Conversational</option>
            </select>
          </div>
          <div className="actions" style={{ alignSelf: 'end' }}>
            <button type="submit" disabled={!canSubmit}>{loading ? 'Generating?' : 'Generate Article'}</button>
            {data && (
              <>
                <button type="button" onClick={copyHtml}>Copy HTML</button>
                <button type="button" onClick={downloadHtml}>Download HTML</button>
              </>
            )}
          </div>
        </form>
        {error && <p style={{ color: '#b91c1c', marginTop: 12 }}>{error}</p>}
      </section>

      <aside className="aside">
        <h3 style={{ marginTop: 0 }}>Keywords</h3>
        {!data && <p>Keywords will appear here after generation.</p>}
        {data && (
          <div>
            <p style={{ marginBottom: 6 }}><strong>Primary</strong></p>
            <div>
              {data.keywords.primary.map((k) => (
                <span key={`p-${k}`} className="kpill">{k}</span>
              ))}
            </div>
            <p style={{ marginBottom: 6, marginTop: 12 }}><strong>Secondary</strong></p>
            <div>
              {data.keywords.secondary.map((k) => (
                <span key={`s-${k}`} className="kpill">{k}</span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <section className="card" style={{ gridColumn: '1 / -1' }}>
        <div className="article" dangerouslySetInnerHTML={{ __html: data?.html ?? '<p>Generated article will render here.</p>' }} />
      </section>
    </main>
  );
}
