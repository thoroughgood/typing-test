import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

export const runtime = 'edge';

const app = new Hono().basePath('/api/');

const allowedOrigins = [
  'https://typing-test-iota-two.vercel.app',
  'http://localhost:3000',
];

app.use('*', async (c, next) => {
  const origin = c.req.header('Origin');

  if (origin && allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    c.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
  }

  if (c.req.method === 'OPTIONS') {
    return c.text('options method');
  }

  await next();
});

app.get('/hello', (c) => c.json({ message: 'Hello from Hono!' }));

export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);
