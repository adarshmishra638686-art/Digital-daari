import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  uploadMediaFile,
  getUserMediaFiles,
  getMediaFileById,
  deleteMediaFile,
  updateMediaFile,
} from "../db.media";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

export const mediaRouter = router({
  /**
   * Upload a new media file
   */
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string().min(1),
        fileData: z.string(), // Base64 encoded file data
        mimeType: z.string(),
        fileSize: z.number(),
        altText: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Upload to storage
        const { url, key } = await storagePut(
          `media/${ctx.user.id}/${Date.now()}-${input.fileName}`,
          buffer,
          input.mimeType
        );

        // Save to database
        await uploadMediaFile({
          fileName: input.fileName,
          url,
          storageKey: key,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          altText: input.altText,
          uploadedBy: ctx.user.id,
        });

        return {
          success: true,
          url,
          fileName: input.fileName,
        };
      } catch (error) {
        console.error("Media upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload media file",
        });
      }
    }),

  /**
   * Get user's media library
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .query(async ({ input, ctx }) => {
      const files = await getUserMediaFiles(ctx.user.id, input.limit);
      return files;
    }),

  /**
   * Get a specific media file
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const file = await getMediaFileById(input.id);

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media file not found",
        });
      }

      // Verify ownership
      if (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to access this file",
        });
      }

      return file;
    }),

  /**
   * Update media file metadata
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        altText: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const file = await getMediaFileById(input.id);

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media file not found",
        });
      }

      // Verify ownership
      if (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to update this file",
        });
      }

      await updateMediaFile(input.id, {
        altText: input.altText,
      });

      return { success: true };
    }),

  /**
   * Delete a media file
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const file = await getMediaFileById(input.id);

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media file not found",
        });
      }

      // Verify ownership
      if (file.uploadedBy !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to delete this file",
        });
      }

      await deleteMediaFile(input.id);

      return { success: true };
    }),
});
