import { ParsedUrlQuery } from 'querystring';

import type { User } from '@prisma/client';
import { hoursToSeconds } from 'date-fns';
import type { IronSessionOptions } from 'iron-session';
import { ironSession } from 'iron-session/express';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import nextConnect from 'next-connect';

const ttl = hoursToSeconds(8);

export const SESSION_OPTIONS: IronSessionOptions = {
  password: process.env.TOKEN_SECRET,
  cookieName: 'chronicleCookie',
  ttl,
  cookieOptions: {
    httpOnly: true,
    // Ensure it expires before the server considers it expired
    maxAge: ttl - 60,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    // This is typed as non-optional to make access in routes nicer, since any route should be using
    // the below to guard against it not being present
    user: User;
  }
}

export const protectedApiRoute = nextConnect()
  .use(ironSession(SESSION_OPTIONS))
  .use((req, res, next) => {
    if (!req.session.user) {
      res.writeHead(401).end();
    } else {
      next();
    }
  });

export function protectedSsr<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
>(
  handler: (
    context: GetServerSidePropsContext<Q>,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  const guardHandler = (context: GetServerSidePropsContext<Q>) => {
    if (!context.req.session.user) {
      return {
        redirect: {
          permanent: false,
          destination: `/login?returnPath=${context.req.url ?? '/'}`,
        },
      };
    }
    return handler(context);
  };

  // @ts-ignore - iron-session doesn't allow passing the query params type to the context. Seems
  // like it's just an oversight and not fully satisfying the GetServerSideProps type it is supposed
  // to supplant
  return withIronSessionSsr<P>(guardHandler, SESSION_OPTIONS);
}
