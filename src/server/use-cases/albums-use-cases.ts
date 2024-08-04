import { getAlbumsFromDB, insertDataToAlbums } from "../data-access/albumQueries";
import { getImageInfoByPostId } from "../data-access/imagesQueries";
import { hasAccess } from "./auth/authentication";

export async function getMyAlbums() {
  const user = await hasAccess({
    errorMsg: "unable to find user, Please Log in.",
  });

  try {
    const myAlbums = await getAlbumsFromDB(user.userId);
    return myAlbums;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to find your album,Error:${error.message}`);
    }
    throw new Error("Unable to find your album, add an album");
  }
}

export async function createAlbum({
  postId,
  name,
}: {
  postId: string;
  name: string;
}) {
  const { userId } = await hasAccess({ errorMsg: "Must be logged in to post" });

  const imageId = await getImageInfoByPostId(postId);

  try {
    await insertDataToAlbums({
      name,
      userId,
      postId,
      imageId: imageId?.id as string[],
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to post your album,Error:${error.message}`);
    }
    throw new Error("Unable to post your album, try again");
  }
}
