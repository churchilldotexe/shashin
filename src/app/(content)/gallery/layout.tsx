import "@/styles/globals.css";
import GalleryNav from "./_lib/components/GalleryNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GalleryNav />
      {children}
    </>
  );
}
