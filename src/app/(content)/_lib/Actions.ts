"use server";

import { createImage, type createImageType } from "@/server/data-access/imagesQueries";
import { createPost } from "@/server/data-access/postsQueries";
import { removeTokenInfoFromDB } from "@/server/use-cases/auth/tokenManagement";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { formSchema } from "./formschema";

type PostImageActionInitType = {
  message?: string;
};

const utapi = new UTApi();

export async function postImageAction(
  initialValue: PostImageActionInitType,
  formData: FormData
): Promise<PostImageActionInitType> {
  const formEntries = Object.fromEntries(formData.entries());
  const images = formData.getAll("images");
  const parsedFormData = formSchema.safeParse({ ...formEntries, images });
  if (parsedFormData.success === false) {
    // throw new Error("invalid form data");
    return { message: "invalid form data" };
  }
  console.log(parsedFormData.data);
  const { description } = parsedFormData.data;

  const post = await createPost({ description });
  const utImages = await utapi.uploadFiles(parsedFormData.data.images);

  const imageData = utImages.map((image) => {
    if (image.data === null) {
      throw new Error(image.error.message);
    }
    if (post.id === undefined) {
      throw new Error("unable to retrieve the post");
    }
    const { url, key, type, name } = image.data;

    const newName = name.split(".").slice(0, -1).join(".");
    return {
      url,
      name: newName,
      type,
      fileKey: key,
      postId: post.id,
    } as createImageType;
  });
  await createImage(imageData);
  revalidatePath("/");
  redirect("/");
}

export async function logoutAction() {
  const isTokenRemovedFromDB = await removeTokenInfoFromDB();
  if (isTokenRemovedFromDB === false) {
    redirect("/login");
  } else {
    cookies().delete("accessToken");
    redirect("/login");
  }
}
