import "server-only";

import {
  createPublicPost,
  getAllPublicPosts,
  getMyPostFromDb,
  insertNewPost,
  selectPublicPosts,
} from "../data-access/postsQueries";
import { hasAccess } from "./auth/authentication";

export async function createPost(description: string | undefined, shareToPublic: boolean) {
  const user = await hasAccess({
    errorMsg: "Unauthorized user. Please login to post and image",
  });

  const postId = await insertNewPost({ description, userId: user.userId });
  if (postId.id === undefined) {
    throw new Error("unable to post this time, Please try again");
  }
  if (shareToPublic) {
    await createPublicPost(postId.id);
  }

  return postId;
}

export async function getPublicPosts() {
  await hasAccess({
    errorMsg: "Please login to view all the post",
  });

  const publicPost = await getAllPublicPosts();
  return publicPost;
}

export async function getSpecificPublicPost(userId: string) {
  await hasAccess({
    errorMsg: "Please login to view all the post",
  });

  const publicPost = await selectPublicPosts(userId);
  return publicPost;
}

export async function getMyPost() {
  const user = await hasAccess({ errorMsg: "Please Login to see your post" });

  try {
    const mypost = await getMyPostFromDb(user.userId);
    // will return empty array if no user found
    return mypost;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An ${error.name} Error occured: ${error.cause}, ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}
