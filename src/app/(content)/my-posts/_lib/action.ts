"use server";

import { updateAvatarImage, updateDisplayName } from "@/server/use-cases/user-use-cases";
import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { updateAvatarImageSchema, updateUserNameSchema } from "./schema";

const utapi = new UTApi();

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

type UpdateAvatarType = { image?: string };

export async function updateAvatar(formData: FormData): Promise<UpdateAvatarType> {
  const file = formData.get("image") as File;

  const parsedAvatarImage = updateAvatarImageSchema.safeParse({
    image: file,
  });

  if (parsedAvatarImage.success === false) {
    const { image } = parsedAvatarImage.error.formErrors.fieldErrors;
    return { image: image?.[0] ?? undefined };
  }
  const utImages = await utapi.uploadFiles(parsedAvatarImage.data.image);

  if (utImages.data === null) {
    throw new Error(`${utImages.error.code}:${utImages.error.message}.`);
  }
  const { url, key } = utImages.data;

  const oldUrlKey = await updateAvatarImage({ url, urlKey: key });
  if (oldUrlKey.urlKey === null) {
    throw new Error("An Error Occured While updating your Image");
  }

  await utapi.deleteFiles(oldUrlKey.urlKey);

  revalidatePath("/my-posts");
  return { image: undefined };
}
