import { Tag } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';
import { protectedApiRoute } from '~/lib/session';

export interface TagsData {
  tags: Tag[];
}

export default nextConnect()
  .use(protectedApiRoute)
  .get<NextApiRequest, NextApiResponse<TagsData>>(async (req, res) => {
    const tags = await prisma.tag.findMany({
      where: { userId: req.session.user.id },
      orderBy: { text: 'desc' },
    });
    res.json({ tags });
  });
