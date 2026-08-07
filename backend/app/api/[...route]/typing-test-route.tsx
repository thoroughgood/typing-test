import { Hono } from 'hono';
import db from '@/src/db/';
import { eq } from 'drizzle-orm';
import { typingTests } from '@/src/db/schema';
import { get } from 'https';

const typingTestRoute = new Hono();

interface typingTestData {
  wpm: string;
  accuracy: string;
  userId: number;
}

async function typingTest(typingTest: typingTestData) {
  const { wpm, accuracy, userId } = typingTest;
  //need to learn the syntax for inserting into the typing test table

  return 0;
}

typingTestRoute.post('/results', async (c) => {
  //get results including wpm and acc
  const test = await c.req.json();
  console.log(test);
  const testResults = await db.insert(typingTests).values({
    wpm: test.wpm,
    acc: test.acc,
    userId: test.userId,
  });
  console.log(testResults);

  return c.json({ message: 'Typing test saved', testResults }, 201);
});

export default typingTestRoute;
