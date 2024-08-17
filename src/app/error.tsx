"use client"; // Error components must be Client Components

import { PageSection } from "@/components/PageSection";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <PageSection className=" flex min-h-[100dvh] w-full flex-col items-center justify-center gap-4 p-2 ">
      <div className="relative aspect-video size-2/3">
        <Image src="/error.svg" alt="no file svg" fill objectFit="contain" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 ">
        <h1 className="text-primary">An error Occured</h1>
        <h2 className="text-center font-semibold text-2xl capitalize">{error.message}</h2>
        <p className="text-center text-muted-foreground">
          Please Try again later or contact support if the problem persist
        </p>
        <div className="flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="m-auto flex w-fit items-center justify-center rounded bg-primary p-2 text-primary-foreground hocus-visible:underline "
          >
            Try again
          </button>
          <Link
            href={"/"}
            className="m-auto flex w-fit items-center justify-center rounded bg-muted p-2 text-primary-foreground hocus-visible:underline "
          >
            Go Back Home &rarr;
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
