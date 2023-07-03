import { format } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';
import { protectedApiRoute } from '~/lib/session';

// All of the below types probably belong in some central place

// eslint-disable-next-line @typescript-eslint/naming-convention
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// eslint-disable-next-line @typescript-eslint/naming-convention
type d = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

// `${d}${d}${d}${d}` would be more correct, but it results in too many combinations for TS to
// keep track of. This is likely all that is necessary for now
type YYYY = `19${d}${d}` | `20${d}${d}`;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type DD = `${0}${oneToNine}` | `${1 | 2}${d}` | `3${0 | 1}`;

export type Month = `${YYYY}-${MM}`;
export type Day = `${YYYY}-${MM}-${DD}`;

export type EntriesByMonth = Record<Month, number>;

export default nextConnect()
  .use(protectedApiRoute)
  .get<NextApiRequest, NextApiResponse<EntriesByMonth>>(async (req, res) => {
    // This would be ideal, and would shift the load to the db, but primsa doesn't seem to be
    // mapping to what SQLite queries consider to be datetimes. This results in 1 null row
    // const authorId = req.session.user.id;
    // const result = await prisma.$queryRaw<{ month: Month }[]>(
    //   Prisma.sql`SELECT DISTINCT strftime('%Y-%m', date) as month FROM Entry e WHERE authorId = ${authorId} ORDER BY date DESC`,
    // );
    // res.json(result.map((row) => row.month));

    // TODO: this needs to take the user timezone. Right now it's naive to it so just using UTC
    // which would be confusing to the user since all dates in the app are local
    const result = await prisma.entry.findMany({
      where: { authorId: { equals: req.session.user.id } },
      orderBy: { date: 'desc' },
      select: { date: true },
    });

    const months = result.reduce((acc, row) => {
      const month = format(row.date, 'yyyy-MM') as Month;

      acc[month] = acc[month] + 1 || 1;

      return acc;
    }, {} as EntriesByMonth);

    res.json(months);
  });
