import { eq, desc, and, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogPosts, BlogPost, InsertBlogPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ BLOG POST HELPERS ============

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(blogPosts).values(post);
  const id = result[0].insertId as number;
  
  const created = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return created[0];
}

export async function updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
  
  const updated = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return updated[0];
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function listBlogPosts(filters?: {
  status?: "draft" | "published" | "archived";
  authorId?: number;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const limit = filters?.limit ?? 20;
  const offset = filters?.offset ?? 0;
  
  const conditions: any[] = [];
  
  if (filters?.status) {
    conditions.push(eq(blogPosts.status, filters.status));
  }
  
  if (filters?.authorId) {
    conditions.push(eq(blogPosts.authorId, filters.authorId));
  }
  
  if (filters?.search) {
    conditions.push(like(blogPosts.title, `%${filters.search}%`));
  }

  let query = db.select().from(blogPosts);
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  const result = await query
    .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getPublishedBlogPosts(limit = 20, offset = 0): Promise<BlogPost[]> {
  return listBlogPosts({
    status: "published",
    limit,
    offset,
  });
}
