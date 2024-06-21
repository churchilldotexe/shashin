"use client";

import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <div>
      <button
        onClick={() => {
          setTheme("light");
        }}
        type="button"
      >
        Light
      </button>
      <button
        onClick={() => {
          setTheme("dark");
        }}
        type="button"
      >
        Dark
      </button>
      <button
        onClick={() => {
          setTheme("system");
        }}
        type="button"
      >
        system
      </button>
    </div>
  );
}
