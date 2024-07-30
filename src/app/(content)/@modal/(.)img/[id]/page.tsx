import PostContent from "@/components/PostContent";
import { getSpecificPublicPost } from "@/server/use-cases/post-use-case";
import { Modal } from "./modal";

export default async function PhotoModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const specificPublicPost = await getSpecificPublicPost(id);
  const { type, ...restPost } = specificPublicPost;
  const unoptimize = (type === "image/webp" || type === "image/gif") && false;
  const postContent = { unoptimize, ...restPost };
  return (
    <Modal>
      <PostContent postContent={postContent} />
    </Modal>
  );
}
