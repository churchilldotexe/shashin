import Link from "next/link";
import type { CSSProperties } from "react";

export default function GalleryPage() {
  return (
    <div>
      <Link href={"/img/1"} passHref>
        <div style={{ "--i": "1" } as CSSProperties} className="fade-in-image">
          GalleryPage 1
        </div>
      </Link>
      <Link href={"/img/2"}>
        <div style={{ "--i": "2" } as CSSProperties} className="fade-in-image">
          GalleryPage 2
        </div>
      </Link>
      <Link href={"/img/3"}>
        <div style={{ "--i": "3" } as CSSProperties} className="fade-in-image">
          GalleryPage 3
        </div>
      </Link>
      <Link href={"/img/4"}>
        <div style={{ "--i": "4" } as CSSProperties} className="fade-in-image">
          GalleryPage 4
        </div>
      </Link>
      <Link href={"/img/5"}>
        <div style={{ "--i": "5" } as CSSProperties} className="fade-in-image">
          GalleryPage 5
        </div>
      </Link>
      <Link href={"/img/5"}>
        <div style={{ "--i": "6" } as CSSProperties} className="fade-in-image">
          GalleryPage 6
        </div>
      </Link>

      <div id="imANode" />
    </div>
  );
}

// NOTE: will show here all the stats of with a clickable that will direct them to albums, images, favorites
// stats includes: Counts , rate of posts(eg like a graph for the amount of the post in the past month/weeks)
// Or rewrite// will redirect to albums
