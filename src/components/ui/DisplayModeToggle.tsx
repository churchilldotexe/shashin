"use client";

import { cn } from "@/lib/utils";
import { type LucideProps, Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

function DisplayMode({
  mode,
  className,
  ...props
}: {
  mode?: string | undefined;
  className?: string;
  props?: LucideProps;
}) {
  switch (mode) {
    case "light":
      return <Sun className={cn("size-5", className)} {...props} />;
    case "dark":
      return <Moon className={cn("size-5", className)} {...props} />;
    case "system":
      return <SunMoon className={cn("size-5", className)} {...props} />;
  }
}

export function DisplayModeDropDown() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"dark" | "light" | "system">("system");
  const handleDropDownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div onClick={handleDropDownToggle} className="cursor-pointer">
        <DisplayMode mode={mode} />
      </div>
      {isOpen && (
        <div
          className=" absolute left-1/2 top-2 z-30 flex -translate-x-1/2 flex-col divide-y divide-muted rounded border bg-background text-secondary-foreground "
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              handleDropDownToggle();
            }
          }}
        >
          <button
            className="flex items-center gap-2 p-3 hocus-visible:bg-secondary"
            onClick={() => {
              setTheme("light");
              setMode("light");
              handleDropDownToggle();
            }}
            type="button"
          >
            <Sun className="size-4" /> Light
          </button>
          <button
            className="flex items-center gap-2 p-3 hocus-visible:bg-secondary"
            onClick={() => {
              setTheme("dark");
              setMode("dark");
              handleDropDownToggle();
            }}
            type="button"
          >
            <Moon className="size-4" /> Dark
          </button>
          <button
            className="flex items-center gap-2 p-3 hocus-visible:bg-secondary"
            onClick={() => {
              setTheme("system");
              setMode("system");
              handleDropDownToggle();
            }}
            type="button"
          >
            <SunMoon className="size-4" /> System
          </button>
        </div>
      )}
    </div>
  );
}
