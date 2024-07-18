"use client";

import { cn } from "@/lib/utils/cn";
import { type ReactNode, useState } from "react";

export function DropDown({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDropDownToggle = () => {
    setIsOpen(false);
  };

  return (
    <details
      className=" custom-overlay relative"
      open={isOpen}
      onToggle={(e) => {
        setIsOpen(e.currentTarget.open);
      }}
    >
      <div
        className={cn(
          "absolute left-[-150%] z-[1000] flex -translate-x-1/2 flex-col divide-y divide-muted rounded border bg-background text-secondary-foreground transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        {children}
      </div>
    </details>
  );
}

DropDown.Trigger = function DropdownTrigger({ children }: { children: ReactNode }) {
  return (
    <summary className="list-none">
      <div className="cursor-pointer">{children}</div>
    </summary>
  );
};
