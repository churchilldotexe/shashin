import { z } from "zod";

export const MAX_FILE_SIZE = 4 * 1024 * 1024;
export const ACCEPTED_FILE_TYPE = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
];

export const formSchema = z.object({
  description: z.string().max(250, "exceeded the limit, try to shorten it").optional(),
  images: z
    .custom<File[]>()
    .refine((files) => Array.from(files ?? []).length !== 0, "Consider Posting an Image")
    .refine(
      (files) => Array.from(files ?? []).length <= 5,
      "You can upload up to 5 files at a time"
    )
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "try uploading an image that is 4mb or lower"
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_FILE_TYPE.includes(file.type)),
      "Can only Accept an Image file"
    ),
  shareToPublic: z.string().default("").pipe(z.coerce.boolean()),
});
