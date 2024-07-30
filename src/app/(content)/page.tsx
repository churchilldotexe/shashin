import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { getPublicPosts } from "@/server/use-cases/post-use-case";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PostImage } from "./_lib/_components/PostImage";

export default async function HomePage() {
  const allPost = await getPublicPosts();
  return (
    <PageSection className="gap-4">
      <PostImage className=" rounded-lg p-4 shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" />

      <div className="size-full grow space-y-4 ">
        {allPost?.map((post, index) => {
          const unoptimize = (post.type === "image/webp" || post.type === "image/gif") && false;
          return (
            <Link href={`/img/${post.id}`} key={post.id} scroll={false}>
              <article
                className="fade-in-image m-auto size-[85%] rounded-lg border border-border p-6 shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]"
                style={{ "--i": `${index}` } as CSSProperties}
              >
                <header className=" flex items-center justify-between">
                  <h1>{post.name}</h1>
                  <time dateTime={new Date(post.createdAt).toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                </header>
                <figure>
                  <figcaption>{post.description}</figcaption>
                  <ImageSlider url={post.url} unoptimized={unoptimize} />
                </figure>
              </article>
            </Link>
          );
        })}
      </div>
    </PageSection>
  );
}

// NOTE: have an optional render where Userid === userId (if it is the user) when viewing the post it will also render the album it assoc to
// When the Image/post is clicked the PostsId must be the one that will register in the Link as params not the allPostsId
