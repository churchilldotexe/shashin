import { ACCEPTED_FILE_TYPE, MAX_FILE_SIZE } from "@/lib/constants";
import { z } from "zod";

export const myProfileFormSchemaemaema = z.object({
  displayName: z.string().min(1),
  image: z
    .custom<File[]>()
    .refine((files) => Array.from(files ?? []).length !== 0, "Consider Posting an Image")
    .refine((files) => Array.from(files ?? []).length <= 1, "You can upload up to 1 file at a time")
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      "try uploading an image that is 4mb or lower"
    )
    .refine(
      (files) => Array.from(files).every((file) => ACCEPTED_FILE_TYPE.includes(file.type)),
      "Can only Accept an Image file"
    ),
});

export const updateUserNameSchema = z.object({
  displayName: z.string().min(1),
});

export const updateAvatarImageSchema = z.object({
  image: z
    .custom<File>()
    .refine((file) => file !== null && file !== undefined, "Please provide an image")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Try uploading an image that is 4MB or lower")
    .refine((file) => ACCEPTED_FILE_TYPE.includes(file.type), "Can only accept an image file"),
});
