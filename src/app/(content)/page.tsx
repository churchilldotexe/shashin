import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { getPost } from "@/server/data-access/postsQueries";
import { PostImage } from "./_lib/_components/PostImage";

export default async function HomePage() {
  const allPost = await getPost();
  return (
    <PageSection>
      <PostImage className="rounded-lg p-4 shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]" />

      <div className="grow shadow-[0_8px_6px_0_rgba(0,0,0,0.1),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]">
        {allPost?.map((post) => {
          return (
            <article key={post.id} className="size-full border border-border p-6">
              <header className=" flex items-center justify-between">
                <h1>AZKi</h1>
                <time dateTime={new Date(post.createdAt).toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </time>
              </header>
              <figure>
                <figcaption>{post.description}</figcaption>
                <ImageSlider url={post.url} />
              </figure>
            </article>
          );
        })}
      </div>
    </PageSection>
  );
}

// NOTE: have an optional render where Userid === userId (if it is the user) when viewing the post it will also render the album it assoc to
// When the Image/post is clicked the PostsId must be the one that will register in the Link as params not the allPostsId
