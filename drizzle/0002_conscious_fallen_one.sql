CREATE TABLE `blog_revisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`revisedBy` int NOT NULL,
	`revisionMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_revisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_schedule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`status` enum('pending','published','cancelled') NOT NULL DEFAULT 'pending',
	`scheduledBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_schedule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_library` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`url` varchar(500) NOT NULL,
	`storageKey` varchar(500) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int NOT NULL,
	`altText` text,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `media_library_id` PRIMARY KEY(`id`)
);
