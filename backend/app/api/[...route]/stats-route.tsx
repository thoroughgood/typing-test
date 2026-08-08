import { Hono } from 'hono';
import db from '@/src/db/';
import { count, eq } from 'drizzle-orm';
import { userStats, typingTests } from '@/src/db/schema';
import { get } from 'https';

const statsRoute = new Hono();

interface statsData {
  userId: number;
}

statsRoute.post('/update', async (c) => {
  //get results including wpm and acc
  const userId = await c.req.json();
  //grab number of typing tests for userId
  const originalCount = await db
    .select({ count: count() })
    .from(typingTests)
    .where(eq(typingTests.userId, userId));
  const newCount = originalCount[0].count + 1;
  //  get new count -> new avg is (old avg * old count + new wpm) / new count
  // same for avg wpm
  // top wpm is max current test wpm vs old top wpm this needs to update on a new test entry -> send from api to api
  return c.json({ message: 'Typing test saved' }, 201);
});

export default statsRoute;
