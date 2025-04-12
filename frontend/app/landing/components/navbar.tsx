"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/app/landing/components/mode-toggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md shadow-sm py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-1">
          <Image 
            src="/mindguard_logo.png" 
            alt="MindGuard Logo" 
            width={32} 
            height={32} 
            className="h-6 sm:h-8 w-auto"
          />
          <span className="font-poppins font-bold text-2xl sm:text-3xl hidden sm:inline">MindGuard</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#how-it-works">How It Works</NavLink>
          <NavLink href="/#testimonials">Testimonials</NavLink>
          <NavLink href="/#faq">FAQ</NavLink>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button variant="gradient" size="sm" className="shadow-md" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/80"
      )}
    >
      {children}
    </Link>
  );
}