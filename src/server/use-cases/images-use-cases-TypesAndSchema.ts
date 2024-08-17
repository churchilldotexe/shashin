import "server-only";
import { z } from "zod";

export const createImageSchema = z.object({
  url: z.string().url().min(1).max(250),
  name: z.string().min(1).max(250),
  type: z.enum(["image/jpeg", "image/jpg", "image/bmp", "image/png", "image/gif", "image/webp"]),
  fileKey: z.string().min(1),
  postId: z.string().min(1),
  id: z.string().optional(),
});

export type CreateImageType = z.infer<typeof createImageSchema>;
export const createImageSchemaArr = z.array(createImageSchema);
