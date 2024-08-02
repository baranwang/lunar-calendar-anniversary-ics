import { prisma } from '@/lib/prisma';
import { format as dateFormat, parse as dateParse } from 'date-fns';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { date: string } }) {
  const dateStr = context.params.date;
  if (!dateStr) {
    return new Response(null, { status: 400 });
  }
  if (dateStr === request.headers.get('if-none-match')) {
    return new Response(null, { status: 304 });
  }
  const date = dateParse(dateStr, 'yyyyMM', new Date());
  const days = await prisma.day.findMany({
    where: {
      year: date.getFullYear(),
      month: {
        in: [date.getMonth(), date.getMonth() + 1, date.getMonth() + 2],
      },
    },
  });
  const result = days.reduce<Record<string, string>>((acc, day) => {
    const key = dateFormat(new Date(day.year, day.month - 1, day.day), 'yyyy-MM-dd');
    acc[key] = day.lunarDayName;
    if (day.lunarDay === 1) {
      acc[key] = day.lunarMonthName;
    }
    return acc;
  }, {});
  const headers = new Headers();
  headers.set('etag', dateStr);
  headers.set('cache-control', 'public, max-age=3600');
  return new Response(JSON.stringify(result), {
    headers,
  });
}
