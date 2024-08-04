import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { getMyAlbums } from "@/server/use-cases/albums-use-cases";
import { getPublicPosts } from "@/server/use-cases/post-use-case";
import Link from "next/link";
import { PostImage } from "./_lib/_components/PostImage";

export default async function HomePage() {
  const allPost = await getPublicPosts();
  const myAlbums = await getMyAlbums();
  return (
    <PageSection className="space-y-8">
      <PostImage
        albums={myAlbums}
        className=" rounded-lg p-4 shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]"
      />

      <div className="flex size-full grow flex-col gap-4">
        {allPost?.map((post, index) => {
          const { type, ...restPost } = post;
          const unoptimize = (type === "image/webp" || type === "image/gif") && false;
          const postContent = { ...restPost, unoptimize, index };

          return (
            <Link href={`/img/${post.id}`} key={post.id} scroll={false}>
              <PostContent postContent={postContent} />
            </Link>
          );
        })}
      </div>
    </PageSection>
  );
}

// NOTE: have an optional render where Userid === userId (if it is the user) when viewing the post it will also render the album it assoc to
// When the Image/post is clicked the PostsId must be the one that will register in the Link as params not the allPostsId
