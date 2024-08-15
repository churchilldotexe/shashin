"use client";

import { cn, createTooltipClasses } from "@/lib/utils";
import {
  ALargeSmall,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  CalendarClock,
  CalendarDays,
} from "lucide-react";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useState } from "react";
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

const updatedGalleryUrlParams = ({
  sortOptions,
  viewValue,
  sortValue,
  searchParams,
}: GetGalleryUrlType) => {
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

function SortOptions({
  handleSortChange,
  isDefaultChecked = false,
  children,
  tooltipContent,
}: {
  handleSortChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDefaultChecked?: boolean;
  children: ReactNode;
  tooltipContent: "hover:after:content-['content_here']" | (string & {});
}) {
  return (
    <li>
      <label className="cursor-pointer">
        <input
          type="radio"
          name="sort"
          className="peer/created sr-only"
          defaultChecked={isDefaultChecked}
          value="createdAt"
          onChange={(e) => {
            handleSortChange(e);
          }}
        />
        <div
          className={cn(
            "transition-all peer-checked/created:scale-105 peer-checked/created:border peer-checked/created:shadow-elevate-light peer-checked/created:backdrop-blur-lg peer-checked/created:dark:shadow-elevate-dark",
            createTooltipClasses(tooltipContent)
          )}
        >
          {children}
        </div>
      </label>
    </li>
  );
}

export default function GallerySortingControls() {
  // for indicator render //large,small,
  const [rangeValue, setRangeValue] = useState<RangeToSortKeyType>(3);
  const searchParams = useSearchParams();

  const handleSortValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value as SortPropertiesTypes) {
      case "name":
        updatedGalleryUrlParams({ searchParams, sortValue: "name" });
        break;
      case "createdAt":
        updatedGalleryUrlParams({ searchParams, sortValue: "createdAt" });
        break;
      case "updatedAt":
        updatedGalleryUrlParams({ searchParams, sortValue: "updatedAt" });
        break;
      default:
        return;
    }
  };

  return (
    <nav className="-mt-3 top-0 z-10 my-4 flex w-full items-center justify-center rounded-lg p-4 shadow-elevate-light backdrop-blur md:sticky md:my-0 dark:shadow-elevate-dark ">
      <input
        type="range"
        min="1"
        max="4"
        step="1"
        className="hidden w-full bg-primary md:block"
        value={rangeValue}
        list="view-value"
        onChange={(e) => {
          const newRangeValue = Number(e.target.value) as RangeToSortKeyType;
          setRangeValue(newRangeValue);
          updatedGalleryUrlParams({ viewValue: newRangeValue, searchParams });
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
          "-mt-3 hidden w-full rounded-lg p-4 shadow-elevate-light backdrop-blur dark:shadow-elevate-dark"
        )}
      />
      <ul className="flex items-center gap-4">
        <SortOptions
          tooltipContent="hover:after:content-['Sort_By_Creation_Date']"
          isDefaultChecked={true}
          handleSortChange={handleSortValueChange}
        >
          <CalendarDays />
        </SortOptions>

        <SortOptions
          handleSortChange={handleSortValueChange}
          tooltipContent="hover:after:content-['Sort_By_Last_Update']"
        >
          <CalendarClock />
        </SortOptions>

        <SortOptions
          handleSortChange={handleSortValueChange}
          tooltipContent="hover:after:content-['Sort_By_Name']"
        >
          <ALargeSmall />
        </SortOptions>
      </ul>
      <fieldset>
        <label className={cn("cursor-pointer")}>
          <input
            type="checkbox"
            className="peer/sort sr-only"
            onChange={(e) => {
              if (e.target.checked) {
                updatedGalleryUrlParams({ searchParams, sortOptions: "ASC" });
              } else {
                updatedGalleryUrlParams({ searchParams, sortOptions: "DESC" });
              }
            }}
          />

          <div
            className={cn(
              "peer-checked/sort:hidden ",
              createTooltipClasses("hover:after:content-['Descending']")
            )}
            aria-label="Sort Descending"
          >
            <ArrowDownNarrowWide />
          </div>

          <div
            className={cn(
              "hidden peer-checked/sort:block ",

              createTooltipClasses("hover:after:content-['Ascending']")
            )}
            aria-label="Sort Ascending "
          >
            <ArrowUpWideNarrow />
          </div>
        </label>
      </fieldset>
    </nav>
  );
}
