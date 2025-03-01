"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Pill,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/doctor",
      active: pathname === "/doctor",
    },
    {
      label: "Appointments",
      icon: Calendar,
      href: "/doctor/appointments",
      active: pathname === "/doctor/appointments",
    },
    {
      label: "Patients",
      icon: Users,
      href: "/doctor/patients",
      active: pathname === "/doctor/patients",
    },
    {
      label: "Prescriptions",
      icon: Pill,
      href: "/doctor/prescriptions",
      active: pathname === "/doctor/prescriptions",
    },
    {
      label: "Analytics",
      icon: Activity,
      href: "/doctor/analytics",
      active: pathname === "/doctor/analytics",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/doctor/messages",
      active: pathname === "/doctor/messages",
    },
    {
      label: "Patient Map",
      icon: MapPin,
      href: "/doctor/patient-map",
      active: pathname === "/doctor/patient-map",
    },
    // {
    //   label: "Reports",
    //   icon: FileText,
    //   href: "/doctor/reports",
    //   active: pathname === "/doctor/reports",
    // },
    {
      label: "Settings",
      icon: Settings,
      href: "/doctor/settings",
      active: pathname === "/doctor/settings",
    },
  ];

  return (
    <div className={cn("pb-12 h-screen flex flex-col", className)}>
      <div className="space-y-4 py-4 flex flex-col h-full">
        <div className="px-3 py-2 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">MindGuard</h2>
          </Link>
          <ThemeToggle />
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.active ? "secondary" : "ghost"}
                size="sm"
                className={cn("w-full justify-start", {
                  "bg-secondary": route.active,
                })}
                asChild
              >
                <Link href={route.href}>
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Link>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="px-3 mt-auto">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}