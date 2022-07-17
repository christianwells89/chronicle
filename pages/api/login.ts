import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { ErrorDTO } from '~/lib/fetchJson';
import { publicApiRoute } from '~/lib/session';
import { getUserByUsername, validatePassword } from '~/lib/user';

export default nextConnect()
  .use(publicApiRoute)
  .post<NextApiRequest, NextApiResponse<undefined | ErrorDTO>>(async (req, res) => {
    const { username, password } = await req.body;

    const user = await getUserByUsername(username);

    if (!user) {
      res.status(404).json({ message: 'No user with that username could be found' });
    } else if (!validatePassword(user, password)) {
      res.status(401).json({ message: 'Password is incorrect' });
    } else {
      req.session.user = user;
      await req.session.save();

      res.status(204).end();
    }
  });
