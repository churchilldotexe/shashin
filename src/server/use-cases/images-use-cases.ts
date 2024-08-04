import "server-only";
import { insertImage } from "../data-access/imagesQueries";
import { hasAccess } from "./auth/authentication";
import { getAuthenticatedId } from "./auth/tokenManagement";
import type { CreateImageType } from "./images-use-cases-TypesAndSchema";

export async function createImage(imageData: CreateImageType[]) {
  const { userId } = await hasAccess({
    errorMsg: "user must be logged in to post an image",
  });

  const authenticatedImageData = imageData.map((data) => ({ ...data, userId }));

  await insertImage(authenticatedImageData);
}
