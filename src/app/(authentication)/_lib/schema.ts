import { ACCEPTED_FILE_TYPE, MAX_FILE_SIZE } from "@/app/(content)/_lib/formschema";
import { z } from "zod";

export const loginFormSchema = z.object({
  userName: z.string().min(5, "Username must be 5 characters or more"),
  password: z.string().min(8, "Password must be atleast 8 characters or more"),
  rememberMe: z.string().default("").pipe(z.coerce.boolean()),
  callbackUrl: z.string().min(1),
});

export const registerUserFormSchema = z.object({
  email: z.string().min(1).email(),
  userName: z.string().min(5, "Username must be 5 characters or more"),
  displayName: z.string().min(1),
  password: z.string().min(8, "Password must be atleast 8 characters or more"),
  verifiedPassword: z.string().min(8, "Password must be atleast 8 characters or more"),
});

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
