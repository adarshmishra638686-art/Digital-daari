import { eq, desc } from "drizzle-orm";
import { getDb } from "./db";
import { mediaLibrary, InsertMediaFile } from "../drizzle/schema";

/**
 * Upload a new media file to the library
 */
export async function uploadMediaFile(data: InsertMediaFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(mediaLibrary).values(data);
  return result;
}

/**
 * Get all media files uploaded by a user
 */
export async function getUserMediaFiles(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const files = await db
    .select()
    .from(mediaLibrary)
    .where(eq(mediaLibrary.uploadedBy, userId))
    .orderBy(desc(mediaLibrary.createdAt))
    .limit(limit);

  return files;
}

/**
 * Get a specific media file by ID
 */
export async function getMediaFileById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const file = await db
    .select()
    .from(mediaLibrary)
    .where(eq(mediaLibrary.id, id))
    .limit(1);

  return file[0];
}

/**
 * Delete a media file
 */
export async function deleteMediaFile(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(mediaLibrary).where(eq(mediaLibrary.id, id));
}

/**
 * Update media file metadata
 */
export async function updateMediaFile(
  id: number,
  data: Partial<Omit<InsertMediaFile, "uploadedBy" | "createdAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(mediaLibrary).set(data).where(eq(mediaLibrary.id, id));
}
