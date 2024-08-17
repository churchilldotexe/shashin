CREATE TABLE `albums` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(255) NOT NULL,
	`user_id` text NOT NULL,
	`image_id` text NOT NULL,
	`post_id` text NOT NULL,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `all_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` text NOT NULL,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`name` text(255) NOT NULL,
	`type` text NOT NULL,
	`file_key` text NOT NULL,
	`is_favorited` integer DEFAULT false,
	`user_id` text NOT NULL,
	`post_id` text NOT NULL,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text(255),
	`user_id` text NOT NULL,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`user_name` text(255) NOT NULL,
	`email` text(255) NOT NULL,
	`display_name` text(255) NOT NULL,
	`avatar` text(255),
	`url_key` text(255),
	`hashed_password` text NOT NULL,
	`salt` text NOT NULL,
	`refresh_token` text,
	`token_fingerprint` text,
	`created_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL,
	`updated_at` integer DEFAULT ( STRFTIME('%s','NOW') ) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `albums_name_user_id_created_at_idx` ON `albums` (`name`,`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `albums_post_id_idx` ON `albums` (`post_id`);--> statement-breakpoint
CREATE INDEX `albums_id_user_id_idx` ON `albums` (`id`,`user_id`);--> statement-breakpoint
CREATE INDEX `all_posts_post_id_idx` ON `all_posts` (`post_id`);--> statement-breakpoint
CREATE INDEX `bookmarks_user_id_post_id_idx` ON `bookmarks` (`user_id`,`post_id`);--> statement-breakpoint
CREATE INDEX `bookmarks_user_id_idx` ON `bookmarks` (`user_id`);--> statement-breakpoint
CREATE INDEX `image_post_id_idx` ON `images` (`post_id`);--> statement-breakpoint
CREATE INDEX `image_id_post_id_idx` ON `images` (`post_id`,`id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `posts` (`user_id`);--> statement-breakpoint
CREATE INDEX `posts_id_user_id_idx` ON `posts` (`id`,`user_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `posts` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_user_name_idx` ON `users` (`user_name`);--> statement-breakpoint
CREATE INDEX `users_email_idx` ON `users` (`email`);
