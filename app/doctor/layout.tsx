
import { Header } from "./dashboard/header";
import { Sidebar } from "./dashboard/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Dr. Jane Smith",
    email: "jane.smith@mindguard.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:flex md:w-64 md:flex-col" />
      <div className="flex flex-col flex-1">
        <Header user={user} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}