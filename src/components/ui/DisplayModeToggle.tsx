"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function DisplayModeDropDown() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="grid cursor-pointer">
      <input
        type="checkbox"
        onChange={(e) => {
          const isChecked = e.target.checked;
          isChecked ? setTheme("light") : setTheme("dark");
        }}
        checked={theme === "light"}
        className="peer/theme sr-only"
      />
      <div className=" block transition-all ease-in-out peer-checked/theme:hidden ">
        <Moon />
      </div>
      <div className=" hidden transition-all ease-in-out peer-checked/theme:block ">
        <Sun />
      </div>
    </label>
  );
}
