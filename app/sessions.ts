import { createCookieSessionStorage, redirect } from 'remix';
import api from './api';

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",

      // all of these are optional
      domain: "localhost",
      expires: new Date(Date.now() + 15_000),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true
    }
  });

export async function checkSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  
  if (!session.has('userId')) {
    // @ts-ignore
    throw new redirect('/login');
  }

  api.provider().setJWT(session.get('jwt').toString());

  return session;
}

export { getSession, commitSession, destroySession };
