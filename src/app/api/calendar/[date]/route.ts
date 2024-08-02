import { prisma } from '@/lib/prisma';
import { format as dateFormat, parse as dateParse } from 'date-fns';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { date: string } }) {
  const date = dateParse(context.params.date, 'yyyyMM', new Date());
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
  return new Response(JSON.stringify(result));
}
