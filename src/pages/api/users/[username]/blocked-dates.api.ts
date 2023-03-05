import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end();
  }

  const username = String(req.query.username);

  const { year, month } = req.query;

  if (!year || !month) {
    res.status(400).json({
      message: 'Year and month are required'
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username
    }
  });

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true
    },
    where: {
      user_id: user.id
    }
  });

  const blockedWeekDays = Array.from({ length: 7 }, (_, i) => i).filter(
    (weekDay) =>
      !availableWeekDays.some(
        (availableWeekDay) => availableWeekDay.week_day === weekDay
      )
  );

  const blockedDatesRaw = await prisma.$queryRaw<{ date: number }[]>`
    SELECT
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      ((UTI.end_time_in_minutes - UTI.start_time_in_minutes) / 60) AS size
    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
        ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user.id}
        AND DATE_FORMAT(S.date, '%Y-%m') = ${`${year}-${month}`}

    GROUP BY 
      EXTRACT(DAY FROM S.date),
      ((UTI.end_time_in_minutes - UTI.start_time_in_minutes) / 60)

    HAVING 
        amount >= size
  `;

  const blockedDates = blockedDatesRaw.map((raw) => raw.date);

  return res.json({
    blockedWeekDays,
    blockedDates
  });
}
