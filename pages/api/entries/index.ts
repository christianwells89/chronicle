import type { Entry, Prisma } from '@prisma/client';
import { add, parseISO } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';
import { protectedApiRoute } from '~/lib/session';

export type EntryWithTags = Omit<Entry, 'id' | 'authorId'> & { tags: string[] };
export type SerializedEntryWithTags = Omit<EntryWithTags, 'date'> & { date: string };

export interface EntriesData {
  entries: SerializedEntryWithTags[];
}

export default nextConnect()
  .use(protectedApiRoute)
  .get<NextApiRequest, NextApiResponse<EntriesData>>(async (req, res) => {
    const dateQuery = getDateQuery(req);
    const entries = await prisma.entry.findMany({
      where: { authorId: { equals: req.session.user.id }, date: dateQuery },
      orderBy: { date: 'desc' },
      include: { tags: true },
    });
    res.json({
      entries: entries.map((e) => {
        const { id, authorId, ...entryWithoutIds } = e;

        return { ...entryWithoutIds, date: e.date.toISOString(), tags: e.tags.map((t) => t.text) };
      }),
    });
  })
  .post<NextApiRequest, NextApiResponse<SerializedEntryWithTags>>(async (req, res) => {
    const { body } = req;
    const { date, title, text, tags } = body as EntryWithTags;
    const userId = req.session.user.id;

    // Get or create all relevant tags.
    // TODO: This is copied from the put, so it should be abstracted out somewhere
    const upsertedTags = await Promise.all(
      tags.map((tag) =>
        prisma.tag.upsert({
          where: { text_userId: { text: tag, userId } },
          update: {},
          create: { text: tag, userId },
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

function getDateQuery(req: NextApiRequest): Prisma.DateTimeFilter {
  const dateParam = req.query.date;
  if (!dateParam || typeof dateParam !== 'string') {
    return {};
  }

  // Right now this is always a month, so we'll always add a month to this
  const date = parseISO(dateParam);
  const upperLimit = add(date, { months: 1 });
  return { gte: date, lte: upperLimit };
}
