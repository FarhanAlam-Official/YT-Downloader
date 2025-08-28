"use client"

import { useState } from "react"
import { UrlInput } from "@/components/url-input"
import { VideoInfo } from "@/components/video-info"
import { EnhancedStreamSelector } from "@/components/enhanced-stream-selector"
import { toast } from "react-hot-toast"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Download, Settings, HomeIcon } from "lucide-react"
import Link from "next/link"
import type { VideoMetadata } from "@/lib/api"

export default function Home() {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [activeDownloads, setActiveDownloads] = useState<Set<string>>(new Set())
  // Colored toast helpers
  const showStartToast = (filename: string) =>
    toast(() => (
      <div className="relative w-[min(92vw,420px)] rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-600/15 to-indigo-500/15 backdrop-blur-md p-4 pr-6 text-foreground shadow-xl mr-1">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500" />
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-500 text-white">
            <Download className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Download Started</p>
            <p className="text-xs text-blue-700/80 dark:text-blue-300/80">Preparing {filename}...</p>
          </div>
        </div>
      </div>
    ), { duration: 2500 })

  const showCompleteToast = (filename: string) =>
    toast(() => (
      <div className="relative w-[min(92vw,420px)] rounded-2xl border border-green-500/40 bg-gradient-to-br from-green-600/15 to-emerald-500/15 backdrop-blur-md p-4 pr-6 text-foreground shadow-xl mr-1">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-green-500" />
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-green-500 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">Download Complete</p>
            <p className="text-xs text-green-700/80 dark:text-green-300/80 break-all line-clamp-2">{filename}</p>
          </div>
        </div>
      </div>
    ))

  const showErrorToast = (filename: string, error: string) =>
    toast(() => (
      <div className="relative w-[min(92vw,420px)] rounded-2xl border border-red-500/40 bg-gradient-to-br from-red-600/15 to-rose-500/15 backdrop-blur-md p-4 pr-6 text-foreground shadow-xl mr-1">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-red-500" />
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">Download Failed</p>
            <p className="text-xs text-red-700/80 dark:text-red-300/80 break-all line-clamp-2">{filename}: {error}</p>
          </div>
        </div>
      </div>
    ), { duration: 6000 })

  const handleVideoFetched = (metadata: VideoMetadata, url: string) => {
    setVideoMetadata(metadata)
    setVideoUrl(url)
  }

  const handleDownloadStart = (streamId: string, filename: string) => {
    console.log(`Starting download for ${streamId}: ${filename}`)
    setActiveDownloads(prev => new Set([...prev, streamId]))
    showStartToast(filename)
  }

  const handleDownloadProgress = (streamId: string, progress: number, stage?: string) => {
    if (progress >= 100) {
      setActiveDownloads(prev => {
        const newSet = new Set(prev)
        newSet.delete(streamId)
        return newSet
      })
    }
  }

  const handleDownloadComplete = (streamId: string, filename: string) => {
    setActiveDownloads(prev => {
      const newSet = new Set(prev)
      newSet.delete(streamId)
      return newSet
    })
    showCompleteToast(filename)
  }

  const handleDownloadError = (streamId: string, error: string, filename?: string) => {
    setActiveDownloads(prev => {
      const newSet = new Set(prev)
      newSet.delete(streamId)
      return newSet
    })
    showErrorToast(filename || "Unknown file", error)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-youtube-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-success-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-info-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Use the new Navbar */}
        <Navbar />

        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Hero Section */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="mb-8 sm:mb-12 animate-fade-in-up">
                {/* Enhanced Title with Better Typography */}
                <div className="relative">
                  <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 sm:mb-8 leading-[0.9] px-2">
                    <span className="block mb-2">
                      Download Videos,
                    </span>
                    <span className="block bg-gradient-to-r from-youtube-red via-brand-red-500 to-success-500 bg-clip-text text-transparent animate-breathe relative">
                      Your Way.
                      <div className="absolute -inset-1 bg-gradient-to-r from-youtube-red/20 via-brand-red-500/20 to-success-500/20 blur-xl -z-10"></div>
                    </span>
                  </h1>
                  
                  {/* Enhanced Subtitle */}
                  <div className="relative max-w-4xl mx-auto">
                    <p className="text-lg sm:text-2xl md:text-3xl text-muted-foreground leading-relaxed px-4 mb-6">
                      Save your favorite YouTube content in 
                      <span className="text-foreground font-semibold"> high quality</span> — 
                      <span className="text-success-400">fast</span>, 
                      <span className="text-info-400">secure</span>, and 
                      <span className="text-warning-400">distraction-free</span>.
                    </p>
                    
                    {/* Enhanced Call-to-Action */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-500/20 to-info-500/20 rounded-full border border-white/10 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-foreground font-medium">No registration required • Start downloading now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Status Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground px-4">
                <div className="flex items-center justify-center gap-3 glass-card px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse group-hover:scale-110 transition-transform"></div>
                  <span className="font-medium">Smart Download</span>
                </div>
                <div className="flex items-center justify-center gap-3 glass-card px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-110 transition-transform"></div>
                  <span className="font-medium">Auto Quality Selection</span>
                </div>
                <div className="flex items-center justify-center gap-3 glass-card px-4 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-youtube-red rounded-full group-hover:scale-110 transition-transform"></div>
                  <span className="font-medium">Instant Merge</span>
                </div>
              </div>
            </div>

            {/* Enhanced Main Content with better mobile spacing */}
            <div className="space-y-8 sm:space-y-12">
              <div className="stagger-item">
                <UrlInput onVideoFetched={handleVideoFetched} />
              </div>

              {videoMetadata && (
                <div className="stagger-item animate-scale-in">
                  <VideoInfo metadata={videoMetadata} />
                </div>
              )}

              {videoMetadata && (
                <div className="stagger-item animate-slide-in-right">
                  <EnhancedStreamSelector
                    streams={videoMetadata.streams}
                    videoUrl={videoUrl}
                    videoTitle={videoMetadata.title}
                    onDownloadStart={handleDownloadStart}
                    onDownloadProgress={handleDownloadProgress}
                    onDownloadComplete={handleDownloadComplete}
                    onDownloadError={handleDownloadError}
                  />
                </div>
              )}

              {/* Downloads banner removed per request */}
            </div>

            {/* About Us Section */}
            <div className="mt-20 sm:mt-24 mb-16 sm:mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">
                  Why Choose YTDownloader?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Built by developers, for everyone. Fast, secure, and always free.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Smart Technology</h3>
                  <p className="text-muted-foreground">
                    AI-powered quality selection and parallel downloads for the fastest experience possible.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-info-500 to-info-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Privacy First</h3>
                  <p className="text-muted-foreground">
                    No registration, no tracking, no data collection. Your downloads stay private and secure.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <HomeIcon className="h-8 w-8 text-white fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Always Free</h3>
                  <p className="text-muted-foreground">
                    No premium plans, no hidden costs. Professional-grade features available to everyone, always.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/about">
                  <button className="youtube-gradient px-8 py-4 rounded-2xl font-semibold text-white hover:scale-105 transform transition-all duration-300 shadow-xl">
                    Learn More About Our Mission
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* New Footer */}
        <Footer />
      </div>
      
      {/* Sonner toaster is mounted in RootLayout */}
    </main>
  )
}
