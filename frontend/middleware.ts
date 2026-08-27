import { NextRequest } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: process.env.AUTH0_SCOPE,
    audience: process.env.AUTH0_AUDIENCE,
  },
});

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
