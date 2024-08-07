import { randomUUID } from "node:crypto";
import { ZodError, z } from "zod";
import { insertBookmarksSchema, selectBookmarkSchema } from "../database/schema/bookmarks";
import { selectImageSchema } from "../database/schema/images";
import { selectPostSchema } from "../database/schema/posts";
import { getUserSchema } from "../database/schema/users";
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

const getBookmarksPostSchema = z.array(
  z.object({
    name: getUserSchema.shape.displayName,
    id: selectPostSchema.shape.id,
    description: selectPostSchema.shape.description,
    url: z.array(selectImageSchema.shape.url),
    createdAt: selectPostSchema.shape.createdAt,
    type: selectImageSchema.shape.type,
  })
);

export async function getBookmarksPostFromDb(userId: string) {
  const rawBookmarkData = await turso.execute({
    sql: `
         SELECT 
            u.display_name as name,
            p.id as id,
            p.description AS description,
            json_group_array(i.url) AS url,
            datetime(p.created_at,'unixepoch') AS createdAt,
            i.type AS type
         FROM 
            bookmarks b
         JOIN
            posts p ON b.post_id = p.id
         LEFT JOIN
            images i ON p.id = i.post_id
         LEFT JOIN
            users u ON p.user_id = u.id
         WHERE
            b.user_id = :userId
         GROUP BY
            p.id 
         ORDER BY
            p.created_at DESC
         `,
    args: { userId },
  });

  const parsedBookmarkData = getBookmarksPostSchema.safeParse(rawBookmarkData.rows);

  if (parsedBookmarkData.success === false) {
    throw new ZodError(parsedBookmarkData.error.errors);
  }

  return parsedBookmarkData.data;
}
