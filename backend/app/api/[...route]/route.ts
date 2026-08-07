import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';
import usersRoute from './users-route';
import leaderboardRoute from './leaderboard-route';
import typingTestRoute from './typing-test-route';

export const runtime = 'edge';

const app = new Hono().basePath('/api/');

app.use(
  '*',
  cors({
    origin: 'http://localhost:3000',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-type', 'Authorization'],
    credentials: true,
  }),
);
app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  });
});

app.route('/users', usersRoute);
app.route('/leaderboard', leaderboardRoute);
app.route('/typing-tests', typingTestRoute);

export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
