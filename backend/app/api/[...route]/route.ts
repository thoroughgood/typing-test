import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import usersRoute from './users-route';
import leaderboardRoute from './leaderboard-route';

export const runtime = 'edge';

const app = new Hono().basePath('/api/');

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  });
});

app.route('/users', usersRoute);
app.route('/leaderboard', leaderboardRoute);
export const GET = handle(app);
