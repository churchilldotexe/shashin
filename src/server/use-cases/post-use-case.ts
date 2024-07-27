import "server-only";

import { createPublicPost, newPost } from "../data-access/postsQueries";
import { getAuthenticatedId } from "./auth/tokenManagement";

export async function createPost(description: string | undefined, shareToPublic: boolean) {
  const user = await getAuthenticatedId();

  if (user === undefined) {
    throw new Error("Unauthorized user. Please login to post and image");
  }

  const postId = await newPost({ description, userId: user.userId });
  if (postId.id === undefined) {
    throw new Error("unable to post this time, Please try again");
  }
  if (shareToPublic) {
    await createPublicPost(postId.id);
  }

  return postId;
}
