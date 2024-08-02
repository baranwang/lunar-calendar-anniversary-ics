import { FormType } from '@/app/hooks/use-form-days';
import { fetchAnniversary } from '@/lib/days';
import { prisma } from '@/lib/prisma';
import handlebars from 'handlebars';
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
    const date = new Date(item.day);
    const dayData = await prisma.day.findFirst({
      where: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
    });
    if (!dayData) {
      continue;
    }
    const template = handlebars.compile(item.temp);
    const anniversaries = await fetchAnniversary(dayData);
    anniversaries.forEach((anniversary) => {
      events.push({
        start: new Date(anniversary.year, anniversary.month - 1, anniversary.day),
        title: template({ years: anniversary.year - date.getFullYear() }),
      });
    });
  }

  return new Response(JSON.stringify(events));
}
