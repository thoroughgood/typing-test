import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
//use auth0 id separately to identify user, but provide a local id.
export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull(),
  email: text().notNull().unique(),
  created_at: text().default(sql`(CURRENT_DATE)`),
});

//typing tests users: one, tests: many
export const typingTests = sqliteTable('typing_test', {
  id: int().notNull(),
  wpm: text().notNull(),
  acc: text().notNull(),
  userId: int('user_id').references(() => usersTable.id),
});
//Users = .. tests: many(tests)
//tests = .. user: (one)id, test stats
//Need to understand how relations are going to work
export const userRelations = relations(usersTable, ({ one }) => ({}));

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
