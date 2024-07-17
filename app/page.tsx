"use client"

import { useState } from "react"
import { UrlInput } from "@/components/url-input"
import { VideoInfo } from "@/components/video-info"
import { StreamSelector } from "@/components/stream-selector"
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
    <main className="min-h-screen bg-youtube-dark">
      {/* Enhanced YouTube-inspired Header */}
      <header className="border-b border-youtube-border bg-youtube-card px-4 py-4 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative animate-pulse-red">
                <div className="w-10 h-10 bg-youtube-red rounded-xl flex items-center justify-center">
                  <Play className="h-5 w-5 text-white fill-current ml-0.5" />
                </div>
                <Download className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-youtube-red rounded-full p-0.5" />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-youtube-text-primary">YTDownloader</span>
                <div className="text-xs text-youtube-text-secondary">Pro Edition</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-youtube-text-secondary">
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
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-youtube-text-primary mb-6 leading-tight">
                Download Videos,
                <span className="block text-youtube-red">Your Way.</span>
              </h1>
              <p className="text-xl md:text-2xl text-youtube-text-secondary max-w-3xl mx-auto leading-relaxed">
                Save your favorite YouTube content in high quality — fast, secure, and distraction-free.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-youtube-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>9 Quality Options</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Video + Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-youtube-red rounded-full"></div>
                <span>Instant Download</span>
              </div>
            </div>
          </div>

          {/* Main Content with improved spacing */}
          <div className="space-y-12">
            <UrlInput onVideoFetched={handleVideoFetched} />

            {videoMetadata && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <VideoInfo metadata={videoMetadata} />
              </div>
            )}

            {videoMetadata && (
              <div className="animate-in slide-in-from-bottom-4 duration-700">
                <StreamSelector
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
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <DownloadProgress downloads={downloads} />
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          <div className="mt-20 text-center">
            <div className="youtube-card rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-youtube-text-secondary mb-4">
                Please respect copyright laws and YouTube's Terms of Service
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-youtube-text-secondary">
                <span>• High Quality Downloads</span>
                <span>• No Registration Required</span>
                <span>• Privacy Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
