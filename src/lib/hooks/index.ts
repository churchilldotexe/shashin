import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useEffect } from "react";

export function useTransitionedServerAction<T extends Promise<void>>() {
  const [isPending, startTransition] = useTransition();

  const startServerTransition = (fn: T) => {
    startTransition(async () => {
      await fn;
    });
  };

  return { isPending, startServerTransition };
}

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
