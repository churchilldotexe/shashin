import "server-only";
import { getMyImagesFromDb, insertImage } from "../data-access/imagesQueries";
import { hasAccess } from "./auth/authentication";
import type { CreateImageType } from "./images-use-cases-TypesAndSchema";

export async function createImage(imageData: CreateImageType[]) {
  const { userId } = await hasAccess({
    errorMsg: "user must be logged in to post an image",
  });

  const authenticatedImageData = imageData.map((data) => ({ ...data, userId }));

  await insertImage(authenticatedImageData);
}

export async function getMyImages() {
  const { userId } = await hasAccess({
    errorMsg: "Please login to view your images",
  });

  try {
    const myImages = await getMyImagesFromDb(userId);
    // will return empty array if no images
    return myImages;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`An Error Occured ${error.name}: ${error.message}`);
    }
    throw new Error("Unexpected Error Occured");
  }
}
