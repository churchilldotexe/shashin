import { useRouter } from "next/navigation";
import { type ElementRef, useRef, useTransition } from "react";
import { useEffect } from "react";

export function useTransitionedServerAction<T extends Promise<void>>() {
  const [isPending, startTransition] = useTransition();

  const startServerTransition = (fn: T, optionalFn?: () => void) => {
    startTransition(async () => {
      await fn;
      optionalFn;
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

export function useDropDownControls() {
  const detailsRef = useRef<ElementRef<"details">>(null);

  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      "mousedown",
      (event: MouseEvent) => {
        if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
          detailsRef.current.open = false;
        }
      },
      {
        signal: abortController.signal,
      }
    );

    document.addEventListener(
      "keydown",
      (event: KeyboardEvent) => {
        if (detailsRef.current) {
          if (event.key === "Escape" && detailsRef.current.open) {
            detailsRef.current.open = false;
          }
        }
      },
      {
        signal: abortController.signal,
      }
    );

    return () => {
      abortController.abort();
    };
  }, []);

  const closeDropdown = () => {
    if (detailsRef.current === null) {
      return;
    }
    detailsRef.current.open = false;
  };

  return { detailsRef, closeDropdown };
}
