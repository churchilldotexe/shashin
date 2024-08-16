import "@/styles/globals.css";
import GallerySortingControls from "./_lib/components/GalleryNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 py-4">
      <GallerySortingControls />
      {children}
    </div>
  );
}
