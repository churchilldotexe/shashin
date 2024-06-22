"use client";

import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Image from "next/image";
import { useState, Fragment } from "react";

// FIX: url should be able to receive 1 or more items
// -- returning from DRIZZLE is an array
export function ImageSlider({ url }: { url: string[] }) {
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
      <div className="group absolute inset-0 z-10 flex size-full items-center justify-between text-gray-950">
        <button
          onClick={handlePreviousImage}
          type="button"
          data-hidden={imageIndex === 0}
          className="mx-2 rounded bg-gradient-to-r from-secondary/70 to-secondary/0 py-4 text-primary opacity-0 shadow-[0_8px_6px_0_rgba(0,0,0,0.8)] backdrop-blur-sm active:scale-90 group-hover:z-10 group-hover:opacity-100 group-focus-visible:z-10 group-focus-visible:opacity-100 data-[hidden=true]:cursor-default data-[hidden=true]:opacity-0 data-[hidden=true]:group-hover:opacity-0 data-[hidden=true]:group-focus-visible:opacity-0"
        >
          <ChevronLeft className="size-8" />
        </button>
        <button
          onClick={handleNextImage}
          type="button"
          data-hidden={imageIndex === url.length - 1}
          className="mx-2 rounded bg-gradient-to-l from-secondary/70 to-secondary/0 py-4 text-primary opacity-0 shadow-[0_8px_6px_0_rgba(0,0,0,0.8)] backdrop-blur-sm active:scale-90 group-hover:z-10 group-hover:opacity-100 group-focus-visible:z-10 group-focus-visible:opacity-100 data-[hidden=true]:cursor-default data-[hidden=true]:opacity-0 data-[hidden=true]:group-hover:opacity-0 data-[hidden=true]:group-focus-visible:opacity-0"
        >
          <ChevronRight className="size-8 " />
        </button>
      </div>

      <div className="flex size-full overflow-hidden">
        {url.map((image) => (
          <Fragment key={image}>
            <div className="relative aspect-video size-full shrink-0 ">
              <Image
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 100vw"
                src={image}
                alt={image}
                style={{ translate: `${-100 * imageIndex}%` }}
                className="size-full rounded-lg object-contain object-center transition-all duration-300 ease-linear "
                fill
              />
            </div>
          </Fragment>
        ))}
      </div>

      {Boolean(url.length > 1) && (
        <div className="absolute bottom-0 my-4 flex w-full items-center justify-center gap-4 ">
          {url.map((_, index) => (
            // NOTE: fix the Key attribute later to a database data ID
            <button
              type="button"
              key={index}
              className="z-20 text-secondary data-[index=true]:text-primary"
              data-index={Boolean(imageIndex === index)}
              onClick={() => {
                setImageIndex(index);
              }}
              aria-label={`button for image number ${index + 1}`}
            >
              <Circle className="size-2 fill-current md:size-3" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
