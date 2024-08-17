export const sortMyArray = <T extends Record<string, string | string[] | Date | boolean | number>>({
  arr,
  sortReference,
  order,
}: {
  arr: T[];
  sortReference: keyof T;
  order: "ASC" | "DESC";
}) => {
  return arr.sort((a, b) => {
    const aValue = a[sortReference];
    const bValue = b[sortReference];

    if (typeof aValue === "string" && typeof bValue === "string") {
      if (order === "ASC") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return order === "ASC"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }
    return 0;
  });
};
