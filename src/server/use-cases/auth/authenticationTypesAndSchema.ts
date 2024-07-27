import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().min(1).email(),
  userName: z.string().min(5, "Username must be 5 characters or more"),
  displayName: z.string().min(1),
  password: z.string().min(8, "Password must be atleast 8 characters or more"),
});

export type registerUserSchemaTypes = z.infer<typeof registerUserSchema>;
