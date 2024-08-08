import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { getMyAlbumsList } from "@/server/use-cases/albums-use-cases";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { getPublicPosts } from "@/server/use-cases/post-use-case";
import Link from "next/link";
import { Suspense } from "react";
import { PostImage } from "./_lib/_components/PostImage";
import Loading from "./loading";

export default async function HomePage() {
  const allPost = await getPublicPosts();
  const myAlbums = await getMyAlbumsList();

  return (
    <PageSection className="space-y-8">
      <PostImage
        albums={myAlbums}
        className=" rounded-lg p-4 shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]"
      />

      <Suspense fallback={<Loading />}>
        <div className="flex size-full grow flex-col gap-4">
          {allPost?.map(async (post, index) => {
            const { type, ...restPost } = post;
            const unoptimize = (type === "image/webp" || type === "image/gif") && false;
            const isBookmarked = await checkBookmarkBypostId(post.id);
            const postContent = {
              ...restPost,
              unoptimize,
              index,
              isBookmarked,
            };

            return (
              <Link href={`/img/${post.id}`} key={post.id} scroll={false}>
                <PostContent postContent={postContent} />
              </Link>
            );
          })}
        </div>
      </Suspense>
    </PageSection>
  );
}
