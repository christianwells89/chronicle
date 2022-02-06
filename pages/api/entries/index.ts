import { Entry } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

export type EntryWithTags = Omit<Entry, 'id' | 'authorId'> & { tags: string[] };
export type SerializedEntryWithTags = Omit<EntryWithTags, 'date'> & { date: string };

export interface EntriesData {
  entries: SerializedEntryWithTags[];
}

export default nextConnect()
  .get<NextApiRequest, NextApiResponse<EntriesData>>(async (_req, res) => {
    const entries = await prisma.entry.findMany({
      // TODO: get the user from the request session
      where: { authorId: { equals: 1 } },
      orderBy: { date: 'desc' },
      include: { tags: true },
      // TODO: make this customizable through a query param
      take: 10,
    });
    res.json({
      entries: entries.map((e) => {
        const { id, authorId, ...entryWithoutIds } = e;

        return { ...entryWithoutIds, date: e.date.toISOString(), tags: e.tags.map((t) => t.text) };
      }),
    });
  })
  .post<NextApiRequest, NextApiResponse<SerializedEntryWithTags>>(async (req, res) => {
    const body: EntryWithTags = JSON.parse(req.body);
    const { date, title, text, tags } = body;
    // TODO: get from request auth
    const userId = 1;

    // Get or create all relevant tags.
    // TODO: This is copied from the put, so it should be abstracted out somewhere
    const upsertedTags = await Promise.all(
      tags.map((tag) =>
        prisma.tag.upsert({
          // TODO: get user id from auth
          where: { text_userId: { text: tag, userId: 1 } },
          update: {},
          create: { text: tag, userId: 1 },
        }),
      ),
    );
    const tagIds = upsertedTags.map((tag) => ({ id: tag.id }));

    const entry = await prisma.entry.create({
      data: { date, title, text, author: { connect: { id: userId } }, tags: { connect: tagIds } },
      include: { tags: true },
    });

    const serializedEntry = {
      ...entry,
      date: entry.date.toISOString(),
      tags: entry.tags.map((t) => t.text),
    };

    res.status(200).json(serializedEntry);
  });
