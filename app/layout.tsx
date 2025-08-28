import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Space_Grotesk } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Font configuration for DM Sans (primary font)
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

// Font configuration for Space Grotesk (secondary font)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

// SEO metadata configuration for the application
export const metadata: Metadata = {
  title: "YTDownloader - Download YouTube Videos & Audio",
  description: "Download YouTube videos and audio in various formats and qualities. Fast, secure, and easy to use. No registration required.",
  generator: "Next.js",
  applicationName: "YTDownloader",
  referrer: "origin-when-cross-origin",
  keywords: ["YouTube downloader", "video downloader", "YouTube to MP3", "download YouTube videos", "free YouTube downloader", "HD video download"],
  authors: [{ name: "Farhan Alam", url: "https://github.com/FarhanAlam-Official" }],
  creator: "Farhan Alam",
  publisher: "YTDownloader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ytdownloader.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "YTDownloader - Fast & Secure YouTube Downloader",
    description: "Download YouTube videos and audio in various formats. Free, no registration required. Fast, secure and easy to use.",
    url: "https://ytdownloader.vercel.app",
    siteName: "YTDownloader",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "YTDownloader - YouTube Video Downloader",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YTDownloader - Fast & Secure YouTube Downloader",
    description: "Download YouTube videos and audio in various formats. Free, no registration required.",
    images: ["/banner.png"],
    creator: "@FarhanAlam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Viewport configuration for responsive design
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0f0f0f" }, { color: "#ffffff" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// Root layout component that wraps all pages in the application
// Provides global styling, fonts, theme provider, and toast notifications
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`${dmSans.variable} ${spaceGrotesk.variable}`} 
      suppressHydrationWarning
    >
      <head>
        {/* Favicon configuration */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Theme provider for dark/light mode support */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {/* Toast notification system */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}