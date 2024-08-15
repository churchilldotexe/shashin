"use server";

import { createNewFavorite, removeFavorite } from "@/server/use-cases/favorites-use-case";
import { removeImageUseCase } from "@/server/use-cases/images-use-cases";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function unFavoritePost(postId: string) {
  await removeFavorite(postId);
  revalidatePath("/");
}

export async function setFavoritePost(postId: string) {
  await createNewFavorite(postId);
  revalidatePath("/");
}

export async function deleteImageAction(imageId: string) {
  const imageFileKey = await removeImageUseCase(imageId);

  await utapi.deleteFiles(imageFileKey.fileKey);

  console.log(imageFileKey);
  revalidatePath("/");
}
