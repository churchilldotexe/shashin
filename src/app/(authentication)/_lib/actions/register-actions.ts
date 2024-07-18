"use server";

import { registerUserFormSchema } from "../schema";

type registerFormReturn = { message?: string };

export async function registerFormActions(
  initialState: registerFormReturn,
  formData: FormData
): Promise<registerFormReturn> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = registerUserFormSchema.safeParse(rawFormData);
  if (parsedFormData.success === false) {
    console.log(parsedFormData.error.errors);
  }
  console.log(parsedFormData.data);
  // NOTE: logic here
  return { message: "all good" };
}
