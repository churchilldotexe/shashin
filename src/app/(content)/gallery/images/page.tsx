import { getMyImages } from "@/server/data-access/imagesQueries";
import Image from "next/image";

export default async function ImagesPage() {
  const myImages = await getMyImages();
  console.log(myImages);
  return (
    <section>
      {myImages?.map((image) => (
        <div key={image.url + 1} className="relative aspect-video size-full ">
          <Image
            src={image.url}
            className="size-full rounded-lg object-contain object-center transition-all duration-300 ease-linear "
            alt={`${image.url}  image`}
            fill
          />
        </div>
      ))}
    </section>
  );
}

// NOTE: show all the images regardless of the albums BUT must only show per User ==> integrate to user,
// FEAT: be able to have a view options (large, extra large, details/list)
