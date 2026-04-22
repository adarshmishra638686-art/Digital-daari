import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table for the blog management system.
 * Stores blog post content, metadata, and publishing status.
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  /** Post title */
  title: varchar("title", { length: 255 }).notNull(),
  /** URL-friendly slug for SEO */
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  /** Post content (markdown or HTML) */
  content: text("content").notNull(),
  /** Short excerpt/summary for listings */
  excerpt: text("excerpt"),
  /** Featured image URL */
  featuredImage: varchar("featuredImage", { length: 500 }),
  /** Comma-separated tags for categorization */
  tags: text("tags"),
  /** Publishing status: draft, published, or archived */
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  /** Author (user who created the post) */
  authorId: int("authorId").notNull(),
  /** SEO meta description */
  metaDescription: varchar("metaDescription", { length: 160 }),
  /** SEO keywords */
  keywords: text("keywords"),
  /** Post view count */
  viewCount: int("viewCount").default(0).notNull(),
  /** Creation timestamp */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** Last update timestamp */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  /** Publishing date (can differ from createdAt) */
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;