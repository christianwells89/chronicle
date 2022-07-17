import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { SESSION_OPTIONS } from '~/lib/session';
import { getUserByUsername, validatePassword } from '~/lib/user';

export default withIronSessionApiRoute(loginRoute, SESSION_OPTIONS);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
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
}
