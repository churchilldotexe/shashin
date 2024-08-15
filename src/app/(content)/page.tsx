import { PageSection } from "@/components/PageSection";
import { getMyAlbumsList } from "@/server/use-cases/albums-use-cases";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { getPublicPosts } from "@/server/use-cases/post-use-case";
import Link from "next/link";
import { Suspense, lazy } from "react";
import { PostImage } from "./_lib/_components/PostImage";
import Loading from "./loading";

const PostContent = lazy(() => import("@/components/PostContent"));

export default async function HomePage() {
  const allPost = await getPublicPosts();
  const myAlbums = await getMyAlbumsList();

  const postContent = await Promise.allSettled(
    allPost.map(async (post, index) => {
      const { type, ...restPost } = post;
      const unoptimize = (type === "image/webp" || type === "image/gif") && false;
      const isBookmarked = await checkBookmarkBypostId(post.id);
      const postContent = {
        ...restPost,
        unoptimize,
        index,
        isBookmarked,
      };
      return postContent;
    })
  );

  return (
    <PageSection className="space-y-8 md:px-8">
      <PostImage
        albums={myAlbums}
        className=" rounded-lg p-4 shadow-elevate-light dark:shadow-elevate-dark "
      />

      <div className="flex size-full grow flex-col gap-4">
        {postContent
          .filter((result) => result.status === "fulfilled")
          .map((content) => {
            return (
              <Suspense key={content.value.id} fallback={<Loading />}>
                <Link href={`/img/${content.value.id}`} scroll={false}>
                  <PostContent postContent={content.value} />
                </Link>
              </Suspense>
            );
          })}
      </div>
    </PageSection>
  );
}
