import { fetchAnniversary } from '@/lib/days';
import { decompressFromBase64 } from '@/lib/deflate';
import { prisma } from '@/lib/prisma';
import handlebars from 'handlebars';
import * as ics from 'ics';
import { createHash } from 'node:crypto';

import type { NextRequest } from 'next/server';

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
    const day = new Date(date);
    const dayData = await prisma.day.findFirst({
      where: {
        year: day.getFullYear(),
        month: day.getMonth() + 1,
        day: day.getDate(),
      },
    });
    if (!dayData) {
      continue;
    }
    const template = handlebars.compile(temp);
    const anniversaries = await fetchAnniversary(dayData);
    anniversaries.forEach((anniversary) => {
      events.push({
        start: [anniversary.year, anniversary.month, anniversary.day],
        duration: { days: 1 },
        title: template({ years: anniversary.year - day.getFullYear() }),
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
