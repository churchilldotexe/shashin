"use client";

import { PageSection } from "@/components/PageSection";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <PageSection className=" flex min-h-[100dvh] w-full flex-col items-center justify-center gap-4 p-2 ">
      <div className="relative aspect-video size-2/3">
        <Image src="/not-found.svg" alt="no file svg" fill objectFit="contain" />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 ">
        <h1 className="text-center font-semibold text-2xl text-primary capitalize">
          Page Not Found
        </h1>
        <p className="text-center text-muted-foreground">
          We can't find that page. Please go back to Home
        </p>
        <div className="flex items-center justify-between gap-8">
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
