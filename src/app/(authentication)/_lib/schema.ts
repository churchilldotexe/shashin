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
