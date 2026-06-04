CREATE TABLE `typing_test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`wpm` integer NOT NULL,
	`acc` real NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE),
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stats_table` (
	`userId` integer PRIMARY KEY NOT NULL,
	`acc` real,
	`avgWpm` real,
	`topWpm` integer,
	`testsCompleted` integer,
	FOREIGN KEY (`userId`) REFERENCES `users_table`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `users_table` ADD `auth0_id` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_auth0_id_unique` ON `users_table` (`auth0_id`);--> statement-breakpoint
ALTER TABLE `users_table` DROP COLUMN `password_hash`;