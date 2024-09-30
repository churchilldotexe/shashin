import { PageSection } from "@/components/PageSection";

export default function Loading() {
  return (
    <PageSection className="flex min-h-[100dvh] items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="300"
        height="300"
        aria-labelledby="loadingTitle loadingDesc"
        role="img"
      >
        <title id="loadingTitle">Loading animation</title>
        <desc id="loadingDesc">An animated logo indicating that content is loading</desc>
        <path
          className="path"
          d="M 40 23 a 0 0 0 0 0 0 -3 h -25 v 40 h 25 a 0 0 0 0 0 0 -3 h -20 v -20 h 16 a 0 0 0 0 0 0 -3 h -16 v -11 z"
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
        />
        <path
          className="path"
          d="M 60 23 a 0 0 0 0 0 0 -3 h 25 v 40 h -25 a 0 0 0 0 0 0 -3 h 20 v -20 h -16 a 0 0 0 0 0 0 -3 h 16 v -11 z"
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
        />
        <path
          className="path"
          d="M 34 10 l 35 60 a 0 0 0 0 0 -3 0 l -35 -60 z"
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
        />
        <path
          className="path"
          d="M 66 10 l -35 60 a 0 0 0 0 0 3 0 l 35 -60 z"
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
        />
      </svg>
    </PageSection>
  );
}
