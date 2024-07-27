import "server-only";
// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { ZodError, z } from "zod";
import { type InsertImageType, insertImageSchema } from "../database/schema/images";
import { turso } from "../database/turso";

const createImageSchemaArr = z.array(insertImageSchema);

export async function insertImage(imageData: InsertImageType[]) {
  const parsedImage = createImageSchemaArr.safeParse(imageData);
  if (parsedImage.success === false) {
    throw new ZodError(parsedImage.error.errors);
  }

  await turso.batch(
    parsedImage.data.map((data) => {
      const { url, type, fileKey, postId, name, userId } = data;
      const id = randomUUID();
      return {
        sql: `
        INSERT INTO
          images
            (id, url, name, type, file_key, post_id, user_id)
        VALUES 
            (:id, :url, :name, :type, :fileKey, :postId, :userId)
      `,
        args: { id, url, type, fileKey, postId, name, userId },
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
  // hasAccess({ errorMsg: "user must be logged in to query the images" });

  const myImages = await turso.execute({
    sql: `
      SELECT images.url as url FROM images
      `,
    args: {},
  });

  const parsedImages = getMyImagesSchema.safeParse(myImages.rows);

  if (parsedImages.success === false) {
    return null;
  }

  return parsedImages.data;
}
