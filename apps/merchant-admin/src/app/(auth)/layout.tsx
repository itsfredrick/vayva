import { PWAInstallPrompt } from "@vayva/ui";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  );
}
