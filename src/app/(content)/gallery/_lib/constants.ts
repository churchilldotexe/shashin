export const RANGE_TO_SORT_VALUE = {
  1: "extraSmall",
  2: "small",
  3: "medium",
  4: "large",
} as const;
export type RangeToSortKeyType = keyof typeof RANGE_TO_SORT_VALUE;

export const VIEW_STATUS = {
  large: "md:basis-full",
  medium: "md:basis-[33%]",
  small: "md:basis-[25%]",
  extraSmall: "md:basis-[20%]",
} as const;
export type SortStatusKeysTypes = keyof typeof VIEW_STATUS;

export const SORT_PROPERTIES = ["updatedAt", "name", "createdAt"] as const;
export type SortPropertiesTypes = (typeof SORT_PROPERTIES)[number];

export const SORT_OPTIONS = ["DESC", "ASC"] as const;
export type SortOptionsTypes = (typeof SORT_OPTIONS)[number];
