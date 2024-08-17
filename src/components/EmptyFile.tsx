import Image from "next/image";
import Link from "next/link";

export function NoFile({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <div className="relative aspect-video size-full">
        <Image src="/no-file.svg" alt="no file svg" fill objectFit="contain" />
      </div>
      <div className=" space-y-2">
        <h2 className="text-center font-semibold text-2xl">{title}</h2>
        <p>{description}</p>
        <Link
          href={"/"}
          className="m-auto flex w-fit items-center justify-center rounded bg-primary p-2 text-primary-foreground hocus-visible:underline "
        >
          Go to Home &rarr;
        </Link>
      </div>
    </>
  );
}

export function NoImage({
  description,
  title,
  href,
  linkDescription,
}: {
  description: string;
  title: string;
  href: string;
  linkDescription: string;
}) {
  return (
    <>
      <div className="relative aspect-video size-full">
        <Image src="/no-image.svg" alt="no file svg" fill objectFit="contain" />
      </div>
      <div className=" space-y-2">
        <h2 className="text-center font-semibold text-2xl">{title}</h2>
        <p>{description}</p>
        <Link
          href={href}
          className="m-auto flex w-fit items-center justify-center rounded bg-primary p-2 text-primary-foreground hocus-visible:underline "
        >
          {linkDescription} &rarr;
        </Link>
      </div>
    </>
  );
}
