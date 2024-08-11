"use server";

import { createNewFavorite, removeFavorite } from "@/server/use-cases/favorites-use-case";
import { revalidatePath } from "next/cache";

export async function unFavoritePost(postId: string) {
  await removeFavorite(postId);
  revalidatePath("/");
}

export async function setFavoritePost(postId: string) {
  await createNewFavorite(postId);
  revalidatePath("/");
}
