CREATE TABLE `contact_leads` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` text NOT NULL,
  `phone` varchar(32) NOT NULL,
  `email` varchar(320) NOT NULL,
  `service` varchar(120) NOT NULL,
  `message` text,
  `status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `contact_leads_id` PRIMARY KEY(`id`)
);