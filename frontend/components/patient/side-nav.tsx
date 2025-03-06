"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  Users,
  Bot,
  Trophy,
  Music,
  Settings,
  HelpCircle,
  Home,
  Gamepad2,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/patient",
    icon: Home,
  },
  {
    name: "Health Tracking",
    href: "/patient/health-tracking",
    icon: BarChart3,
  },
  {
    name: "Consultations",
    href: "/patient/consultations",
    icon: Calendar,
  },
  {
    name: "Community",
    href: "/patient/community",
    icon: Users,
  },
  {
    name: "AI Assistant",
    href: "/patient/ai-assistant",
    icon: Bot,
  },
  {
    name: "Wellness Challenges",
    href: "/patient/wellness-challenges",
    icon: Trophy,
  },
  {
    name: "Music Therapy",
    href: "/patient/music-therapy",
    icon: Music,
  },
  {
    name: "Gamification",
    href: "/patient/Gamification",
    icon: Gamepad2,
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex-1 py-2">
          <nav className="grid gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-4">
          <nav className="grid gap-1">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}