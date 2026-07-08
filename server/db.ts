import { eq, desc, and, like, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import fs from "fs/promises";
import { InsertUser, users, blogPosts, BlogPost, InsertBlogPost, ContactLead, InsertContactLead, contactLeads } from "../drizzle/schema";
import path from "path";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
const now = new Date();

let inMemoryBlogPosts: BlogPost[] = [];
let inMemoryBlogPostId = 1;
let inMemoryBlogPostsLoaded = false;
const fallbackBlogPostsPath = path.resolve(process.cwd(), "server", ".data", "blog-posts.json");
let inMemoryContactLeads: ContactLead[] = [];
let inMemoryContactLeadId = 1;
let inMemoryContactLeadsLoaded = false;
const fallbackContactLeadsPath = path.resolve(process.cwd(), "server", ".data", "contact-leads.json");

function reviveBlogPost(post: any): BlogPost {
  return {
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
  };
}

function reviveContactLead(lead: any): ContactLead {
  return {
    ...lead,
    createdAt: new Date(lead.createdAt),
    updatedAt: new Date(lead.updatedAt),
  };
}

async function ensureFallbackBlogPostsLoaded() {
  if (inMemoryBlogPostsLoaded) {
    return;
  }

  try {
    const raw = await fs.readFile(fallbackBlogPostsPath, "utf-8");
    const parsed = JSON.parse(raw) as Array<BlogPost & { createdAt: string; updatedAt: string; publishedAt: string | null }>;
    inMemoryBlogPosts = parsed.map(reviveBlogPost);
    inMemoryBlogPostId = inMemoryBlogPosts.reduce((maxId, post) => Math.max(maxId, post.id), 0) + 1;
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      console.warn("[Blog storage] Failed to load fallback posts:", error);
    }
    inMemoryBlogPosts = [];
    inMemoryBlogPostId = 1;
  }

  inMemoryBlogPostsLoaded = true;
}

async function persistFallbackBlogPosts() {
  await fs.mkdir(path.dirname(fallbackBlogPostsPath), { recursive: true });
  await fs.writeFile(fallbackBlogPostsPath, JSON.stringify(inMemoryBlogPosts, null, 2), "utf-8");
}

async function ensureFallbackContactLeadsLoaded() {
  if (inMemoryContactLeadsLoaded) {
    return;
  }

  try {
    const raw = await fs.readFile(fallbackContactLeadsPath, "utf-8");
    const parsed = JSON.parse(raw) as Array<ContactLead & { createdAt: string; updatedAt: string }>;
    inMemoryContactLeads = parsed.map(reviveContactLead);
    inMemoryContactLeadId = inMemoryContactLeads.reduce((maxId, lead) => Math.max(maxId, lead.id), 0) + 1;
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      console.warn("[Contact storage] Failed to load fallback leads:", error);
    }
    inMemoryContactLeads = [];
    inMemoryContactLeadId = 1;
  }

  inMemoryContactLeadsLoaded = true;
}

async function persistFallbackContactLeads() {
  await fs.mkdir(path.dirname(fallbackContactLeadsPath), { recursive: true });
  await fs.writeFile(fallbackContactLeadsPath, JSON.stringify(inMemoryContactLeads, null, 2), "utf-8");
}

async function autoPublishDueBlogPosts() {
  const now = new Date();
  const db = await getDb();

  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    inMemoryBlogPosts = inMemoryBlogPosts.map((post) => {
      if (post.status === "draft" && post.publishedAt && new Date(post.publishedAt) <= now) {
        return {
          ...post,
          status: "published",
          updatedAt: now,
        };
      }
      return post;
    });
    await persistFallbackBlogPosts();
    return;
  }

  await db
    .update(blogPosts)
    .set({ status: "published" })
    .where(
      and(
        eq(blogPosts.status, "draft"),
        lte(blogPosts.publishedAt, now),
      )
    );
}

function sortBlogPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const aPublishedAt = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bPublishedAt = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    if (bPublishedAt !== aPublishedAt) return bPublishedAt - aPublishedAt;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function filterInMemoryPosts(
  posts: BlogPost[],
  filters?: {
    status?: "draft" | "published" | "archived";
    authorId?: number;
    search?: string;
    limit?: number;
    offset?: number;
  }
) {
  const limit = filters?.limit ?? 20;
  const offset = filters?.offset ?? 0;
  const search = filters?.search?.toLowerCase().trim();

  const filtered = posts.filter(post => {
    if (filters?.status && post.status !== filters.status) return false;
    if (filters?.authorId && post.authorId !== filters.authorId) return false;
    if (search && !post.title.toLowerCase().includes(search)) return false;
    return true;
  });

  return sortBlogPosts(filtered).slice(offset, offset + limit);
}

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
    await ensureFallbackBlogPostsLoaded();
    const now = new Date();
    const memoryPost: BlogPost = {
      id: inMemoryBlogPostId++,
      title: post.title,
      metaTitle: post.metaTitle ?? null,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt ?? null,
      featuredImage: post.featuredImage ?? null,
      tags: post.tags ?? null,
      schemaTypes: post.schemaTypes ?? null,
      status: post.status ?? "draft",
      authorId: post.authorId,
      metaDescription: post.metaDescription ?? null,
      keywords: post.keywords ?? null,
      canonicalUrl: post.canonicalUrl ?? null,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
      publishedAt:
        post.status === "published"
          ? (post.publishedAt ?? now)
          : (post.publishedAt ?? null),
    };

    inMemoryBlogPosts.push(memoryPost);
    await persistFallbackBlogPosts();
    return memoryPost;
  }

  const result = await db.insert(blogPosts).values(post);
  const id = result[0].insertId as number;
  
  const created = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return created[0];
}

export async function updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost> {
  const db = await getDb();
  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    const existing = inMemoryBlogPosts.find(post => post.id === id);
    if (!existing) {
      throw new Error("Blog post not found");
    }

    const updated: BlogPost = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    if (updated.status === "published" && !updated.publishedAt) {
      updated.publishedAt = new Date();
    }

    inMemoryBlogPosts = inMemoryBlogPosts.map(post => (post.id === id ? updated : post));
    await persistFallbackBlogPosts();
    return updated;
  }

  await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id));
  
  const updated = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return updated[0];
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    inMemoryBlogPosts = inMemoryBlogPosts.filter(post => post.id !== id);
    await persistFallbackBlogPosts();
    return;
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function createContactLead(lead: InsertContactLead): Promise<ContactLead> {
  const db = await getDb();
  if (!db) {
    await ensureFallbackContactLeadsLoaded();
    const now = new Date();
    const memoryLead: ContactLead = {
      id: inMemoryContactLeadId++,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      service: lead.service,
      message: lead.message ?? null,
      status: lead.status ?? "new",
      createdAt: now,
      updatedAt: now,
    };

    inMemoryContactLeads.push(memoryLead);
    await persistFallbackContactLeads();
    return memoryLead;
  }

  const result = await db.insert(contactLeads).values(lead);
  const id = result[0].insertId as number;

  const created = await db.select().from(contactLeads).where(eq(contactLeads.id, id)).limit(1);
  return created[0];
}

export async function listContactLeads(limit = 50, offset = 0): Promise<ContactLead[]> {
  const db = await getDb();
  if (!db) {
    await ensureFallbackContactLeadsLoaded();
    return [...inMemoryContactLeads]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(offset, offset + limit);
  }

  const result = await db
    .select()
    .from(contactLeads)
    .orderBy(desc(contactLeads.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  await autoPublishDueBlogPosts();
  const db = await getDb();
  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    return inMemoryBlogPosts.find(post => post.id === id);
  }

  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await autoPublishDueBlogPosts();
  const db = await getDb();
  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    return inMemoryBlogPosts.find(post => post.slug === slug);
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
  await autoPublishDueBlogPosts();
  const db = await getDb();
  if (!db) {
    await ensureFallbackBlogPostsLoaded();
    return filterInMemoryPosts(inMemoryBlogPosts, filters);
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
