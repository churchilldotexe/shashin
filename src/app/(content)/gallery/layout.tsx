import "@/styles/globals.css";
import GallerySortingControls from "./_lib/components/GalleryNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GallerySortingControls />
      {children}
    </>
  );
}
