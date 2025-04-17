"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface PatientDashboardNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: NavItem[];
}

export function PatientDashboardNav({
  className,
  items,
  ...props
}: PatientDashboardNavProps) {
  const pathname = usePathname();
  
  const defaultItems = [
    {
      title: "Dashboard",
      href: "/patient",
    },
    {
      title: "Health Tracking",
      href: "/patient/health-tracking",
    },
    {
      title: "Consultations",
      href: "/patient/consultations",
    },
    {
      title: "Secure Chat",
      href: "/patient/secure-chat",
      icon: MessageSquare,
    },
    {
      title: "Secure Chat (Test)",
      href: "/patient/secure-chat-test",
      icon: MessageSquare,
    },
  ];

  const navItems = items || defaultItems;

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {item.icon && (
            <item.icon className="mr-2 h-4 w-4" />
          )}
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 