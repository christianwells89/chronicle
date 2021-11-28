import { Tag } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

export interface TagsData {
  tags: Tag[];
}

export default nextConnect<NextApiRequest, NextApiResponse<TagsData>>().get(async (_req, res) => {
  const tags = await prisma.tag.findMany({
    where: { userId: 1 },
    orderBy: { text: 'desc' },
  });
  res.json({ tags });
});
