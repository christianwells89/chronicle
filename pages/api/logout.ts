import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { publicApiRoute } from '~/lib/session';

export default nextConnect()
  // Technically this isn't true, but it should just be a no-op to destroy an empty session if some
  // user does happen to hit this without being logged in. It would be the same behavior if we
  // protected this route (redirect to login) but it's a little cleaner this way
  .use(publicApiRoute)
  .post<NextApiRequest, NextApiResponse>((req, res) => {
    req.session.destroy();
    res.status(204).end();
  });
