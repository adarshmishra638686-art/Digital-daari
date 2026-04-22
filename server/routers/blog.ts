import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
  getBlogPostBySlug,
  listBlogPosts,
  getPublishedBlogPosts,
} from "../db";
import { TRPCError } from "@trpc/server";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  tags: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.date().optional(),
});

const updatePostSchema = createPostSchema.partial();

export const blogRouter = router({
  // Create a new blog post (admin only)
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create blog posts",
        });
      }

      try {
        const post = await createBlogPost({
          ...input,
          authorId: ctx.user.id,
        });
        return post;
      } catch (error) {
        console.error("Failed to create blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create blog post",
        });
      }
    }),

  // Update an existing blog post (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: updatePostSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update blog posts",
        });
      }

      try {
        const existing = await getBlogPostById(input.id);
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }

        const updated = await updateBlogPost(input.id, input.data);
        return updated;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Failed to update blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update blog post",
        });
      }
    }),

  // Delete a blog post (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete blog posts",
        });
      }

      try {
        const existing = await getBlogPostById(input.id);
        if (!existing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }

        await deleteBlogPost(input.id);
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Failed to delete blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete blog post",
        });
      }
    }),

  // Get a single blog post by ID (admin can see all, public sees published)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const post = await getBlogPostById(input.id);
        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }

        // Non-admins can only see published posts
        if (ctx.user?.role !== "admin" && post.status !== "published") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }

        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Failed to get blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get blog post",
        });
      }
    }),

  // Get a blog post by slug (public endpoint)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const post = await getBlogPostBySlug(input.slug);
        if (!post || post.status !== "published") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Blog post not found",
          });
        }
        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("Failed to get blog post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get blog post",
        });
      }
    }),

  // List blog posts (admin sees all, public sees published)
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(["draft", "published", "archived"]).optional(),
        search: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Non-admins can only see published posts
        const status = ctx.user?.role === "admin" ? input.status : "published";

        const posts = await listBlogPosts({
          status: status as any,
          search: input.search,
          limit: input.limit,
          offset: input.offset,
        });

        return posts;
      } catch (error) {
        console.error("Failed to list blog posts:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list blog posts",
        });
      }
    }),

  // Get published blog posts (public endpoint)
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const posts = await getPublishedBlogPosts(input.limit, input.offset);
        return posts;
      } catch (error) {
        console.error("Failed to get published blog posts:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get published blog posts",
        });
      }
    }),
});
