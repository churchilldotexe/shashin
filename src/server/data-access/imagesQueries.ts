import "server-only";
// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import { ZodError, z } from "zod";
import {
  type InsertImageType,
  insertImageSchema,
  selectImageSchema,
} from "../database/schema/images";
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

const insertAndDeleteFavoriteSchema = insertImageSchema.pick({
  id: true,
});

export async function insertNewFavorite(rawData: { id: string }) {
  const parsedData = insertAndDeleteFavoriteSchema.safeParse(rawData);

  if (parsedData.success === false) {
    throw new ZodError(parsedData.error.errors);
  }

  await turso.execute({
    sql: `
         UPDATE images
         SET is_favorited = true
         WHERE id = :imageId
         `,
    args: {
      imageId: parsedData.data.id as string,
    },
  });
}

export async function deleteFavoriteFromDb(rawData: { id: string }) {
  const parsedData = insertAndDeleteFavoriteSchema.safeParse(rawData);

  if (parsedData.success === false) {
    throw new ZodError(parsedData.error.errors);
  }

  await turso.execute({
    sql: `
         UPDATE images
         SET is_favorited = false
         WHERE id = :imageId
         `,
    args: { imageId: parsedData.data.id as string },
  });
}

const deleteImageDataSchema = insertImageSchema.pick({ id: true, userId: true }).required();

export async function deleteImageFromDb({
  userId,
  id,
}: {
  userId: string;
  id: string;
}) {
  const parsedImageData = deleteImageDataSchema.safeParse({ id, userId });

  if (parsedImageData.success === false) {
    throw new ZodError(parsedImageData.error.errors);
  }

  await turso.execute({
    sql: `
         DELETE FROM images
         WHERE id = :imageId 
            AND user_id = :userId
         `,
    args: {
      imageId: parsedImageData.data.id,
      userId: parsedImageData.data.userId,
    },
  });
}

export async function getImageFileKeyFromDb(imageId: string) {
  const rawImageFileKey = await turso.execute({
    sql: `
         SELECT images.file_key as fileKey
         FROM images
         WHERE images.id = :imageId
         `,
    args: { imageId },
  });

  const parsedImageFileKey = selectImageSchema
    .pick({ fileKey: true })
    .safeParse(rawImageFileKey.rows[0]);

  if (parsedImageFileKey.success === false) {
    throw new ZodError(parsedImageFileKey.error.errors);
  }

  return parsedImageFileKey.data;
}

const getFavoritedImageSchema = selectImageSchema
  .pick({ url: true })
  .transform((val) => JSON.parse(val.url))
  .pipe(z.object({ url: z.array(z.string().url()) }));

export async function getFavoritedImagesByUserId(userId: string) {
  const rawImageUrl = await turso.execute({
    sql: `
         SELECT json_group_array(url) as url
         FROM images
         WHERE user_id = :userId 
            AND is_favorited = true
         `,

    args: { userId },
  });

  const parsedImageUrl = getFavoritedImageSchema.safeParse(rawImageUrl.rows);
  if (parsedImageUrl.success === false) {
    throw new ZodError(parsedImageUrl.error.errors);
  }
  return parsedImageUrl.data;
}

const getMyImagesSchema = z.array(
  z.object({
    id: selectImageSchema.shape.id,
    url: selectImageSchema.shape.url,
    name: selectImageSchema.shape.name,
    fileKey: selectImageSchema.shape.fileKey,
    isFavorited: z.number().transform((val) => Boolean(val)),
    createdAt: z.string().transform((val) => {
      return new Date(`${val}Z`);
    }),
    updatedAt: z.string().transform((val) => {
      return new Date(`${val}Z`);
    }),
  })
);

export async function getAllMyFavoritesFromDb(userId: string) {
  const rawFavoritedImages = await turso.execute({
    sql: `
      SELECT 
         images.url as url,
         images.id as id,
         images.name as name,
         images.file_key as fileKey,
         images.is_favorited as isFavorited,
         datetime(images.created_at,'unixepoch') AS createdAt,
         datetime(images.updated_at,'unixepoch') AS updatedAt
      FROM images
      WHERE user_id = :userId
         AND images.is_favorited = true
         ORDER BY
            images.created_at DESC
      `,
    args: { userId },
  });

  const parsedFavoritedImages = getMyImagesSchema.safeParse(rawFavoritedImages.rows);

  if (parsedFavoritedImages.success === false) {
    throw new ZodError(parsedFavoritedImages.error.errors);
  }

  return parsedFavoritedImages.data;
}

export async function getMyImagesFromDb(userId: string) {
  const rawMyImages = await turso.execute({
    sql: `
      SELECT 
         images.url as url,
         images.id as id,
         images.name as name,
         images.file_key as fileKey,
         images.is_favorited as isFavorited,
         datetime(images.created_at,'unixepoch') AS createdAt,
         datetime(images.updated_at,'unixepoch') AS updatedAt
      FROM images
      WHERE user_id = :userId
         ORDER BY
            images.created_at DESC
      `,
    args: { userId },
  });

  const parsedMyImages = getMyImagesSchema.safeParse(rawMyImages.rows);

  if (parsedMyImages.success === false) {
    throw new ZodError(parsedMyImages.error.errors);
  }

  return parsedMyImages.data;
}

const getImageInfoByPostIdSchema = insertImageSchema.pick({ id: true }).extend({
  id: z
    .string()
    .transform((val) => JSON.parse(val as string))
    .pipe(z.array(z.string())),
});

export async function getImageInfoByPostId(postId: string) {
  const rawImageInfo = await turso.execute({
    sql: `
         SELECT json_group_array(id) as id 
         FROM images 
         WHERE post_id = :postId
      `,
    args: { postId },
  });

  const parsedImageInfo = getImageInfoByPostIdSchema.safeParse(rawImageInfo.rows[0]);

  if (parsedImageInfo.success === false) {
    console.error(parsedImageInfo.error.errors);
    return null;
  }

  return parsedImageInfo.data;
}
