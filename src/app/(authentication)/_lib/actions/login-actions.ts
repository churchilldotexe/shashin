"use server";

import { getUserInfo, authenticateUser } from "@/server/data-access/authentication";
import { loginFormSchema } from "../schema";

export async function loginFormAction(
  initialData: { message?: string },
  formData: FormData
): Promise<{ message?: string }> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = loginFormSchema.safeParse(rawFormData);

  if (parsedFormData.success === false) {
    console.log(parsedFormData.error.errors);
    return { message: "failed validation" };
  }

  await authenticateUser(parsedFormData.data.password, parsedFormData.data.userName);

  return { message: "okok" };
}
