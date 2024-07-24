"use server";

import { authenticateUser } from "@/server/data-access/authentication";
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

  const isAuthenticated = await authenticateUser(
    parsedFormData.data.password,
    parsedFormData.data.userName,
    parsedFormData.data.rememberMe
  );

  if (isAuthenticated === undefined) {
    redirect(parsedFormData.data.callbackUrl);
  } else {
    return {
      password: isAuthenticated.password,
      userName: isAuthenticated.userName,
    };
  }
}
