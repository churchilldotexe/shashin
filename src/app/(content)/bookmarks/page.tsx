export const dynamic = "force-dynamic";

import { NoFile } from "@/components/EmptyFile";
import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { checkBookmarkBypostId, getAllMyBookmarks } from "@/server/use-cases/bookmarks-use-case";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";

export default async function BookmarksPage() {
  const myBookmarks = await getAllMyBookmarks();
  return (
    <PageSection className=" space-y-8 md:p-8">
      {myBookmarks.length === 0 ? (
        <NoFile
          title="No Bookmarks Yet"
          description="There is no bookmarked post to display this time. Bookmarks some post"
        />
      ) : (
        <Suspense fallback={<Loading />}>
          <div className="m-auto flex size-full grow flex-col gap-4">
            {myBookmarks?.map(async (post, index) => {
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
      )}
    </PageSection>
  );
}
