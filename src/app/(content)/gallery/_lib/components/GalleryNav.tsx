"use client";

import { cn } from "@/lib/utils";
import {
  type ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";
import { RANGE_TO_SORT_VALUE } from "../constants";

type RangeToSortKeyType = keyof typeof RANGE_TO_SORT_VALUE;

const galleryUrl = ({
  viewValue,
  sortValue,
  searchParams,
}: {
  sortValue?: string;
  viewValue?: RangeToSortKeyType;
  searchParams: ReadonlyURLSearchParams;
}) => {
  const params = new URLSearchParams(searchParams.toString());
  if (viewValue) {
    params.set("view", RANGE_TO_SORT_VALUE[viewValue]);
    window.history.pushState(null, "", `?${params.toString()}`);
  }
  if (sortValue) {
    params.set("sort", sortValue.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  return params.toString();
};

export default function GalleryNav() {
  // for indicator render //large,small,
  const [rangeValue, setRangeValue] = useState<RangeToSortKeyType>(3);
  const searchParams = useSearchParams();

  return (
    <div className=" sticky top-0 z-10 p-4">
      <input
        type="range"
        min="1"
        max="4"
        step="1"
        className="w-full bg-primary "
        value={rangeValue}
        list="view-value"
        onChange={(e) => {
          const newRangeValue = Number(e.target.value) as RangeToSortKeyType;
          setRangeValue(newRangeValue);
          galleryUrl({ viewValue: newRangeValue, searchParams });
        }}
      />
      <datalist id="view-value">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </datalist>
      <div
        className={cn(
          "-mt-3 hidden w-full rounded-lg p-4 shadow-elevate-light backdrop-blur dark:shadow-elevate-dark",
          "css-border-animateInline"
        )}
      />
    </div>
  );
}
