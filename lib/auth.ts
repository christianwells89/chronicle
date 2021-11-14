import type { NextApiRequest } from 'next';

interface Session {
  userId: number;
}

export async function getLoginSession(_req: NextApiRequest): Promise<Session> {
  // TODO: get the session from the cookie on the request
  return { userId: 1 };
}
