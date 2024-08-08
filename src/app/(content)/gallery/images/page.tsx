import { getMyImages } from "@/server/use-cases/images-use-cases";
import Image from "next/image";
import { Suspense } from "react";
import Loading from "../../loading";
import { FavoriteButton } from "./_lib/component/FavoritesButton";

export default async function ImagesPage() {
  const myImages = await getMyImages();
  return (
    <section className="flex flex-wrap gap-4">
      {myImages.length === 0 ? (
        <div>no image yet</div>
      ) : (
        <Suspense fallback={<Loading />}>
          {myImages.map((image) => (
            <div
              key={image.fileKey}
              className="relative aspect-video flex-grow basis-full md:basis-2/3 lg:basis-1/3"
            >
              <Image
                src={image.url}
                alt={image.name}
                className="object-cover object-center "
                fill
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className="absolute top-0 right-0"
              />
            </div>
          ))}
        </Suspense>
      )}
    </section>
  );
}

// NOTE: FEAT: be able to have a view options (large, extra large, details/list) // can control with flex-basis
// add feature to delete post, image,album
