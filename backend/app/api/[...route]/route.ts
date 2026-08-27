import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

import usersRoute from './users-route';
import leaderboardRoute from './leaderboard-route';
import typingTestRoute from './typing-test-route';
import statsRoute from './stats-route';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const allowedOrigins = [
  'https://typing-test-iota-two.vercel.app',
  'http://localhost:3000',
];

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      return undefined;
    },
    allowMethods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.route('/users', usersRoute);
app.route('/leaderboard', leaderboardRoute);
app.route('/typing-tests', typingTestRoute);
app.route('/stats', statsRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
