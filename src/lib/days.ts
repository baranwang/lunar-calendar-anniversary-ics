import { prisma } from './prisma';

import type { Day, Prisma } from '@prisma/client';

export const fetchAnniversary = async (day: Day, take?: number) => {
  const where: Prisma.DayFindManyArgs['where'] = {
    lunarYear: {
      gt: day.lunarYear,
    },
    lunarMonth: day.lunarMonth,
    lunarDay: day.lunarDay,
  };
  if (day.isLeapMonth) {
    const leapYears = await prisma.day
      .findMany({
        where: {
          lunarYear: {
            gt: day.lunarYear,
          },
          lunarMonth: day.lunarMonth,
          lunarDay: day.lunarDay,
          isLeapMonth: { equals: 1 },
        },
      })
      .then((res) => res.map((item) => item.lunarYear));
    where.OR = [
      {
        isLeapMonth: 1,
      },
      {
        AND: [{ isLeapMonth: 0 }, { lunarYear: { notIn: leapYears } }],
      },
    ];
  } else {
    where.isLeapMonth = { not: 1 };
  }
  const args: Prisma.DayFindManyArgs = {
    where,
    orderBy: {
      lunarYear: 'asc',
    },
  };
  if (take) {
    args.take = take;
  }
  return prisma.day.findMany(args);
};
