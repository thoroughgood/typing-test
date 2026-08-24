import { Hono } from 'hono';
import db from '@/src/db/';
import { eq } from 'drizzle-orm';
import { Users } from '@/src/db/schema';
import { get } from 'https';

const usersRoute = new Hono();

interface createUserData {
  username: string;
  email: string;
  auth0Id: string;
}

async function createUser(userData: createUserData) {
  const { username, email, auth0Id } = userData;
  const res = await db
    .insert(Users)
    .values({ username, email, auth0Id });
  return res;
}

usersRoute.get('/', async (c) => {
  const users = await db.select().from(Users);
  return c.json(users);
});

usersRoute.get('/:id', async (c) => {
  console.log('test');
  //grab slug from url
  const id = Number(c.req.param('id'));
  //users.id is integer in database
  console.log(id);
  const user = await db
    .select()
    .from(Users)
    .where(eq(Users.id, id))
    .get();
  if (!user) {
    return c.json({ error: 'User does not exist' }, 404);
  } else {
    //need to pass back user data
    return c.json(user, 200);
  }
});

usersRoute.get('/:id/typing-tests', async (c) => {
  const id = Number(c.req.param('id'));
  const user = await db.query.Users.findFirst({
    where: eq(Users.id, id),
    with: {
      typingTests: {
        orderBy: (typingTests, { desc }) => [desc(typingTests.id)],
      },
      stats: true,
    },
  });
  if (!user) {
    return c.json({ error: 'User does not exist' }, 404);
  } else {
    //need to pass back typing test data
    return c.json(user, 200);
  }
});

//Find out if a user exists based on auth0Id
usersRoute.post('/sync', async (c) => {
  //make sure user exists
  const createUserData = await c.req.json();
  console.log(createUserData);

  const existingUser = await db
    .select()
    .from(Users)
    .where(eq(Users.auth0Id, createUserData.auth0Id))
    .get();

  if (existingUser) {
    return c.json(
      { message: 'User already exists', user: existingUser },
      200,
    );
  }
  //if not create user
  const createdUser = await createUser(createUserData);

  return c.json(
    { message: 'User created successfully', user: createdUser },
    201,
  );
});

export default usersRoute;
