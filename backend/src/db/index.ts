import { drizzle } from 'drizzle-orm/libsql/node';
import * as schema from './schema';
import 'dotenv/config';
import { createClient } from '@libsql/client/.';
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

export default db;
