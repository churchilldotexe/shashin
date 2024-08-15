import { AvatarWithFallBack } from "@/components/AvatarWithFallBack";
import { NoFile } from "@/components/EmptyFile";
import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { cn } from "@/lib/utils";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { checkFavoriteBypostId } from "@/server/use-cases/favorites-use-case";
import { getMyPost } from "@/server/use-cases/post-use-case";
import { getUserInfo } from "@/server/use-cases/user-use-cases";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";
import DisplayProfile from "./_lib/DisplayProfile";

export default async function HomePage() {
  const myPost = await getMyPost();
  const myProfile = await getUserInfo();
  return (
    <PageSection className="justify-start space-y-8 py-4 md:px-8 ">
      <DisplayProfile displayName={myProfile.displayName} avatar={myProfile.avatar} />
      {myPost.length === 0 ? (
        <NoFile
          title="No Post Yet"
          description="There is no Post to display this time. Try posting some."
        />
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
// option : be able to sort the post (not priority )
