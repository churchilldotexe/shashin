"use server";

import { loginFormSchema } from "../schema";

export async function loginFormAction(
  initialData: { message?: string },
  formData: FormData
): Promise<{ message?: string }> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = loginFormSchema.safeParse(rawFormData);

  if (parsedFormData.success === false) {
    console.log(parsedFormData.error.errors);
  }
  console.log(parsedFormData.data);
  //TODO: login logic here

  return { message: "okok" };
}
