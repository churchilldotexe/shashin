export const RANGE_TO_SORT_VALUE = {
  1: "extraSmall",
  2: "small",
  3: "medium",
  4: "large",
} as const;

export const VIEW_STATUS = {
  large: "md:basis-full",
  medium: "md:basis-[33%]",
  small: "md:basis-[25%]",
  extraSmall: "md:basis-[20%]",
} as const;

export const SORT_IMAGES = {
  date: ["d-asec", "d-desc"],
  namr: ["d-asec", "d-desc"],
  createAt: ["d-asec", "d-desc"],
  type: ["d-asec", "d-desc"],
} as const;
