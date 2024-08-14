"use client";

import { type ChangeEvent, type ComponentProps, type ReactNode, useState } from "react";

type SortToggleProps = ComponentProps<"li"> & {
  onToggle: string;
  onUnToggle: string;
  CheckedChildren: ReactNode;
  UnCheckedChildren: ReactNode;
  initialChecked: boolean;
};

// FIX:  make this a COMPOUNT COMPONENT

const SortToggle = ({
  onToggle,
  onUnToggle,
  CheckedChildren,
  UnCheckedChildren,
  initialChecked = false,
}: SortToggleProps) => {
  const [isChecked, setIsChecked] = useState(initialChecked);

  const handleClick = (e: ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = e.target.checked;
    setIsChecked(newCheckedState);
    if (newCheckedState) {
      onToggle;
    } else {
      onUnToggle;
    }
  };

  return (
    <li>
      <input
        className="peer/in"
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {
          handleClick(e);
        }}
      />
      <div className="peer-checked/in:hidden">{CheckedChildren}</div>
      <div className="hidden peer-checked/in:block">{UnCheckedChildren}</div>
    </li>
  );
};

export default SortToggle;
