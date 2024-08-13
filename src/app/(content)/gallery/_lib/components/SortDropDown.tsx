import { EllipsisVertical } from "lucide-react";
import type { ComponentProps, Dispatch, SetStateAction } from "react";
import type { SORT_STATUS } from "../constants";

export type SortStatusTypes = keyof typeof SORT_STATUS;

export function SortDropDown({
  setSortValue,
  ...props
}: {
  setSortValue: Dispatch<SetStateAction<SortStatusTypes>>;
} & ComponentProps<"details">) {
  return (
    <details {...props}>
      <summary>
        <EllipsisVertical />
      </summary>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => {
            setSortValue("large");
          }}
        >
          Large
        </button>
        <button
          type="button"
          onClick={() => {
            setSortValue("medium");
          }}
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => {
            setSortValue("small");
          }}
        >
          Small
        </button>
        <button
          type="button"
          onClick={() => {
            setSortValue("extraSmall");
          }}
        >
          Extra Small
        </button>
      </div>
    </details>
  );
}
