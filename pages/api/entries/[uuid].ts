import { Entry } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { prisma } from '~/lib/client';

interface Data {
  entry: Entry;
}

type Request = NextApiRequest & { query: { uuid: string } };

// TODO: a PUT method to update an existing entry
export default nextConnect<Request, NextApiResponse<Data>>().get(async (req, res) => {
  const { uuid } = req.query;
  const entry = await prisma.entry.findFirst({ where: { uuid } });
  if (entry === null) {
    res.writeHead(404, 'Entry not found');
  } else {
    res.status(200).json({ entry });
  }
});
