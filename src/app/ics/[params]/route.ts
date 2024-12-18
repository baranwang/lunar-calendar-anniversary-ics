
import { decompressFromBase64 } from '@/lib/compress';
import { fetchAnniversary } from '@/lib/days';
import * as ics from 'ics';
import type { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';

type Params = {
  params: string;
};

export async function GET(request: NextRequest, context: { params: Params }) {
  let data: string[][] = [];
  try {
    data = JSON.parse(await decompressFromBase64(context.params.params));
  } catch (e) {
    console.error(e);
  }
  if (!data) {
    return new Response('');
  }

  const hash = createHash('sha256');
  hash.update(JSON.stringify(context.params.params));
  const etag = hash.digest('hex');
  if (etag === request.headers.get('if-none-match')) {
    return new Response(null, { status: 304 });
  }

  const events: ics.EventAttributes[] = [];
  for (const item of data) {
    const [date, temp] = item;
    const anniversaries = await fetchAnniversary(new Date(date), temp);
    anniversaries.forEach((anniversary) => {
      events.push({
        start: [anniversary.year, anniversary.month, anniversary.date],
        duration: { days: 1 },
        title: anniversary.title,
      });
    });
  }

  const { error, value } = ics.createEvents(events);
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const headers = new Headers();
  headers.set('etag', etag);
  return new Response(value, { headers });
}
