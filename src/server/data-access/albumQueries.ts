import { randomUUID } from "node:crypto";
import type { Expand } from "@/lib/types-utils";
import { ZodError, coerce, z } from "zod";
import {
  type InsertAlbumsTypes,
  getAlbumsSchema,
  insertAlbumsSchema,
} from "../database/schema/albums";
import { selectImageSchema } from "../database/schema/images";
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
    throw new ZodError(parsedAlbums.error.errors);
  }
  return parsedAlbums.data;
}

const getAllMyAlbumsFromDBSchema = z.array(
  z.object({
    albumName: getAlbumsSchema.shape.name,
    url: selectImageSchema.shape.url
      .transform((val) => JSON.parse(val))
      .pipe(z.array(z.string().url())),
    createdAt: z.string().transform((val) => {
      return new Date(`${val}Z`);
    }),
  })
);

export async function getAllMyAlbumsFromDB(userId: string) {
  const rawAlbumData = await turso.execute({
    sql: `
         SELECT 
            a.name AS albumName,
            json_group_array(i.url) as url,
            datetime(a.created_at,'unixepoch') AS createdAt
         FROM
            albums a
         LEFT JOIN
            images i ON a.post_id = i.post_id
         WHERE a.user_id = :userId
         GROUP BY
            a.id 
         ORDER BY
            a.created_at DESC
         `,
    args: { userId },
  });

  const parsedAlbumData = getAllMyAlbumsFromDBSchema.safeParse(rawAlbumData.rows);

  if (parsedAlbumData.success === false) {
    throw new ZodError(parsedAlbumData.error.errors);
  }
  return parsedAlbumData.data;
}
