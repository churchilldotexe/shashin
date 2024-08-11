import { Star } from "lucide-react";
import Image from "next/image";
import { FavoriteButton } from "../../_lib/components/FavoriteButton";

type myImages = {
  id: string;
  name: string;
  url: string;
  fileKey: string;
  isFavorited: boolean;
};

type RenderImageProps = {
  myImages: myImages[];
};

export default function RenderImage({ myImages }: RenderImageProps) {
  return (
    <>
      {myImages.map((image) => {
        const favoriteStatustus = image.isFavorited ? "favorited" : "unfavorited";
        return (
          <figure key={image.fileKey} className="flex-grow basis-full md:basis-2/3 lg:basis-1/3 ">
            <figcaption className="sr-only">{image.name}</figcaption>
            <div key={image.fileKey} className="relative aspect-video ">
              <Image
                src={image.url}
                alt={image.name}
                className="object-cover object-center "
                fill
              />
              <FavoriteButton
                isFavorited={image.isFavorited}
                imageId={image.id}
                className="mydiv absolute top-0 right-0"
                data-key={image.fileKey}
                data-is-favorited={favoriteStatustus}
              />
            </div>
          </figure>
        );
      })}
    </>
  );
}
