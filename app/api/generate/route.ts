import { NextRequest } from 'next/server';
import { extractKeywords } from '@lib/keywords';
import { generateArticle } from '@lib/generate';
import { searchWeb } from '@lib/search';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const words = Math.max(300, Math.min(5000, Number(body?.words ?? 1200)));
    const location = String(body?.location ?? '').trim();
    const field = String(body?.field ?? '').trim();
    const topic = String(body?.topic ?? '').trim();
    const tone = String(body?.tone ?? 'helpful');

    if (!field) {
      return new Response(JSON.stringify({ error: 'Field is required' }), { status: 400 });
    }

    const queryBase = [topic || field, location].filter(Boolean).join(' ');

    let searchResults = [] as Awaited<ReturnType<typeof searchWeb>>;
    try {
      searchResults = await searchWeb(`${queryBase} insights trends guide 2025`);
    } catch {
      searchResults = [];
    }

    const keywords = extractKeywords({
      field,
      location,
      topic,
      results: searchResults,
    });

    const { html, meta } = generateArticle({
      words,
      field,
      location,
      topic,
      tone,
      primaryKeywords: keywords.primary,
      secondaryKeywords: keywords.secondary,
    });

    return Response.json({ html, keywords, meta });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'Server error' }), { status: 500 });
  }
}
