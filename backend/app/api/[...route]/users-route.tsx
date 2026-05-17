import { Hono } from 'hono';
import db from '@/src/db/';
import { eq } from 'drizzle-orm';
import { usersTable } from '@/src/db/schema';

const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
  const users = await db.select().from(usersTable);
  return c.json(users);
});

usersRoute.post('/add', async (c) => {
  //post route waits for information to be sent
  const { id, username, email } = await c.req.json();
  await db.insert(usersTable).values({ id, username, email });
  return c.text('add users');
});

usersRoute.get('/:id', async (c) => {
  const { id } = await c.req.json();
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .get();
  if (!user) {
    return c.json({ error: 'User does not exist' }, 404);
  }
});
export default usersRoute;
