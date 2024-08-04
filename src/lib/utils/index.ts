import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function animatedRouterPush() {
  document.documentElement.style.setProperty("--transition", "translateX(150%)");
  await wait(700);
  document.documentElement.style.setProperty("--transition", "unset");
}

export function createTooltipClasses(
  content: "hover:after:content-['content_here']" | (string & {})
) {
  return [
    // Positioning and visibility
    "relative hover:after:absolute hover:after:top-[105%] hover:after:left-1/2 hover:after:-translate-x-1/2",
    "after:opacity-0 hover:after:opacity-100",

    // Tooltip content styling
    "hover:after:whitespace-nowrap hover:after:rounded-md",
    "hover:after:bg-secondary hover:after:p-1 hover:after:text-secondary-foreground",
    " hover:after:shadow-[0_8px_6px_0_rgba(0,0,0,.37),-6px_-4px_10px_white] dark:hover:after:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] hover:after:transition-opacity hover:after:delay-500",
    "hover:after:content-[--tooltip-content]",
    content,

    // Tooltip arrow
    "hover:before:absolute hover:before:left-1/2 hover:before:-translate-x-1/2 hover:before:-bottom-1",
    "before:opacity-0 hover:before:opacity-100",
    "hover:before:size-4",
    "hover:before:border-8 hover:before:border-transparent hover:before:border-b-secondary",
    "hover:before:transition-opacity hover:before:delay-500",
    "hover:before:content-['_']",
  ];
}
