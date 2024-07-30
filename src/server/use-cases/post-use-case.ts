import "server-only";

import {
  createPublicPost,
  getAllPublicPosts,
  newPost,
  selectPublicPosts,
} from "../data-access/postsQueries";
import { getAuthenticatedId } from "./auth/tokenManagement";

async function hasAccess({ errorMsg }: { errorMsg: string }) {
  const user = await getAuthenticatedId();
  if (user === undefined) {
    throw new Error(errorMsg);
  }
  return user;
}

export async function createPost(description: string | undefined, shareToPublic: boolean) {
  const user = await hasAccess({
    errorMsg: "Unauthorized user. Please login to post and image",
  });

  const postId = await newPost({ description, userId: user.userId });
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
