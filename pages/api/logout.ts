import { withIronSessionApiRoute } from 'iron-session/next';

import { SESSION_OPTIONS } from '~/lib/session';

export default withIronSessionApiRoute((req, res) => {
  req.session.destroy();
  res.status(204).end();
}, SESSION_OPTIONS);
