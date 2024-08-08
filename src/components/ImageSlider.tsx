"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import Image from "next/image";
import { Fragment, type HTMLAttributes, type MouseEvent, forwardRef, useState } from "react";

export const ImageSlider = forwardRef<
  HTMLDivElement,
  {
    url: string[];
    unoptimized?: boolean;
  } & HTMLAttributes<HTMLDivElement>
>(function Slider({ url, unoptimized = false, className, ...props }, ref) {
  const [imageIndex, setImageIndex] = useState<number>(0);
  const handleNextImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (imageIndex === url.length - 1) {
      setImageIndex(url.length - 1);
    } else {
      setImageIndex((prevIndex) => prevIndex + 1);
    }
  };
  const handlePreviousImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (imageIndex === 0) {
      setImageIndex(0);
    } else {
      setImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div ref={ref} className={cn("relative size-full", className)} {...props}>
      <div className="flex size-full overflow-hidden">
        {url.map((image) => (
          <Fragment key={image}>
            <div className="relative aspect-video size-full shrink-0 ">
              <Image
                unoptimized={unoptimized}
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

      <div className="group absolute inset-0 flex size-full items-center justify-between ">
        <button
          onClick={(e) => {
            handlePreviousImage(e);
          }}
          type="button"
          data-hidden={imageIndex === 0}
          className="height-full mx-2 rounded bg-gradient-to-r from-secondary/70 to-secondary/0 py-4 text-primary opacity-100 shadow-[0_8px_6px_0_rgba(0,0,0,0.8)] backdrop-blur-sm active:scale-90 group-hover:opacity-100 group-focus-visible:opacity-100 data-[hidden=true]:cursor-default data-[hidden=true]:opacity-0 data-[hidden=true]:group-focus-visible:opacity-0 data-[hidden=true]:group-hover:opacity-0 md:opacity-0"
        >
          <ChevronLeft className="size-8" />
        </button>
        <button
          onClick={(e) => {
            handleNextImage(e);
          }}
          type="button"
          data-hidden={imageIndex === url.length - 1}
          className="height-full mx-2 rounded bg-gradient-to-l from-secondary/70 to-secondary/0 py-4 text-primary opacity-100 shadow-[0_8px_6px_0_rgba(0,0,0,0.8)] backdrop-blur-sm active:scale-90 group-hover:opacity-100 group-focus-visible:opacity-100 data-[hidden=true]:cursor-default data-[hidden=true]:opacity-0 data-[hidden=true]:group-focus-visible:opacity-0 data-[hidden=true]:group-hover:opacity-0 md:opacity-0"
        >
          <ChevronRight className="size-8 " />
        </button>
      </div>

      {Boolean(url.length > 1) && (
        <div className="absolute bottom-0 my-4 flex w-full items-center justify-center gap-4 ">
          {url.map((urlInfo, index) => (
            // NOTE: fix the Key attribute later to a database data ID
            <button
              type="button"
              key={urlInfo}
              className=" text-foreground data-[index=true]:text-primary"
              data-index={Boolean(imageIndex === index)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
});
