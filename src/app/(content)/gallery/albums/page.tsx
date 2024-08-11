import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { cn } from "@/lib/utils";
import { getAllMyAlbums } from "@/server/use-cases/albums-use-cases";
import { type CSSProperties, Suspense } from "react";
import Loading from "../../loading";

export default async function AlbumsPage() {
  console.log("albums page");

  const myAlbums = await getAllMyAlbums();
  return (
    <PageSection className="space-y-4 p-4">
      <Suspense fallback={<Loading />}>
        {myAlbums.length === 0 ? (
          <div>no album yet</div>
        ) : (
          myAlbums.map((album, index) => {
            return (
              <article
                className={cn(
                  "fade-in-image w-full space-y-2 rounded-lg border bg-background p-3 text-foreground shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] md:p-6 dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black]"
                )}
                key={album.albumName}
                style={{ "--i": `${index}` } as CSSProperties}
              >
                <header className="w-full">
                  <h1 className=" text-center font-semibold text-3xl capitalize">
                    {album.albumName}
                  </h1>
                </header>
                <figure>
                  <figcaption className="sr-only">{`images for album: ${album.albumName}`}</figcaption>
                  <ImageSlider url={album.url} />
                </figure>
              </article>
            );
          })
        )}
      </Suspense>
    </PageSection>
  );
}

// NOTE: will show show all the albums with slider of the images (maybe dont include the post? since when it is added in the albums only the images will be referenced and not the post)
// it will not render the post but when the user click the image it will appear a "go to post" LINK
// ---> how it will work is another popup(through link state (getting the imageId) and above have two links where go to post and go back(back one history stack))
