import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().notNull().unique(),
  created_at: text().default(sql`(CURRENT_DATE)`),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
