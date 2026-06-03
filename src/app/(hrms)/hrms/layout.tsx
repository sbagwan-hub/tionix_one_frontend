export default function HrmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-[calc(100dvh-10.5rem)] overflow-y-auto overscroll-y-contain">{children}</div>
  );
}
