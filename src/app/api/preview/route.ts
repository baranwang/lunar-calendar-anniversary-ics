import { FormType } from '@/app/hooks/use-form-days';
import { fetchAnniversary } from '@/lib/days';
import { NextRequest } from 'next/server';

export interface EventType {
  start: Date;
  title: string;
}

export async function POST(request: NextRequest) {
  const body: FormType = await request.json();
  const { days } = body;
  if (!days.length) {
    return new Response('[]');
  }
  const events: EventType[] = [];
  for (const item of days) {
    const anniversaries = await fetchAnniversary(new Date(item.day), item.temp);
    anniversaries.forEach((anniversary) => {
      events.push({
        start: new Date(anniversary.year, anniversary.month - 1, anniversary.date),
        title: anniversary.title,
      });
    });
  }

  return new Response(JSON.stringify(events));
}
