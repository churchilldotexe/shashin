import "server-only";

import {
  deleteFavoriteFromDb,
  getFavoriteByPostId,
  getFavoritesPostFromDb,
  insertNewFavorite,
} from "../data-access/favoritesQueries";
import { hasAccess } from "./auth/authentication";

export async function createNewFavorite(postId: string) {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await insertNewFavorite({ userId: user.userId, postId });
}

export async function removeFavorite(postId: string) {
  await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await deleteFavoriteFromDb({ postId });
}

export async function checkFavoriteBypostId(postId: string) {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const favoritePost = await getFavoriteByPostId(user.userId);
    if (favoritePost.postId.length === 0) {
      return false;
    }
    if (favoritePost.postId.includes(postId)) {
      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An ${error.name} Error occured: ${error.cause}, ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}

export async function getAllMyFavorites() {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const favoritedPost = await getFavoritesPostFromDb(user.userId);
    // if no bookmark found will return an empty array
    return favoritedPost;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An ${error.name} Error occured: ${error.cause}, ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}
