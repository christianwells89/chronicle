import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { ErrorDTO } from '~/lib/fetchJson';
import { publicApiRoute } from '~/lib/session';
import { createUser, getUserByUsername } from '~/lib/user';

export default nextConnect()
  .use(publicApiRoute)
  .put<NextApiRequest, NextApiResponse<undefined | ErrorDTO>>(async (req, res) => {
    const { username, password } = await req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: 'There is already a user with that username' });
    }

    const newUser = await createUser(username, password);

    req.session.user = newUser;
    await req.session.save();

    res.status(204).end();
  });
