import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SideNav } from "@/components/patient/side-nav";
import { TopNav } from "@/components/patient/top-nav";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <TopNav />
        <div className="flex flex-1">
          <SideNav />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}