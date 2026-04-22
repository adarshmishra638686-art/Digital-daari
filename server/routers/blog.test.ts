import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";
import type { User } from "../../drizzle/schema";

// Mock database functions
vi.mock("../db", () => ({
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
  getBlogPostById: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  listBlogPosts: vi.fn(),
  getPublishedBlogPosts: vi.fn(),
}));

function createAdminContext(): TrpcContext {
  const user: User = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: User = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("blog router", () => {
  describe("create", () => {
    it("should allow admin to create a blog post", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const mockPost = {
        id: 1,
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        excerpt: "Test excerpt",
        featuredImage: null,
        tags: null,
        status: "draft" as const,
        authorId: 1,
        metaDescription: null,
        keywords: null,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: null,
      };

      const { createBlogPost } = await import("../db");
      vi.mocked(createBlogPost).mockResolvedValueOnce(mockPost);

      const result = await caller.blog.create({
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
        excerpt: "Test excerpt",
      });

      expect(result).toEqual(mockPost);
      expect(createBlogPost).toHaveBeenCalled();
    });

    it("should reject non-admin users from creating posts", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.blog.create({
          title: "Test Post",
          slug: "test-post",
          content: "Test content",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
        expect(error.message).toContain("Only admins can create");
      }
    });

    it("should validate required fields", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.blog.create({
          title: "",
          slug: "test-post",
          content: "Test content",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("list", () => {
    it("should list published posts for regular users", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const mockPosts = [
        {
          id: 1,
          title: "Published Post",
          slug: "published-post",
          content: "Content",
          excerpt: null,
          featuredImage: null,
          tags: null,
          status: "published" as const,
          authorId: 1,
          metaDescription: null,
          keywords: null,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
        },
      ];

      const { listBlogPosts } = await import("../db");
      vi.mocked(listBlogPosts).mockResolvedValueOnce(mockPosts);

      const result = await caller.blog.list({});

      expect(result).toEqual(mockPosts);
      expect(listBlogPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "published",
        })
      );
    });

    it("should allow admins to see all posts", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const mockPosts = [
        {
          id: 1,
          title: "Draft Post",
          slug: "draft-post",
          content: "Content",
          excerpt: null,
          featuredImage: null,
          tags: null,
          status: "draft" as const,
          authorId: 1,
          metaDescription: null,
          keywords: null,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: null,
        },
      ];

      const { listBlogPosts } = await import("../db");
      vi.mocked(listBlogPosts).mockResolvedValueOnce(mockPosts);

      const result = await caller.blog.list({ status: "draft" });

      expect(result).toEqual(mockPosts);
    });
  });

  describe("getPublished", () => {
    it("should return published blog posts", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      const mockPosts = [
        {
          id: 1,
          title: "Published Post",
          slug: "published-post",
          content: "Content",
          excerpt: null,
          featuredImage: null,
          tags: null,
          status: "published" as const,
          authorId: 1,
          metaDescription: null,
          keywords: null,
          viewCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
        },
      ];

      const { getPublishedBlogPosts } = await import("../db");
      vi.mocked(getPublishedBlogPosts).mockResolvedValueOnce(mockPosts);

      const result = await caller.blog.getPublished({});

      expect(result).toEqual(mockPosts);
      expect(getPublishedBlogPosts).toHaveBeenCalled();
    });
  });
});
