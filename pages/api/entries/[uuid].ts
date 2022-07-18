import { Entry, Tag } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';
import { protectedApiRoute } from '~/lib/session';

import { EntryWithTags, SerializedEntryWithTags } from '.';

type Request = NextApiRequest & { query: { uuid: string } };

export default nextConnect<Request, NextApiResponse<SerializedEntryWithTags>>()
  .use(protectedApiRoute)
  .get(async (req, res) => {
    const { uuid } = req.query;

    const entry = await prisma.entry.findFirst({
      where: { uuid, authorId: req.session.user.id },
      include: { tags: true },
    });

    if (entry === null) {
      res.writeHead(404, 'Entry not found');
    } else {
      res.status(200).json({ ...serializeEntry(entry) });
    }
  })
  .put(async (req, res) => {
    const { uuid } = req.query;
    const { date, title, text, tags } = req.body as EntryWithTags;

    const existingEntry = prisma.entry.findFirst({
      where: { uuid, authorId: req.session.user.id },
    });
    if (existingEntry === null) {
      res.writeHead(404, 'Entry not found');
    }

    // Get or create all relevant tags
    const upsertedTags = await Promise.all(
      tags.map((tag) =>
        prisma.tag.upsert({
          where: { text_userId: { text: tag, userId: req.session.user.id } },
          update: {},
          create: { text: tag, userId: req.session.user.id },
        }),
      ),
    );
    const tagIds = upsertedTags.map((tag) => ({ id: tag.id }));

    const entry = await prisma.entry.update({
      where: { uuid },
      data: { date, title, text, tags: { set: tagIds } },
      include: { tags: true },
    });

    res.status(200).json({ ...serializeEntry(entry) });
  })
  .delete(async (req, res) => {
    const { uuid } = req.query;

    await prisma.entry.delete({ where: { uuid } });

    res.writeHead(204).end();
  });

function serializeEntry(
  entry: Entry & {
    tags: Tag[];
  },
): SerializedEntryWithTags {
  const { id, authorId, ...entryWithoutIds } = entry;
  return {
    ...entryWithoutIds,
    date: entry.date.toISOString(),
    tags: entry.tags.map((t) => t.text),
  };
}
