import { Hono } from 'hono';
import db from '@/src/db/';
import { avg, count, eq, max } from 'drizzle-orm';
import { userStats, typingTests } from '@/src/db/schema';
import { get } from 'https';

const statsRoute = new Hono();

interface statsData {
  userId: number;
}

export async function getUserStats(userId: number) {
  const result = await db
    .select({
      averageWpm: avg(typingTests.wpm),
      averageAccuracy: avg(typingTests.acc),
      topWpm: max(typingTests.wpm),
      totalTests: count(typingTests.id),
    })
    .from(typingTests)
    .where(eq(typingTests.userId, userId));

  return result[0];
}

statsRoute.get('/:userId', async (c) => {
  //
  console.log('path hit');
  const userId = Number(c.req.param('userId'));
  const stats = await getUserStats(userId);
  return c.json(stats);
});

export default statsRoute;
