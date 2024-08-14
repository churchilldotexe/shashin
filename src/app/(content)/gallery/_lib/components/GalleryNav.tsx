"use client";

import { cn } from "@/lib/utils";
import {
  ALargeSmall,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  CalendarClock,
  CalendarDays,
} from "lucide-react";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { type ChangeEvent, useState } from "react";
import {
  RANGE_TO_SORT_VALUE,
  type RangeToSortKeyType,
  type SortOptionsTypes,
  type SortPropertiesTypes,
} from "../constants";

type GetGalleryUrlType = {
  sortValue?: SortPropertiesTypes;
  sortOptions?: SortOptionsTypes;
  viewValue?: RangeToSortKeyType;
  searchParams: ReadonlyURLSearchParams;
};

const getGalleryUrl = ({ sortOptions, viewValue, sortValue, searchParams }: GetGalleryUrlType) => {
  const params = new URLSearchParams(searchParams.toString());
  if (viewValue) {
    params.set("view", RANGE_TO_SORT_VALUE[viewValue]);
    window.history.pushState(null, "", `?${params.toString()}`);
  }
  if (sortValue) {
    params.set("sort", sortValue.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  }
  if (sortOptions) {
    params.set("option", sortOptions.toString());
    window.history.pushState(null, "", `?${params.toString()}`);
  }

  return params.toString();
};

export default function GalleryNav() {
  // for indicator render //large,small,
  const [rangeValue, setRangeValue] = useState<RangeToSortKeyType>(3);
  const searchParams = useSearchParams();

  const handleSortValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value as SortPropertiesTypes) {
      case "name":
        getGalleryUrl({ searchParams, sortValue: "name" });
        break;
      case "createdAt":
        getGalleryUrl({ searchParams, sortValue: "createdAt" });
        break;
      case "updatedAt":
        getGalleryUrl({ searchParams, sortValue: "updatedAt" });
        break;
      default:
        return;
    }
  };

  return (
    <nav className="sticky top-0 z-10 p-4">
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
          getGalleryUrl({ viewValue: newRangeValue, searchParams });
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
          "-mt-3 w-full rounded-lg p-4 shadow-elevate-light backdrop-blur dark:shadow-elevate-dark",
          "css-border-animateInline"
        )}
      />
      <ul className="flex items-center gap-4">
        <li>
          <label>
            <input
              type="radio"
              name="sort"
              className="peer/created sr-only"
              defaultChecked={true}
              value="createdAt"
              onChange={(e) => {
                handleSortValueChange(e);
              }}
            />
            <CalendarDays className="peer-checked/created:border" />
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name="sort"
              className="peer/updated sr-only"
              value="updatedAt"
              onChange={(e) => {
                handleSortValueChange(e);
              }}
            />
            <CalendarClock className="peer-checked/udpated:border" />
          </label>
        </li>
        <li>
          <label>
            <input
              type="radio"
              name="sort"
              value="name"
              className="peer/name sr-only"
              onChange={(e) => {
                handleSortValueChange(e);
              }}
            />
            <ALargeSmall className="peer-checked/name:border" />
          </label>
        </li>
      </ul>
      <fieldset>
        <label>
          <input
            type="checkbox"
            className="peer/sort sr-only"
            onChange={(e) => {
              if (e.target.checked) {
                getGalleryUrl({ searchParams, sortOptions: "ASC" });
              } else {
                getGalleryUrl({ searchParams, sortOptions: "DESC" });
              }
            }}
          />
          <ArrowDownNarrowWide className="peer-checked/sort:hidden " />
          <ArrowUpWideNarrow className="hidden peer-checked/sort:block " />
        </label>
      </fieldset>
    </nav>
  );
}
