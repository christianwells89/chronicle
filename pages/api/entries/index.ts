import { Entry, Tag } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

export type SerializedEntryWithTags = Omit<Entry, 'date'> & { date: string; tags: Tag[] };

export interface EntriesData {
  entries: SerializedEntryWithTags[];
}

export default nextConnect<NextApiRequest, NextApiResponse<EntriesData>>().get(
  async (_req, res) => {
    const entries = await prisma.entry.findMany({
      // TODO: get the user from the request session
      where: { authorId: { equals: 1 } },
      orderBy: { date: 'desc' },
      include: { tags: true },
      // TODO: make this customizable through a query param
      take: 10,
    });
    res.json({ entries: entries.map((e) => ({ ...e, date: e.date.toISOString() })) });
  },
);
