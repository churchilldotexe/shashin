import { ACCEPTED_FILE_TYPE, MAX_FILE_SIZE } from "@/lib/constants";
import { z } from "zod";

export const profileSetupFormSchema = z.object({
  displayName: z.string().min(1),
  images: z
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
  images: z
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
