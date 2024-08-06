import { randomUUID } from "node:crypto";
import { ZodError, z } from "zod";
import { insertBookmarksSchema, selectBookmarkSchema } from "../database/schema/bookmarks";
import { turso } from "../database/turso";

const insertAndDeleteBookmarkSchema = insertBookmarksSchema.pick({
  postId: true,
  userId: true,
});

export async function insertNewBookmark(rawData: {
  postId: string;
  userId: string;
}) {
  const parsedData = insertAndDeleteBookmarkSchema.safeParse(rawData);

  if (parsedData.success === false) {
    throw new ZodError(parsedData.error.errors);
  }

  await turso.execute({
    sql: `
         INSERT INTO 
            bookmarks
               (post_id,user_id)
         VALUES
               (:postId,:userId)
`,
    args: { postId: parsedData.data.postId, userId: parsedData.data.userId },
  });
}

export async function deleteBookmarkFromDb(rawData: { postId: string }) {
  const parsedData = insertAndDeleteBookmarkSchema.omit({ userId: true }).safeParse(rawData);

  if (parsedData.success === false) {
    throw new ZodError(parsedData.error.errors);
  }

  await turso.execute({
    sql: `
         DELETE FROM
            bookmarks
         WHERE
            post_id = :postId
         `,
    args: { postId: parsedData.data.postId },
  });
}

export async function getBookmarkByPostId(userId: string) {
  const rawBookmarkedPost = await turso.execute({
    sql: `
         SELECT json_group_array(post_id) as postId
         FROM bookmarks
         WHERE user_id = :userId
      `,
    args: { userId },
  });

  const parsedBookmarkedPost = selectBookmarkSchema
    .pick({ postId: true })
    .transform((val) => JSON.parse(val.postId))
    .pipe(z.array(z.string()))
    .safeParse(rawBookmarkedPost.rows[0]);

  if (parsedBookmarkedPost.success === false) {
    throw new ZodError(parsedBookmarkedPost.error.errors);
  }

  return { postId: parsedBookmarkedPost.data };
}
