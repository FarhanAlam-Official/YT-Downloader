"use client"

import { useState } from "react"
import { UrlInput } from "@/components/url-input"
import { VideoInfo } from "@/components/video-info"
import { EnhancedStreamSelector } from "@/components/enhanced-stream-selector"
import { DownloadProgress } from "@/components/download-progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { Play, Download, Settings } from "lucide-react"
import type { VideoMetadata } from "@/lib/api"

export default function Home() {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [downloads, setDownloads] = useState<
    Array<{
      id: string
      filename: string
      progress: number
      status: "downloading" | "completed" | "error"
      error?: string
    }>
  >([])

  const handleVideoFetched = (metadata: VideoMetadata, url: string) => {
    setVideoMetadata(metadata)
    setVideoUrl(url)
  }

  const handleDownloadStart = (streamId: string, filename: string) => {
    setDownloads((prev) => [
      ...prev,
      {
        id: streamId,
        filename,
        progress: 0,
        status: "downloading",
      },
    ])
  }

  const handleDownloadComplete = (streamId: string) => {
    setDownloads((prev) =>
      prev.map((download) =>
        download.id === streamId ? { ...download, progress: 100, status: "completed" as const } : download,
      ),
    )
  }

  const handleDownloadError = (streamId: string, error: string) => {
    setDownloads((prev) =>
      prev.map((download) => (download.id === streamId ? { ...download, status: "error" as const, error } : download)),
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-youtube-dark via-surface-primary to-surface-secondary">
      {/* Enhanced YouTube-inspired Header */}
      <header className="border-b border-youtube-border bg-youtube-card/80 backdrop-blur-xl px-4 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative animate-pulse-red">
                <div className="w-10 h-10 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                </div>
                <Download className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-youtube-red rounded-full p-0.5" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-youtube-text-primary">YTDownloader</span>
                <div className="text-xs text-youtube-text-secondary bg-gradient-to-r from-success-500 to-info-500 bg-clip-text text-transparent font-medium">Pro Edition</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-youtube-text-secondary glass-card px-3 py-2 rounded-lg">
              <Settings className="h-4 w-4" />
              <span>Download Videos, Your Way.</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-youtube-text-primary mb-6 leading-tight">
                Download Videos,
                <span className="block bg-gradient-to-r from-youtube-red via-brand-red-500 to-success-500 bg-clip-text text-transparent animate-breathe">
                  Your Way.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-youtube-text-secondary max-w-3xl mx-auto leading-relaxed">
                Save your favorite YouTube content in high quality — fast, secure, and distraction-free.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-youtube-text-secondary">
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Smart Download</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Auto Quality Selection</span>
              </div>
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-youtube-red rounded-full"></div>
                <span>Instant Merge</span>
              </div>
            </div>
          </div>

          {/* Main Content with stagger animations */}
          <div className="space-y-12">
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
                  onDownloadComplete={handleDownloadComplete}
                  onDownloadError={handleDownloadError}
                />
              </div>
            )}

            {downloads.length > 0 && (
              <div className="stagger-item animate-fade-in-up">
                <DownloadProgress downloads={downloads} />
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-20 text-center">
            <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
              <p className="text-youtube-text-secondary mb-4">
                Please respect copyright laws and YouTube's Terms of Service
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-youtube-text-secondary">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-success-500 rounded-full"></div>
                  High Quality Downloads
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-info-500 rounded-full"></div>
                  No Registration Required
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-warning-500 rounded-full"></div>
                  Privacy Focused
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
