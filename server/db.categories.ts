import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { blogCategories, postCategories, InsertBlogCategory } from "../drizzle/schema";

/**
 * Create a new blog category
 */
export async function createCategory(data: InsertBlogCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(blogCategories).values(data);
  return result;
}

/**
 * Get all blog categories
 */
export async function getAllCategories() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const categories = await db.select().from(blogCategories);
  return categories;
}

/**
 * Get a specific category by ID
 */
export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const category = await db
    .select()
    .from(blogCategories)
    .where(eq(blogCategories.id, id))
    .limit(1);

  return category[0];
}

/**
 * Update a category
 */
export async function updateCategory(
  id: number,
  data: Partial<Omit<InsertBlogCategory, "createdAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogCategories).set(data).where(eq(blogCategories.id, id));
}

/**
 * Delete a category
 */
export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogCategories).where(eq(blogCategories.id, id));
}

/**
 * Add a post to a category
 */
export async function addPostToCategory(postId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(postCategories).values({ postId, categoryId });
}

/**
 * Remove a post from a category
 */
export async function removePostFromCategory(postId: number, categoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(postCategories)
    .where(
      and(
        eq(postCategories.postId, postId),
        eq(postCategories.categoryId, categoryId)
      )
    );
}

/**
 * Get all categories for a post
 */
export async function getPostCategories(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const categories = await db
    .select()
    .from(postCategories)
    .where(eq(postCategories.postId, postId));

  return categories;
}
