"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ElementRef, type MouseEvent, type SyntheticEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

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
    //biome-ignore lint/a11y/useKeyWithClickEvents: <dialog Default handles keypress>
    <dialog
      ref={dialogRef}
      className="modal-transition w-full bg-transparent shadow-[0_8px_6px_0_rgba(0,0,0,0.37),-6px_-4px_10px_white] backdrop:backdrop-blur-[3px] lg:w-[85%] dark:shadow-[0_8px_6px_0_rgba(255,255,255,0.1),-6px_-4px_10px_black] "
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
        className="absolute top-0 left-0 rounded-sm bg-primary font-bold "
        type="button"
      >
        <XIcon className="size-4 md:size-auto" />
      </button>
    </dialog>
  );
}
