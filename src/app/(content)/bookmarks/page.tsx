import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { checkBookmarkBypostId, getAllMyBookmarks } from "@/server/use-cases/bookmarks-use-case";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";

export default async function BookmarksPage() {
  const myBookmarks = await getAllMyBookmarks();
  return (
    <PageSection className="space-y-8">
      {!myBookmarks ? (
        <div>no bookmarks</div>
      ) : (
        <div className="m-auto flex size-[85%] grow flex-col gap-4">
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
                <Suspense fallback={<Loading />}>
                  <PostContent postContent={postContent} />
                </Suspense>
              </Link>
            );
          })}
        </div>
      )}
    </PageSection>
  );
}

// NOTE: bookmarks will take the posts id and list all posts that are bookmarked
// probably new table for bookmarks
// relation: BOOKMARK can have many post but POST can only be bookmarked once
