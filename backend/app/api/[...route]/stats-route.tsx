import { Hono } from 'hono';
import db from '@/src/db/';
import { count, eq } from 'drizzle-orm';
import { userStats } from '@/src/db/schema';
import { get } from 'https';

const statsRoute = new Hono();

interface statsData {
  userId: number;
}

statsRoute.post('/update', async (c) => {
  //get results including wpm and acc
  const { userId, acc, wpm } = await c.req.json();
  //grab number of typing tests for userId
  const userInfo = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId));
  const testsCompleted = userInfo[0].testsCompleted
    ? userInfo[0].testsCompleted
    : 0;
  const newTestsTaken = userInfo[0].testsCompleted
    ? userInfo[0].testsCompleted + 1
    : 1;

  const newAcc = userInfo[0].acc
    ? (userInfo[0].acc * testsCompleted + acc) / newTestsTaken
    : 0;
  const newAvgWpm = userInfo[0].avgWpm
    ? (userInfo[0].avgWpm * testsCompleted + wpm) / newTestsTaken
    : 0;
  const newTopWpm = userInfo[0].topWpm
    ? Math.max(userInfo[0].topWpm, wpm)
    : wpm;

  const updatedUserInfo = await db
    .insert(userStats)
    .values({
      userId,
      acc: newAcc,
      avgWpm: newAvgWpm,
      topWpm: newTopWpm,
    })
    .onConflictDoUpdate({
      target: userId,
      set: {
        userId: userId,
        acc: newAcc,
        avgWpm: newAvgWpm,
        topWpm: newTopWpm,
      },
    });

  //  get new count -> new avg is (old avg * old count + new wpm) / new count
  // same for avg wpm
  // top wpm is max current test wpm vs old top wpm this needs to update on a new test entry -> send from api to api
  return c.json({ message: 'Typing test saved' }, 201);
});

export default statsRoute;
