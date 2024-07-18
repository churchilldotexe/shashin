"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
} from "react";

type DialogContextTypes = {
  dialogRef: RefObject<HTMLDialogElement>;
  dialogToggle: () => void;
};

const DialogContext = createContext<DialogContextTypes | null>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("this Component must be a children of Dialog");
  }

  return context;
};

export default function Dialog({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const dialogToggle = () => {
    if (dialogRef.current === null) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };
  return (
    <DialogContext.Provider value={{ dialogToggle, dialogRef }}>{children}</DialogContext.Provider>
  );
}

type DialogContentTypes = {
  children: ReactNode;
} & HTMLAttributes<HTMLDialogElement>;

Dialog.Content = function DialogContent({ children, ...props }: DialogContentTypes) {
  const { dialogToggle, dialogRef } = useDialogContext();
  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          dialogToggle();
        }
      }}
      {...props}
    >
      {children}
    </dialog>
  );
};

type DialogTriggerTypes = {
  children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>;

Dialog.Trigger = function DialogTrigger({ children, ...props }: DialogTriggerTypes) {
  const { dialogToggle } = useDialogContext();
  return (
    <button
      onClick={() => {
        dialogToggle();
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
