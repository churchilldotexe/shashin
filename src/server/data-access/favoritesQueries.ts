import { ZodError, z } from "zod";
import { insertImageSchema, selectImageSchema } from "../database/schema/images";
import { selectPostSchema } from "../database/schema/posts";
import { getUserSchema } from "../database/schema/users";
import { turso } from "../database/turso";

const insertAndDeleteFavoriteSchema = insertImageSchema.pick({
  postId: true,
  userId: true,
});

export async function insertNewFavorite(rawData: {
  postId: string;
  userId: string;
}) {
  const parsedData = insertAndDeleteFavoriteSchema.safeParse(rawData);

  if (parsedData.success === false) {
    throw new ZodError(parsedData.error.errors);
  }

  await turso.execute({
    sql: `
         INSERT INTO 
            images
               (is_favorited)
         VALUES
               (:postId,:userId)
`,
    args: { postId: parsedData.data.postId, userId: parsedData.data.userId },
  });
}

// export async function deleteFavoriteFromDb(rawData: { postId: string }) {
//   const parsedData = insertAndDeleteFavoriteSchema.omit({ userId: true }).safeParse(rawData);
//
//   if (parsedData.success === false) {
//     throw new ZodError(parsedData.error.errors);
//   }
//
//   await turso.execute({
//     sql: `
//          DELETE FROM
//             favorites
//          WHERE
//             post_id = :postId
//          `,
//     args: { postId: parsedData.data.postId },
//   });
// }
//
// const getFavoritesPostByIdSchema = selectFavoriteSchema
//   .pick({ postId: true })
//   .transform((val) => JSON.parse(val.postId))
//   .pipe(z.array(z.string()));
//
// export async function getFavoriteByPostId(userId: string) {
//   const rawFavoritePost = await turso.execute({
//     sql: `
//          SELECT json_group_array(post_id) as postId
//          FROM favorites
//          WHERE user_id = :userId
//       `,
//     args: { userId },
//   });
//
//   const parsedFavoritePost = getFavoritesPostByIdSchema.safeParse(rawFavoritePost.rows[0]);
//   if (parsedFavoritePost.success === false) {
//     throw new ZodError(parsedFavoritePost.error.errors);
//   }
//
//   return { postId: parsedFavoritePost.data };
// }
//
// // ----- NOT YET FIXED BELOW ----
// const getFavoritesPostSchema = z.array(
//   z.object({
//     name: getUserSchema.shape.displayName,
//     id: selectPostSchema.shape.id,
//     description: selectPostSchema.shape.description,
//     url: z
//       .string()
//       .transform((val) => JSON.parse(val) as string)
//       .pipe(z.array(z.string().url())),
//     createdAt: z.string().transform((val) => {
//       return new Date(`${val}Z`);
//     }),
//     type: selectImageSchema.shape.type,
//   })
// );
//
// export async function getFavoritesPostFromDb(userId: string) {
//   const rawFavoriteData = await turso.execute({
//     sql: `
//          SELECT
//             u.display_name as name,
//             p.id as id,
//             p.description AS description,
//             json_group_array(i.url) AS url,
//             datetime(p.created_at,'unixepoch') AS createdAt,
//             i.type AS type
//          FROM
//             favorites f
//          JOIN
//             posts p ON f.post_id = p.id
//          LEFT JOIN
//             images i ON p.id = i.post_id
//          LEFT JOIN
//             users u ON p.user_id = u.id
//          WHERE
//             f.user_id = :userId
//          GROUP BY
//             p.id
//          ORDER BY
//             p.created_at DESC
//          `,
//     args: { userId },
//   });
//
//   const parsedFavoriteData = getFavoritesPostSchema.safeParse(rawFavoriteData.rows);
//
//   if (parsedFavoriteData.success === false) {
//     throw new ZodError(parsedFavoriteData.error.errors);
//   }
//   return parsedFavoriteData.data;
// }
