"use client"

import { useState } from "react"
import { UrlInput } from "@/components/url-input"
import { VideoInfo } from "@/components/video-info"
import { EnhancedStreamSelector } from "@/components/enhanced-stream-selector"
import { ToastNotification, useToasts } from "@/components/toast-notification"
import { ThemeToggle } from "@/components/theme-toggle"
import { Play, Download, Settings } from "lucide-react"
import type { VideoMetadata } from "@/lib/api"

export default function Home() {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [activeDownloads, setActiveDownloads] = useState<Set<string>>(new Set())
  const { toasts, removeToast, showDownloadStart, showDownloadComplete, showDownloadError } = useToasts()

  const handleVideoFetched = (metadata: VideoMetadata, url: string) => {
    setVideoMetadata(metadata)
    setVideoUrl(url)
  }

  const handleDownloadStart = (streamId: string, filename: string) => {
    console.log(`Starting download for ${streamId}: ${filename}`)
    setActiveDownloads(prev => new Set([...prev, streamId]))
    showDownloadStart(filename)
  }

  const handleDownloadProgress = (streamId: string, progress: number, stage?: string) => {
    // Progress tracking is now simplified - we just track completion
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
    showDownloadComplete(filename)
  }

  const handleDownloadError = (streamId: string, error: string, filename?: string) => {
    setActiveDownloads(prev => {
      const newSet = new Set(prev)
      newSet.delete(streamId)
      return newSet
    })
    showDownloadError(filename || "Unknown file", error)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-youtube-dark via-surface-primary to-surface-secondary relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-youtube-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-success-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-info-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Enhanced YouTube-inspired Header */}
        <header className="border-b border-youtube-border bg-youtube-card/90 backdrop-blur-xl px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative animate-pulse-red">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-xl flex items-center justify-center shadow-xl">
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current ml-0.5" />
                  </div>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 text-white absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-youtube-red rounded-full p-0.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-lg sm:text-2xl font-serif font-bold text-youtube-text-primary truncate">
                    YTDownloader
                  </span>
                  <div className="text-xs text-youtube-text-secondary bg-gradient-to-r from-success-500 to-info-500 bg-clip-text text-transparent font-medium hidden sm:block">
                    Pro Edition
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-youtube-text-secondary glass-card px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Download Videos, Your Way.</span>
                <span className="lg:hidden">Pro</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-7xl">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Hero Section */}
            <div className="text-center mb-16 sm:mb-20">
              <div className="mb-8 sm:mb-12 animate-fade-in-up">
                {/* Enhanced Title with Better Typography */}
                <div className="relative">
                  <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-youtube-text-primary mb-6 sm:mb-8 leading-[0.9] px-2">
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
                    <p className="text-lg sm:text-2xl md:text-3xl text-youtube-text-secondary leading-relaxed px-4 mb-6">
                      Save your favorite YouTube content in 
                      <span className="text-white font-semibold"> high quality</span> — 
                      <span className="text-success-400">fast</span>, 
                      <span className="text-info-400">secure</span>, and 
                      <span className="text-warning-400">distraction-free</span>.
                    </p>
                    
                    {/* Enhanced Call-to-Action */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-500/20 to-info-500/20 rounded-full border border-white/10 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white font-medium">No registration required • Start downloading now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Status Indicators */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm text-youtube-text-secondary px-4">
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

              {/* Simple Download Status - Show only when downloads are active */}
              {activeDownloads.size > 0 && (
                <div className="stagger-item animate-fade-in-up">
                  <div className="glass-card rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-youtube-red to-brand-red-600 flex items-center justify-center shadow-xl">
                          <Download className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-serif font-bold text-white">Downloads in Progress</h3>
                          <p className="text-sm text-gray-400">
                            {activeDownloads.size} download{activeDownloads.size > 1 ? 's' : ''} currently processing...
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="pulse-loader">
                          <div className="pulse-dot bg-youtube-red"></div>
                          <div className="pulse-dot bg-youtube-red"></div>
                          <div className="pulse-dot bg-youtube-red"></div>
                        </div>
                        <span className="text-youtube-red font-medium text-sm">Processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Footer - Mobile Optimized */}
            <div className="mt-16 sm:mt-20 text-center">
              <div className="youtube-card p-6 sm:p-8 max-w-2xl mx-auto border border-white/10">
                <p className="text-youtube-text-secondary mb-4 text-sm sm:text-base">
                  Please respect copyright laws and YouTube's Terms of Service
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-youtube-text-secondary">
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-success-500 rounded-full"></div>
                    High Quality Downloads
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-info-500 rounded-full"></div>
                    No Registration Required
                  </span>
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 bg-warning-500 rounded-full"></div>
                    Privacy Focused
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastNotification
        toasts={toasts}
        onRemoveToast={removeToast}
      />
    </main>
  )
}
