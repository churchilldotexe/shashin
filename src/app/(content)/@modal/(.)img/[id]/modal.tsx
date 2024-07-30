"use client";

import { useRouter } from "next/navigation";
import { type ElementRef, type MouseEvent, type SyntheticEvent, useEffect, useRef } from "react";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss(e: MouseEvent<HTMLButtonElement> | SyntheticEvent<HTMLDialogElement>) {
    router.back();
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <dialog Default handles keypress>
    <dialog
      ref={dialogRef}
      className="size-fit"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          router.back();
        }
      }}
      onClose={(e) => {
        onDismiss(e);
      }}
    >
      {children}
      <button
        onClick={(e) => {
          onDismiss(e);
        }}
        className="size-fit bg-primary"
        type="button"
      >
        X
      </button>
    </dialog>
  );
}
