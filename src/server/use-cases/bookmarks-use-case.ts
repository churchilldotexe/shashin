import "server-only";

import {
  deleteBookmarkFromDb,
  getBookmarkByPostId,
  getBookmarksPostFromDb,
  insertNewBookmark,
} from "../data-access/bookmarksQueries";
import { hasAccess } from "./auth/authentication";

export async function createNewBookmark(postId: string) {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await insertNewBookmark({ userId: user.userId, postId });
}

export async function removeBookmark(postId: string) {
  await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  await deleteBookmarkFromDb({ postId });
}

export async function checkBookmarkBypostId(postId: string) {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const bookmarkedPost = await getBookmarkByPostId(user.userId);
    if (bookmarkedPost.postId.length === 0) {
      return false;
    }
    if (bookmarkedPost.postId.includes(postId)) {
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

export async function getAllMyBookmarks() {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const bookmarkedPost = await getBookmarksPostFromDb(user.userId);
    // if no bookmark found will return an empty array
    return bookmarkedPost;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An ${error.name} Error occured: ${error.cause}, ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}
