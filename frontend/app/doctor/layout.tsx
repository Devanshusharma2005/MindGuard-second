"use client";

import { useState } from "react";
import { Header } from "./dashboard/header";
import { Sidebar } from "./dashboard/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoctorAuthMiddleware } from "@/components/auth/doctor-auth-middleware";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Dr. Jane Smith",
    email: "jane.smith@mindguard.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
  };

  return (
    <DoctorAuthMiddleware>
      <div className="flex min-h-screen">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <Sidebar className="h-full" />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex md:w-64 md:flex-col" />

        <div className="flex flex-col flex-1">
          <Header user={user} />
          <main className="flex-1 p-4 md:p-6 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </DoctorAuthMiddleware>
  );
}