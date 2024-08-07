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
    if (bookmarkedPost.postId.includes(postId)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAllMyBookmarks() {
  const user = await hasAccess({
    errorMsg: "Unable to find user. Please log in",
  });

  try {
    const bookmarkedPost = await getBookmarksPostFromDb(user.userId);
    return bookmarkedPost;
  } catch (error) {
    // to ensure it wont throw error when user have no bookmarks
    console.error(error);
    return null;
  }
}
