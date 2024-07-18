import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import "server-only";
import { ZodError, z } from "zod";
import { turso } from "../turso";

// NOTE: add new column to the table.. create a public and private post.. private post make the images private

export const isAuthenticated = () => {
  const user = auth();
  if (user.userId === null) {
    return null;
  }
  return user;
};

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
  isAuthenticated();

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

export async function createPost(postsValue: createPostSchemaType) {
  const user = auth();
  if (user === null) {
    throw new Error("no Authorization. Must be logged in to post");
  }

  const uuid = randomUUID();

  const parsedPostValue = createPostSchema.safeParse({ ...postsValue, id: uuid });
  if (parsedPostValue.success === false) {
    throw new ZodError(parsedPostValue.error.errors);
  }

  const { description, id } = parsedPostValue.data;

  await turso.execute({
    sql: `
      INSERT INTO 
        posts
          (id, description)
      VALUES 
          (:id, :description)
`,
    args: { id: id as string, description: description as string },
  });

  return { id };
}
