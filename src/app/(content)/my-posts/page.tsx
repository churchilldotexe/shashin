export const dynamic = "force-dynamic";

import { NoFile } from "@/components/EmptyFile";
import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { getMyPost } from "@/server/use-cases/post-use-case";
import { getUserInfo } from "@/server/use-cases/user-use-cases";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";
import DisplayProfile from "./_lib/DisplayProfile";

export default async function HomePage() {
  const myPost = await getMyPost();
  const myProfile = await getUserInfo();

  const postContent = await Promise.allSettled(
    myPost.map(async (post, index) => {
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
    <PageSection className="justify-start space-y-8 py-4 md:px-8 ">
      <DisplayProfile displayName={myProfile.displayName} avatar={myProfile.avatar} />
      {myPost.length === 0 ? (
        <NoFile
          title="No Post Yet"
          description="There is no Post to display this time. Try posting some."
        />
      ) : (
        <div className="m-auto flex size-full grow flex-col gap-4">
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
      )}
    </PageSection>
  );
}
