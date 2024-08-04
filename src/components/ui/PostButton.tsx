import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

// (property) JSX.IntrinsicElements.button: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
export function PostButton({
  children,
  className,
  ...props
}: { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button
      className={cn(
        "rounded-md bg-primary px-2 py-1 text-primary-foreground",
        { "bg-muted text-foreground": pending },
        className
      )}
      type="submit"
      disabled={pending}
      {...props}
    >
      {pending ? <Loader2 className="m-auto animate-spin text-center" /> : children}
    </button>
  );
}
