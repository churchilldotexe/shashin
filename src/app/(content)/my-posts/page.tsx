import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { checkFavoriteBypostId } from "@/server/use-cases/favorites-use-case";
import { getMyPost } from "@/server/use-cases/post-use-case";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";

export default async function HomePage() {
  const myPost = await getMyPost();
  return (
    <PageSection className="space-y-8 p-8">
      {myPost.length === 0 ? (
        //TODO: handle this
        <div className="text-foreground">post something </div>
      ) : (
        <Suspense fallback={<Loading />}>
          <div className="m-auto flex size-full grow flex-col gap-4">
            {myPost?.map(async (post, index) => {
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

// FIX: work on this
// NOTE: have an optional render where Userid === userId (if it is the user) when viewing the post it will also render the album it assoc to
// NOTE: this will display (query) all posts of the user and display
// FEAT: DEFAULT is sorted by post date
// option : be able to sort the post (not priority )
