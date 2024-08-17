// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import "server-only";
import { ZodError, z } from "zod";
import { selectImageSchema } from "../database/schema/images";
import {
  type InsertPostSchemaTypes,
  insertPostSchema,
  selectPostSchema,
} from "../database/schema/posts";
import { getUserSchema } from "../database/schema/users";
import { turso } from "../database/turso";

export async function insertNewPost(postsValue: InsertPostSchemaTypes) {
  const uuid = randomUUID();

  const parsedPostValue = insertPostSchema.safeParse({
    ...postsValue,
    id: uuid,
  });
  if (parsedPostValue.success === false) {
    throw new ZodError(parsedPostValue.error.errors);
  }

  const { description, id, userId } = parsedPostValue.data;

  await turso.execute({
    sql: `
      INSERT INTO
        posts
          (id, description, user_id)
      VALUES
          (:id, :description, :userId)
      `,
    args: { id: id as string, description: description as string, userId },
  });

  return { id };
}

export async function createPublicPost(postId: string) {
  const allPostId = await turso.execute({
    sql: `
      INSERT INTO
        all_posts
          (post_id)
      VALUES
          (:postId)
`,
    args: { postId },
  });
}

const getPostSchema = z.array(
  z.object({
    avatarUrl: getUserSchema.shape.avatar,
    name: getUserSchema.shape.displayName,
    description: selectPostSchema.shape.description,
    id: selectPostSchema.shape.id,
    type: selectImageSchema.shape.type,
    url: z
      .string()
      .transform((val) => JSON.parse(val) as string)
      .pipe(z.array(z.string().url())),
    createdAt: z.string().transform((val) => {
      return new Date(`${val}Z`);
    }),
  })
);

const deletePostSchema = selectPostSchema.pick({ id: true, userId: true });

export async function deletePostFromDb({
  userId,
  postId,
}: {
  postId: string;
  userId: string;
}) {
  const parsedPostDate = deletePostSchema.safeParse({ id: postId, userId });

  if (parsedPostDate.success === false) {
    throw new ZodError(parsedPostDate.error.errors);
  }

  await turso.execute({
    sql: `
         DELETE FROM posts
         WHERE id = :postId 
            AND user_id = :userId
         `,
    args: {
      postId: parsedPostDate.data.id,
      userId: parsedPostDate.data.userId,
    },
  });
}

export async function getMyPostFromDb(userId: string) {
  const post = await turso.execute({
    sql: `
         SELECT
            u.avatar AS avatarUrl,
            u.display_name AS name,
            p.description as description,
            p.id as id,
            i.type as type,
            json_group_array(i.url) as url,
            datetime(p.created_at,'unixepoch') AS createdAt
         FROM
            posts p
         JOIN
            users u ON p.user_id = u.id
         LEFT JOIN
            images i ON p.id = i.post_id
         WHERE
            p.user_id = :userId
         GROUP BY
         p.id
         ORDER BY
         p.created_at DESC
`,
    args: { userId },
  });

  const dbResult = post.rows;
  console.log(dbResult, "dbresult");
  const parsedResult = getPostSchema.safeParse(dbResult);
  if (parsedResult.success === false) {
    throw new ZodError(parsedResult.error.errors);
  }
  return parsedResult.data;
}

const getPublicPostsSchema = z.object({
  name: z.string(),
  avatarUrl: z.string().nullish(),
  description: z.string(),
  id: z.string(),
  type: selectImageSchema.shape.type,
  url: z
    .string()
    .transform((val) => JSON.parse(val) as string)
    .pipe(z.array(z.string().url())),
  createdAt: z.string().transform((val) => {
    return new Date(`${val}Z`);
  }),
});

const getAllPublicPostsSchema = z.array(getPublicPostsSchema);

export async function getAllPublicPosts() {
  const post = await turso.execute({
    sql: `
        SELECT
            u.display_name AS name,
            u.avatar AS avatarUrl,
            p.id AS id,
            p.description AS description,
            json_group_array(i.url) AS url,
            datetime(p.created_at,'unixepoch') AS createdAt,
            i.type AS type
        FROM
            all_posts ap
        JOIN
            posts p ON ap.post_id = p.id
        LEFT JOIN
            images i ON p.id = i.post_id
        JOIN
            users u ON p.user_id = u.id
          WHERE
            i.post_id = p.id
        GROUP BY
            p.id
        ORDER BY
            p.created_at DESC;
        `,
    args: [],
  });

  const dbResult = post.rows;
  const parsedResult = getAllPublicPostsSchema.safeParse(dbResult);
  if (parsedResult.success === false) {
    throw new ZodError(parsedResult.error.errors);
  }
  return parsedResult.data;
}

export async function selectPublicPosts(postId: string) {
  const post = await turso.execute({
    sql: `
        SELECT
            u.display_name as name,
            u.avatar AS avatarUrl,
            p.id AS id,
            p.description AS description,
            json_group_array(i.url) AS url,
            datetime(p.created_at,'unixepoch') AS createdAt,
            i.type AS type
        FROM
            all_posts ap
        JOIN
            posts p ON ap.post_id = p.id
        LEFT JOIN
            images i ON p.id = i.post_id,
            users u ON p.user_id = u.id
          WHERE
             ap.post_id =  :postId

        `,
    args: { postId },
  });

  const dbResult = post.rows[0];
  const parsedResult = getPublicPostsSchema.safeParse(dbResult);
  if (parsedResult.success === false) {
    throw new ZodError(parsedResult.error.errors);
  }
  return parsedResult.data;
}
