"use server";

import { registerUser, verifyUserInfo } from "@/server/use-cases/auth/authentication";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { registerUserFormSchema } from "../schema";

type registerFormReturn = Partial<z.infer<typeof registerUserFormSchema>>;

export async function registerFormActions(
  initialState: registerFormReturn,
  formData: FormData
): Promise<registerFormReturn> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = registerUserFormSchema.safeParse(rawFormData);
  if (parsedFormData.success === false) {
    const { password, userName, verifiedPassword, displayName, email } =
      parsedFormData.error.formErrors.fieldErrors;
    return {
      password: password?.[0] ?? undefined,
      userName: userName?.[0] ?? undefined,
      verifiedPassword: verifiedPassword?.[0] ?? undefined,
      displayName: displayName?.[0] ?? undefined,
      email: email?.[0] ?? undefined,
    };
  }

  const { displayName, email, userName, password, verifiedPassword } = parsedFormData.data;
  if (password !== verifiedPassword) {
    return { verifiedPassword: "Passwords didn't match. Please reverify." };
  }

  const verifiedUserInfo = await verifyUserInfo({ email, userName });
  if (verifiedUserInfo !== undefined) {
    return {
      userName: verifiedUserInfo.userName,
      email: verifiedUserInfo.email,
    };
  }

  await registerUser({
    displayName,
    email,
    userName,
    password,
  });
  redirect("/login");
}
