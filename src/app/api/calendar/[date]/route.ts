import { prisma } from '@/lib/prisma';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest, context: { params: { date: string } }) {
  const date = new Date(+context.params.date);
  const days = await prisma.day.findMany({
    where: {
      year: date.getFullYear(),
      month: {
        in: [date.getMonth(), date.getMonth() + 1, date.getMonth() + 2],
      },
    },
  });
  const result = days.reduce<Record<number, string>>((acc, day) => {
    const key = new Date(day.year, day.month - 1, day.day).getTime();
    acc[key] = day.lunarDayName;
    if (day.lunarDay === 1) {
      acc[key] = day.lunarMonthName;
    }
    return acc;
  }, {});
  return new Response(JSON.stringify(result));
}
