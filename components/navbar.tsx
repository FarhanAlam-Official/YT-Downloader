"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between max-w-7xl">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative group">
            <div className="w-10 h-10 bg-transparent flex items-center justify-center transform transition-all duration-300 group-hover:scale-105">
              <Image 
                src="/logo.png" 
                alt="YTDownloader Logo" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-foreground">
              YTDownloader
            </span>
            <div className="text-xs text-muted-foreground">
              Professional Edition
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link href="/">
            <Button 
              variant={pathname === "/" ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
          
          <Link href="/about">
            <Button 
              variant={pathname === "/about" ? "default" : "ghost"} 
              size="sm" 
              className="flex items-center gap-2"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>
          
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}