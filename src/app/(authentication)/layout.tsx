export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container" id="auth-layout">
      {children}
    </main>
  );
}
