import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { getPost } from "@/server/data-access/postsQueries";
import { PostImage } from "../_lib/_components/PostImage";

export default async function HomePage() {
  const myPost = await getPost();
  return (
    <PageSection>
      <PostImage />
      <div className="grow">
        {myPost?.map((post) => {
          return (
            <article key={post.id} className="size-full border border-border p-6">
              <header className="flex items-center justify-between">
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

// NOTE: this will display (query) all posts of the user and display
// FEAT: DEFAULT is sorted by post date
// option : be able to sort the post (not priority )
