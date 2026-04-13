import { Hono } from 'hono';
import db from '@/src/db/';
import { usersTable } from '@/src/db/schema';

const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

export default usersRoute;
