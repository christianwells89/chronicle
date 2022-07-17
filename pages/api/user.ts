import { User } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { protectedApiRoute } from '~/lib/session';

type UserDTO = Pick<User, 'id' | 'username' | 'createdAt'>;

export default nextConnect()
  .use(protectedApiRoute)
  .get<NextApiRequest, NextApiResponse<UserDTO>>((req, res) => {
    const { id, username, createdAt } = req.session.user;
    res.status(200).json({ id, username, createdAt });
  });
