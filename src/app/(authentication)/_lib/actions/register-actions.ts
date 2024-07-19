"use server";

import { createUser } from "@/server/data-access/authentication";
import { registerUserFormSchema } from "../schema";

type registerFormReturn = {
  message?: string;
  error?: Record<string, string[]>;
};

export async function registerFormActions(
  initialState: registerFormReturn,
  formData: FormData
): Promise<registerFormReturn> {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = registerUserFormSchema.safeParse(rawFormData);
  if (parsedFormData.success === false) {
    console.log(parsedFormData.error.errors);
    return { error: parsedFormData.error.formErrors.fieldErrors };
  }

  const { displayName, email, userName, password } = parsedFormData.data;
  await createUser({ displayName, email, userName, hashedPassword: password });
  return { message: "all good" };
}
