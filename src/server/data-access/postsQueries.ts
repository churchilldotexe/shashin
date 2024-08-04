// biome-ignore lint/style/useNodejsImportProtocol: <file: and Data: is being used>
import { randomUUID } from "crypto";
import "server-only";
import { ZodError, z } from "zod";
import { selectImageSchema } from "../database/schema/images";
import { type InsertPostSchemaTypes, insertPostSchema } from "../database/schema/posts";
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
  console.log("allPostId", allPostId);
}

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

// NOTE: this is for Profile page(my post)
export async function getPost() {
  // FIX: must be in post-use-cases
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

const getPublicPostsSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.string(),
  type: selectImageSchema.shape.type,
  url: z
    .string()
    .transform((val) => JSON.parse(val) as string)
    .pipe(z.array(z.string().url())),
  createdAt: z.string().pipe(z.coerce.date()),
});

const getAllPublicPostsSchema = z.array(getPublicPostsSchema);

export async function getAllPublicPosts() {
  const post = await turso.execute({
    sql: `
        SELECT 
            u.display_name as name,
            p.id AS id,
            p.description AS description,
            json_group_array(i.url) AS url,
            i.created_at AS createdAt,
            i.type AS type
        FROM 
            all_posts ap
        JOIN 
            posts p ON ap.post_id = p.id
        LEFT JOIN 
            images i ON p.id = i.post_id,
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
            p.id AS id,
            p.description AS description,
            json_group_array(i.url) AS url,
            i.created_at AS createdAt,
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
