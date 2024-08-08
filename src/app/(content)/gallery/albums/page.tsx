import { ImageSlider } from "@/components/ImageSlider";
import { PageSection } from "@/components/PageSection";
import { getAllMyAlbums } from "@/server/use-cases/albums-use-cases";

export default async function AlbumsPage() {
  const myAlbums = await getAllMyAlbums();
  return (
    <PageSection>
      {myAlbums.length === 0 ? (
        <div>no album yet</div>
      ) : (
        myAlbums.map((album, index) => {
          return (
            <article key={album.albumName}>
              <header>{album.albumName}</header>
              <figure>
                <figcaption className="sr-only">{`images for album: ${album.albumName}`}</figcaption>
                <ImageSlider url={album.url} />
              </figure>
            </article>
          );
        })
      )}
    </PageSection>
  );
}

// NOTE: will show show all the albums with slider of the images (maybe dont include the post? since when it is added in the albums only the images will be referenced and not the post)
// it will not render the post but when the user click the image it will appear a "go to post" LINK
// ---> how it will work is another popup(through link state (getting the imageId) and above have two links where go to post and go back(back one history stack))
