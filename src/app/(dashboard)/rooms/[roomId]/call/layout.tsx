export default function CallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Full-screen call layout — no sidebar or topbar
  return <>{children}</>;
}
