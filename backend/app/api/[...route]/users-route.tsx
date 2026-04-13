import { Hono } from 'hono';
import db from '@/src/db/';
import userInsert from '@/src/db/schema';
import { usersTable } from '@/src/db/schema';

const usersRoute = new Hono();
type newUser = typeof userInsert;

usersRoute.get('/', async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

usersRoute.post('/add', async (c) => {
  //post route waits for information to be sent
  const { id, username, email } = await c.req.json();
  await db.insert(usersTable).values({ username, email });
});
export default usersRoute;
