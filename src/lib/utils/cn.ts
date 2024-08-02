import { type ClassValue, clsx } from "clsx";
import router from "next/router";
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
