import { NoImage } from "@/components/EmptyFile";
import { getMyImages } from "@/server/use-cases/images-use-cases";
import { Suspense } from "react";
import Loading from "../../loading";
import RenderImage from "../_lib/components/RenderImage";

export default async function ImagesPage() {
  const myImages = await getMyImages();
  return (
    <section className="relative flex flex-wrap gap-4">
      {myImages.length === 0 ? (
        <div className="flex size-full flex-col items-center justify-center gap-4 p-8">
          <NoImage
            title="No Image Yet"
            description="There is no Image to display this time. Try Posting to add more Image."
            href="/"
            linkDescription="Go To Home"
          />
        </div>
      ) : (
        <>
          <Suspense fallback={<Loading />}>
            <RenderImage myImages={myImages} />
          </Suspense>
        </>
      )}
    </section>
  );
}
