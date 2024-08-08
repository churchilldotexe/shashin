import "server-only";

import {
  deleteFavoriteFromDb,
  getAllMyFavoritesFromDb,
  getFavoritedImagesByUserId,
  insertNewFavorite,
} from "../data-access/imagesQueries";
import { hasAccess } from "./auth/authentication";

export async function createNewFavorite(imageId: string) {
  await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await insertNewFavorite({ id: imageId });
}

export async function removeFavorite(imageId: string) {
  await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await deleteFavoriteFromDb({ id: imageId });
}

export async function checkFavoriteBypostId(url: string) {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const favoritePost = await getFavoritedImagesByUserId(user.userId);
    if (favoritePost.url.length === 0) {
      return false;
    }
    if (favoritePost.url.includes(url)) {
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

export async function getAllMyFavoritedImages() {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const favoritedPost = await getAllMyFavoritesFromDb(user.userId);
    // if no bookmark found will return an empty array
    return favoritedPost;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An ${error.name} Error occured,cause: ${error.cause}, ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}
