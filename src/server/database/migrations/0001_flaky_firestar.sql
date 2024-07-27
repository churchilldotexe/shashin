ALTER TABLE `users` ADD `salt` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);