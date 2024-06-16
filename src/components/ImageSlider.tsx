"use client";

import { Circle } from "lucide-react";
import Image from "next/image";
import { useState, Fragment } from "react";

export function ImageSlider({ url }: { url: string[] }) {
  // TODO: make it more beautiful.. focus on designing the front page first(for signed in and welcome page(for unsigned in))
  const [imageIndex, setImageIndex] = useState<number>(0);
  const handleNextImage = () => {
    if (imageIndex === url.length - 1) {
      setImageIndex(url.length - 1);
    } else {
      setImageIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handlePreviousImage = () => {
    if (imageIndex === 0) {
      setImageIndex(0);
    } else {
      setImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="relative size-full">
      <div className="absolute top-1/2 z-10 flex w-full justify-between text-gray-950">
        <button onClick={handlePreviousImage} type="button">
          &lt;
        </button>
        <button className="" onClick={handleNextImage} type="button">
          &gt;
        </button>
      </div>

      <div className="flex size-full overflow-hidden">
        {url.map((image) => (
          <Fragment key={image}>
            <div className="relative aspect-video size-full shrink-0  ">
              <Image
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 100vw"
                src={image}
                alt={image}
                style={{ translate: `${-100 * imageIndex}%` }}
                className="size-full object-cover object-center transition-all duration-300 ease-linear "
                fill
              />
            </div>
          </Fragment>
        ))}
      </div>

      <div className="absolute bottom-0 flex w-full items-center justify-center gap-4 py-4 ">
        {url.map((_, index) => (
          // NOTE: fix the Key attribute later to a database data ID
          <button
            type="button"
            key={index}
            className="text-red-500 data-[index=true]:text-sky-500"
            data-index={Boolean(imageIndex === index)}
            onClick={() => {
              setImageIndex(index);
            }}
            aria-label={`button for image number ${index + 1}`}
          >
            <Circle className="size-2" fill={Boolean(imageIndex === index) ? "blue" : "red"} />
          </button>
        ))}
      </div>
    </div>
  );
}
