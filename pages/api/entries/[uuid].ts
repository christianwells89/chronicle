import { Entry } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

import { EntryWithTags } from '.';

interface Data {
  entry: Entry;
}

type Request = NextApiRequest & { query: { uuid: string } };

export default nextConnect<Request, NextApiResponse<Data>>()
  .get(async (req, res) => {
    const { uuid } = req.query;

    const entry = await prisma.entry.findFirst({ where: { uuid } });

    if (entry === null) {
      res.writeHead(404, 'Entry not found');
    } else {
      res.status(200).json({ entry });
    }
  })
  .put(async (req, res) => {
    // TODO: validate that this user actually owns this entry
    const { uuid } = req.query;
    const body: EntryWithTags = JSON.parse(req.body);
    const { date, title, text, tags } = body;

    // Get or create all relevant tags
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

    const entry = await prisma.entry.update({
      where: { uuid },
      data: { date, title, text, tags: { set: tagIds } },
    });

    res.status(200).json({ entry });
  });
