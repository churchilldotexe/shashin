import { getMyImages } from "@/server/use-cases/images-use-cases";
import { Suspense } from "react";
import Loading from "../../loading";
import RenderImage from "./_lib/RenderImage";

export default async function ImagesPage() {
  console.log("images page");
  const myImages = await getMyImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        <Suspense fallback={<Loading />}>
          <RenderImage myImages={myImages} />
        </Suspense>
      )}
    </section>
  );
}

// NOTE: FEAT: be able to have a view options (large, extra large, details/list) // can control with flex-basis
// add feature to delete post, image,album

// NOTE: implementation for Performant eventlistener
// [x] - instead of itteration over the images pass the Array itself to the component (client)
// [x] -  the client component will now take these array and use useEffect without dependencies for eventlistener
// [] - eventlistenr for favorites button that can run server action
// [] -  TRY : passing the fileKey as identifier then for deletion use it as a query
// [] - add DELETE button and other feature needed like View Options (transitioned)
