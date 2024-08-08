import { PageSection } from "@/components/PageSection";
import PostContent from "@/components/PostContent";
import { checkBookmarkBypostId } from "@/server/use-cases/bookmarks-use-case";
import { getSpecificPublicPost } from "@/server/use-cases/post-use-case";

export default async function PhotoModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const specificPublicPost = await getSpecificPublicPost(id);
  const { type, ...restPost } = specificPublicPost;
  const unoptimize = (type === "image/webp" || type === "image/gif") && false;
  const isBookmarked = await checkBookmarkBypostId(id);
  const postContent = {
    isBookmarked,
    unoptimize,
    ...restPost,
  };
  return (
    <PageSection>
      <PostContent postContent={postContent} />
    </PageSection>
  );
}
