import { Hono } from 'hono';

const leaderboardRoute = new Hono();

leaderboardRoute.get('/', (c) => {
  return c.text('hello from leaderboard route!');
});

export default leaderboardRoute;
