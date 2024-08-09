"use server";

import { updateDisplayName } from "@/server/use-cases/user-use-cases";
import { revalidatePath } from "next/cache";
import { updateUserNameSchema } from "./schema";

export async function updateProfileDisplayName(
  displayName: string
): Promise<{ displayName?: string }> {
  const parsedDisplayName = updateUserNameSchema.safeParse({ displayName });
  if (parsedDisplayName.success === false) {
    const { displayName } = parsedDisplayName.error.formErrors.fieldErrors;
    return { displayName: displayName?.[0] ?? undefined };
  }
  await updateDisplayName({ displayName: parsedDisplayName.data.displayName });
  revalidatePath("/my-posts");

  return {};
}

export async function updateAvatar(avatarUrl: string) {
  await updateAvatar(avatarUrl);
  revalidatePath("/my-posts");
}
