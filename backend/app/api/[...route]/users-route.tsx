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

// small sleep helper
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// Poll the DB for the new user until found or timeout
async function waitForUserInDb(auth0Id: string, attempts = 5, delay = 200) {
  for (let i = 0; i < attempts; i++) {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.auth0Id, auth0Id))
      .get();

    if (user) return user;

    await sleep(delay);
  }

  return null;
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

usersRoute.post('/sync', async (c) => {
  try {
    const createUserData = await c.req.json();

    console.log('SYNC DATA:', createUserData);

    if (
      !createUserData.username ||
      !createUserData.email ||
      !createUserData.auth0Id
    ) {
      return c.json(
        {
          error: 'Missing required user fields',
          received: createUserData,
        },
        400,
      );
    }

    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.auth0Id, createUserData.auth0Id))
      .get();

    if (existingUser) {
      return c.json(
        {
          message: 'User already exists',
          user: existingUser,
        },
        200,
      );
    }

    const createdUser = await createUser(createUserData);

    return c.json(
      {
        message: 'User created successfully',
        user: createdUser,
      },
      201,
    );
  } catch (error) {
    console.error('SYNC ERROR:', error);

    return c.json(
      {
        error: 'Failed to sync user',
        message:
          error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export default usersRoute;
