import { auth } from "@clerk/nextjs/server";
import "server-only";
import { randomUUID } from "node:crypto";
import { ZodError, z } from "zod";
import { turso } from "../turso";

function hasAccess({ errorMsg }: { errorMsg: string }) {
  const user = auth();
  if (user.userId === null) {
    throw new Error(errorMsg);
  }
  return user;
}

const createImageSchema = z.object({
  url: z.string().url().min(1).max(250),
  name: z.string().min(1).max(250),
  type: z.enum(["image/jpeg", "image/jpg", "image/bmp", "image/png", "image/gif", "image/webp"]),
  fileKey: z.string().min(1),
  postId: z.string().min(1),
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type createImageType = z.infer<typeof createImageSchema>;
const createImageSchemaArr = z.array(createImageSchema);

export async function createImage(imageData: createImageType[]) {
  hasAccess({ errorMsg: "user must be logged in to post image" });

  const parsedImage = createImageSchemaArr.safeParse(imageData);
  if (parsedImage.success === false) {
    throw new ZodError(parsedImage.error.errors);
  }

  await turso.batch(
    parsedImage.data.map((data) => {
      const { url, type, fileKey, postId, name } = data;
      const id = randomUUID();
      return {
        sql: `
        INSERT INTO
          images
            (id, url, name, type, file_key, postId)
        VALUES 
            (:id, :url, :name, :type, :fileKey, :postId)
      `,
        args: { id, url, type, fileKey, postId, name },
      };
    }),
    "write"
  );
}

const getMyImagesSchema = z.array(
  z.object({
    url: z.string().url().min(1),
  })
);

// NOTE: Must integrate with the USER ID
export async function getMyImages() {
  hasAccess({ errorMsg: "user must be logged in to query the images" });

  const myImages = await turso.execute({
    sql: `
      SELECT images.url as url FROM images
      `,
    args: {},
  });

  const parsedImages = getMyImagesSchema.safeParse(myImages.rows);

  if (parsedImages.success === false) {
    console.log(parsedImages.error.errors);
    return null;
  }

  return parsedImages.data;
}
