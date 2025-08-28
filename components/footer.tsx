"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Mail, Youtube, Shield, Zap, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="youtube-card border-border mt-20 sm:mt-24 py-12 sm:py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-transparent flex items-center justify-center">
                <Image 
                  src="/logo.png" 
                  alt="YTDownloader Logo" 
                  width={40} 
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-serif font-bold text-foreground">YTDownloader</span>
            </div>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Fast, secure, and free YouTube video downloading for everyone.
            </p>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm text-muted-foreground">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">by</span>
              <a 
                href="https://github.com/FarhanAlam-Official" 
                className="text-sm font-medium text-foreground hover:text-youtube-red transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Farhan Alam
              </a>
            </div>
            <div className="flex gap-3">
              <Link 
                href="https://github.com/FarhanAlam-Official" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-transparent hover:text-[#171515] dark:hover:text-white transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://www.instagram.com/farhan.alam.01" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-transparent hover:text-[#E4405F] dark:hover:text-[#E4405F] transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.28.073-1.689.073-4.948 0-3.204-.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.facebook.com/farhanalam930" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-transparent hover:text-[#1877F2] dark:hover:text-[#1877F2] transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="https://www.linkedin.com/in/farhan-alam-aa56b2309" 
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-transparent hover:text-[#0077B5] dark:hover:text-[#0077B5] transition-colors"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-6">Features</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Zap className="h-4 w-4 text-success-500" />
                  <span>High Quality Downloads</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Shield className="h-4 w-4 text-info-500" />
                  <span>Privacy Focused</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Heart className="h-4 w-4 text-youtube-red" />
                  <span>Always Free</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  YouTube Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Disclaimer */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} YTDownloader. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-success-500" />
                Privacy Focused
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-info-500" />
                No Registration
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-youtube-red" />
                Always Free
              </span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground max-w-3xl mx-auto">
              Disclaimer: This tool is for personal use only. Please respect copyright laws and YouTube's Terms of Service. 
              We do not host any copyrighted content. All videos are downloaded directly from YouTube.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}