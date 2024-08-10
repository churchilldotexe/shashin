import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

async function animatedRouterPush() {
  document.documentElement.style.setProperty("--transition", "translateX(150%)");
  await wait(700);
}

export function usePageTransition() {
  const router = useRouter();

  useEffect(() => {
    // Reset the transition on mount
    document.documentElement.style.setProperty("--transition", "unset");
  }, []);

  const transitionedPush = (href: string) => {
    animatedRouterPush().then(() => router.push(href));
  };

  return { transitionedPush };
}
