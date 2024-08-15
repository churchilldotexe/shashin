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

// NOTE: FEAT: be able to have a view options (large, extra large, details/list) // can control with flex-basis
// add feature to delete post, image,album

// NOTE: implementation for Performant eventlistener
// [x] - instead of itteration over the images pass the Array itself to the component (client)
// [x] -  the client component will now take these array and use useEffect without dependencies for eventlistener
// [] - add DELETE button and other feature needed like View Options (transitioned)
