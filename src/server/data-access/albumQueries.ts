import { randomUUID } from "node:crypto";
import type { Expand } from "@/lib/types-utils";
import { ZodError, coerce, z } from "zod";
import {
  type InsertAlbumsTypes,
  getAlbumsSchema,
  insertAlbumsSchema,
} from "../database/schema/albums";
import { turso } from "../database/turso";

const insertDataToAlbumsSchema = insertAlbumsSchema.extend({
  imageId: z.array(z.string()),
});

type InsertDataToAlbumsType = z.infer<typeof insertDataToAlbumsSchema>;

export async function insertDataToAlbums({
  name,
  imageId,
  postId,
  userId,
}: InsertDataToAlbumsType) {
  const parsedAlbumsData = insertDataToAlbumsSchema.safeParse({
    name,
    userId,
    postId,
    imageId,
  });

  if (parsedAlbumsData.success === false) {
    throw new ZodError(parsedAlbumsData.error.errors);
  }

  await turso.batch(
    parsedAlbumsData.data.imageId.map((imgId) => {
      return {
        sql: `
               INSERT INTO 
                  albums
                     (user_id,image_id,post_id,name)
               VALUES
                     (:userId,:imageId,:postId,:name)
               `,
        args: {
          userId: parsedAlbumsData.data.userId,
          imageId: imgId,
          postId: parsedAlbumsData.data.postId,
          name: parsedAlbumsData.data.name,
        },
      };
    }),
    "write"
  );
}

const getAlbumsFromDBSchema = getAlbumsSchema
  .pick({ name: true })
  .extend({ name: z.array(z.string()) });

export async function getAlbumsFromDB(userId: string) {
  const rawAlbums = await turso.execute({
    sql: `
      SELECT
         name
      FROM
         albums
      WHERE
         user_id = :userId
      GROUP BY name
      `,
    args: { userId },
  });
  const rawAlbumNameArray = rawAlbums.rows.map((row) => row.name);
  const parsedAlbums = getAlbumsFromDBSchema.safeParse({
    name: rawAlbumNameArray,
  });

  if (parsedAlbums.success === false) {
    console.error("Unable to get albums", parsedAlbums.error.errors);
    return null;
  }
  return parsedAlbums.data;
}
