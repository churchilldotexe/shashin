"use server";

import { createAlbum } from "@/server/use-cases/albums-use-cases";
import { removeTokenInfoFromDB } from "@/server/use-cases/auth/tokenManagement";
import { createImage } from "@/server/use-cases/images-use-cases";
import type { CreateImageType } from "@/server/use-cases/images-use-cases-TypesAndSchema";
import { createPost } from "@/server/use-cases/post-use-case";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import type { z } from "zod";
import { formSchema } from "./formschema";

type formSchemaTypes = z.infer<typeof formSchema>;
type PostImageActionInitType = {
  [K in keyof formSchemaTypes]?: string;
} & { message?: "success" | "failed" };

const utapi = new UTApi();

export async function postImageAction(
  initialValue: PostImageActionInitType,
  formData: FormData
): Promise<PostImageActionInitType> {
  const formEntries = Object.fromEntries(formData.entries());
  const images = formData.getAll("images");
  const parsedFormData = formSchema.safeParse({ ...formEntries, images });
  if (parsedFormData.success === false) {
    const { images, description, shareToPublic } = parsedFormData.error.formErrors.fieldErrors;
    return {
      description: description?.[0] ?? undefined,
      images: images?.[0] ?? undefined,
      shareToPublic: shareToPublic?.[0] ?? undefined,
    };
  }
  const { description, shareToPublic, albumName } = parsedFormData.data;

  const post = await createPost(description, shareToPublic);
  if (post.id === undefined) {
    throw new Error("unable to retrieve the post");
  }

  const utImages = await utapi.uploadFiles(parsedFormData.data.images);

  const imageData = utImages.map((image) => {
    if (image.data === null) {
      throw new Error(image.error.message);
    }
    const { url, key, type, name } = image.data;

    const newName = name.split(".").slice(0, -1).join(".");
    return {
      url,
      name: newName,
      type,
      fileKey: key,
      postId: post.id,
    } as CreateImageType;
  });

  await createImage(imageData);
  await createAlbum({ postId: post.id, name: albumName });
  revalidatePath("/");

  return { message: "success" };
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
