import AuthHeader from "./_lib/components/AuthHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container grid grid-rows-[auto_1fr]">
      <div>
        <AuthHeader />
      </div>
      {children}
    </main>
  );
}
