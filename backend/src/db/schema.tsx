import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { real } from 'drizzle-orm/sqlite-core';
//use auth0 id separately to identify user, but provide a local id.
//userTable
//id: unique id to grab data around the backend, integer
//auth0_id: id generated up on user sign up, text
//username: display name for user, text
//email: email address for things like forgot password etc, text
//created_at: creation date, text
export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }), //Native id
  auth0_id: text().notNull().unique(), //Unique identifier
  username: text().notNull(),
  email: text().notNull().unique(),
  created_at: text().default(sql`(CURRENT_DATE)`),
});

//typing tests users: one, tests: many
//id for each typing test -> helps us create a history of tests
//userId -> creates a relationship as a foreign key
export const typingTests = sqliteTable('typing_test', {
  id: int().notNull().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => usersTable.id),
  wpm: int().notNull(),
  acc: real().notNull(),
  createdAt: text().default(sql`(CURRENT_DATE)`),
});

//userStats table
//requires user id (one to one relationship)
//userId: int -> foreign key so references
export const userStats = sqliteTable('stats_table' {
  userId: int().notNull().references(() => usersTable.id),
  acc: real(),
  avgWpm: real(),
  topWpm: int(),
  testsCompleted: int(),
})

//insertion into database
//await db.insert(typingTests).values({user_id:xyz, wpm:xyz, acc:xyz, createdAt:xyz}) -> as we insert into databse the autoincrement for typing tests will generate unique ids

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
