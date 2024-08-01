"use server";

import { registerUser, verifyUserInfo } from "@/server/use-cases/auth/authentication";
import { authenticateUser } from "@/server/use-cases/auth/authentication";
import { setupUserProfile } from "@/server/use-cases/user-use-cases";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import type { z } from "zod";
import { profileSetupFormSchema, registerUserFormSchema } from "../schema";
import { loginFormSchema } from "../schema";

type loginActionStateType = Partial<z.infer<typeof loginFormSchema>> & {
  message?: "success";
};

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
    // redirect(parsedFormData.data.callbackUrl);
    return { message: "success" };
  }
  return {
    password: isAuthenticated.password,
    userName: isAuthenticated.userName,
  };
}

type registerFormReturn = Partial<z.infer<typeof registerUserFormSchema>> & {
  message?: "success";
};

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

  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") as string;
  const userAgent = headersList.get("user-agent") as string;

  const isAuthenticated = await authenticateUser({
    password,
    userName,
    ip,
    userAgent,
  });

  if (isAuthenticated === "success") {
    return { message: "success" };
  }
  return {
    password: isAuthenticated.password,
    userName: isAuthenticated.userName,
  };
}

type ProfileSetupFormSchemaTypes = z.infer<typeof profileSetupFormSchema>;
type ProfileSetupReturnTypes = {
  [K in keyof ProfileSetupFormSchemaTypes]?: string;
} & { message?: "success" };

const utapi = new UTApi();

export async function profileSetupAction(
  initialData: ProfileSetupReturnTypes,
  formData: FormData
): Promise<ProfileSetupReturnTypes> {
  const rawFormData = Object.fromEntries(formData.entries());
  const images = formData.getAll("images");
  const parsedFormData = profileSetupFormSchema.safeParse({
    ...rawFormData,
    images,
  });

  if (parsedFormData.success === false) {
    const { displayName, images } = parsedFormData.error.formErrors.fieldErrors;
    return {
      images: images?.[0] ?? undefined,
      displayName: displayName?.[0] ?? undefined,
    };
  }

  const [utImage] = await utapi.uploadFiles(parsedFormData.data.images);

  if (utImage === undefined) {
    throw new Error("unable to upload the image");
  }

  if (utImage.data === null) {
    throw new Error(utImage.error.message);
  }

  const { url, key } = utImage.data;
  await setupUserProfile({
    url,
    urlKey: key,
    displayName: parsedFormData.data.displayName,
  });
  return { message: "success" };
}
