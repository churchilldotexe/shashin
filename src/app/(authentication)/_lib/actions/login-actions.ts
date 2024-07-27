"use server";

import { authenticateUser } from "@/server/use-cases/auth/authentication";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { loginFormSchema } from "../schema";

type loginActionStateType = Partial<z.infer<typeof loginFormSchema>>;

export async function loginFormAction(
  initialData: loginActionStateType,
  formData: FormData
): Promise<loginActionStateType> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = loginFormSchema.safeParse(rawFormData);

  if (parsedFormData.success === false) {
    const { password, userName } = parsedFormData.error.formErrors.fieldErrors;
    return {
      password: password?.[0] ?? undefined,
      userName: userName?.[0] ?? undefined,
    };
  }

  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") as string;
  const userAgent = headersList.get("user-agent") as string;
  const { password, rememberMe, userName } = parsedFormData.data;

  const isAuthenticated = await authenticateUser({
    password,
    rememberMe,
    userName,
    ip,
    userAgent,
  });

  if (isAuthenticated === "success") {
    redirect(parsedFormData.data.callbackUrl);
  } else {
    return {
      password: isAuthenticated.password,
      userName: isAuthenticated.userName,
    };
  }
}
