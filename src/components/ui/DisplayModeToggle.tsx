"use client";

import { cn } from "@/lib/utils/cn";
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

  const handleDropDownToggle = (newMode: "dark" | "light" | "system") => {
    setIsOpen(false);
    setTheme(newMode);
    setMode(newMode);
  };

  return (
    <details
      className="custom-overlay relative bg-background"
      open={isOpen}
      onToggle={(e) => {
        setIsOpen(e.currentTarget.open);
      }}
    >
      <summary className="list-none">
        <div className="cursor-pointer">
          <DisplayMode mode={mode} />
        </div>
      </summary>
      <div
        className={cn(
          " -translate-x-1/2 absolute left-[-150%] z-[1000] flex flex-col divide-y divide-muted rounded border bg-background text-secondary-foreground transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        <button
          className="flex items-center gap-2 hocus-visible:bg-secondary p-3"
          onClick={() => {
            handleDropDownToggle("light");
          }}
          type="button"
        >
          <Sun className="size-4" /> Light
        </button>
        <button
          className="flex items-center gap-2 hocus-visible:bg-secondary p-3"
          onClick={() => {
            handleDropDownToggle("dark");
          }}
          type="button"
        >
          <Moon className="size-4" /> Dark
        </button>
        <button
          className="flex items-center gap-2 hocus-visible:bg-secondary p-3"
          onClick={() => {
            handleDropDownToggle("system");
          }}
          type="button"
        >
          <SunMoon className="size-4" /> System
        </button>
      </div>
    </details>
  );
}
