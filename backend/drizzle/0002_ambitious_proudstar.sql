ALTER TABLE `users_table` RENAME COLUMN "auth0_id" TO "auth0Id";--> statement-breakpoint
ALTER TABLE `users_table` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `typing_test` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
DROP INDEX `users_table_auth0_id_unique`;--> statement-breakpoint
DROP INDEX "users_table_auth0Id_unique";--> statement-breakpoint
DROP INDEX "users_table_email_unique";--> statement-breakpoint
ALTER TABLE `users_table` ALTER COLUMN "createdAt" TO "createdAt" text DEFAULT (CURRENT_TIMESTAMP);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_auth0Id_unique` ON `users_table` (`auth0Id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_email_unique` ON `users_table` (`email`);--> statement-breakpoint
ALTER TABLE `typing_test` ALTER COLUMN "createdAt" TO "createdAt" text DEFAULT (CURRENT_TIMESTAMP);