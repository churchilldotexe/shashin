// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import "server-only";
import { ZodError, z } from "zod";
import { type InsertPostSchemaTypes, insertPostSchema } from "../database/schema/posts";
import { turso } from "../database/turso";

// NOTE: add new column to the table.. create a public and private post.. private post make the images private

const getPostSchema = z.array(
  z.object({
    description: z.string(),
    id: z.string(),
    url: z
      .string()
      .transform((val) => JSON.parse(val) as string)
      .pipe(z.array(z.string().url())),
    createdAt: z.string().pipe(z.coerce.date()),
  })
);

//TODO: make a similar table for this but instead the private one (try to figure out how to separate them
//1. add boolean to the post table to toggle private/public(easier)
// 2. when toggled add a foreign key to new table for public post)
export async function getPost() {
  // isAuthenticated();

  const post = await turso.execute({
    sql: `SELECT 
            p.description as description,
            p.id as id, 
            json_group_array(i.url) as url,
            p.created_at as createdAt
          FROM
            images i, posts p 
          WHERE 
            i.post_id = p.id 
          GROUP BY 
            p.id
          ORDER BY
            p.created_at DESC
          `,
    args: [],
  });

  const dbResult = post.rows;
  const parsedResult = getPostSchema.safeParse(dbResult);
  if (parsedResult.success === false) {
    throw new ZodError(parsedResult.error.errors);
  }
  return parsedResult.data;
}

const createPostSchema = z.object({
  id: z.string().optional(),
  description: z.string().max(250).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type createPostSchemaType = z.infer<typeof createPostSchema>;

export async function newPost(postsValue: InsertPostSchemaTypes) {
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
  console.log("allPostId", allPostId);
}

const getAllPublicPostsSchema = z.array(
  z.object({
    description: z.string(),
    id: z.string(),
    url: z
      .string()
      .transform((val) => JSON.parse(val) as string)
      .pipe(z.array(z.string().url())),
    createdAt: z.string().pipe(z.coerce.date()),
  })
);

export async function getAllPublicPosts() {
  const post = await turso.execute({
    sql: `
        SELECT 
            p.id AS id,
            p.description AS description,
            json_group_array(i.url) AS url,
            i.created_at AS createdAt
        FROM 
            all_posts ap
        JOIN 
            posts p ON ap.post_id = p.id
        LEFT JOIN 
            images i ON p.id = i.post_id
        ORDER BY 
            p.created_at DESC;
        `,
    args: [],
  });

  const dbResult = post.rows;
  console.log("dbResult", dbResult);
  const parsedResult = getAllPublicPostsSchema.safeParse(dbResult);
  if (parsedResult.success === false) {
    throw new ZodError(parsedResult.error.errors);
  }
  return parsedResult.data;
}
