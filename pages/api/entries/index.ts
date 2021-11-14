import { Entry } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

export interface EntriesData {
  entries: Entry[];
}

export default nextConnect<NextApiRequest, NextApiResponse<EntriesData>>().get(
  async (_req, res) => {
    const entries = await prisma.entry.findMany({
      // TODO: get the user from the request session
      where: { authorId: { equals: 1 } },
      orderBy: { date: 'desc' },
      // TODO: make this customizable through a query param
      take: 10,
    });
    res.json({ entries });
  },
);
