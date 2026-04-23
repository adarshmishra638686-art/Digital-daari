import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addPostToCategory,
  removePostFromCategory,
  getPostCategories,
} from "../db.categories";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = router({
  /**
   * Create a new category
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create categories",
        });
      }

      try {
        await createCategory({
          name: input.name,
          slug: input.slug,
          description: input.description,
          color: input.color,
        });

        return { success: true };
      } catch (error) {
        console.error("Category creation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create category",
        });
      }
    }),

  /**
   * Get all categories
   */
  list: protectedProcedure.query(async () => {
    const categories = await getAllCategories();
    return categories;
  }),

  /**
   * Get a specific category
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const category = await getCategoryById(input.id);

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      return category;
    }),

  /**
   * Update a category
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        slug: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update categories",
        });
      }

      const category = await getCategoryById(input.id);
      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      await updateCategory(input.id, {
        name: input.name,
        slug: input.slug,
        description: input.description,
        color: input.color,
      });

      return { success: true };
    }),

  /**
   * Delete a category
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete categories",
        });
      }

      const category = await getCategoryById(input.id);
      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }

      await deleteCategory(input.id);

      return { success: true };
    }),

  /**
   * Add a post to a category
   */
  addPostToCategory: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        categoryId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can manage post categories",
        });
      }

      try {
        await addPostToCategory(input.postId, input.categoryId);
        return { success: true };
      } catch (error) {
        console.error("Error adding post to category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add post to category",
        });
      }
    }),

  /**
   * Remove a post from a category
   */
  removePostFromCategory: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        categoryId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can manage post categories",
        });
      }

      try {
        await removePostFromCategory(input.postId, input.categoryId);
        return { success: true };
      } catch (error) {
        console.error("Error removing post from category:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove post from category",
        });
      }
    }),

  /**
   * Get categories for a post
   */
  getPostCategories: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const categories = await getPostCategories(input.postId);
      return categories;
    }),
});
