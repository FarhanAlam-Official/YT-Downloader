"use client"

import { useState } from "react"
import { DownloadModeSelector, type DownloadMode } from "@/components/download-mode-selector"
import { SmartDownloadButton } from "@/components/smart-download-button"
import { StreamSelector } from "@/components/stream-selector"
import { type Stream } from "@/lib/api"

interface EnhancedStreamSelectorProps {
  streams: Stream[]
  videoUrl: string
  videoTitle: string
  onDownloadStart: (streamId: string, filename: string) => void
  onDownloadProgress: (streamId: string, progress: number, stage?: string) => void
  onDownloadComplete: (streamId: string, filename: string) => void
  onDownloadError: (streamId: string, error: string, filename?: string) => void
}

export function EnhancedStreamSelector({
  streams,
  videoUrl,
  videoTitle,
  onDownloadStart,
  onDownloadProgress,
  onDownloadComplete,
  onDownloadError,
}: EnhancedStreamSelectorProps) {
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("smart")
  const [activeSmartDownloadId, setActiveSmartDownloadId] = useState<string | null>(null)

  // Handlers for smart download (we'll generate a unique ID for tracking)
  const handleSmartDownloadStart = (filename: string) => {
    const smartId = "smart-download-" + Date.now()
    setActiveSmartDownloadId(smartId)
    onDownloadStart(smartId, filename)
  }

  const handleSmartDownloadProgress = (progress: number, stage?: string) => {
    if (activeSmartDownloadId) {
      onDownloadProgress(activeSmartDownloadId, progress, stage)
    }
  }

  const handleSmartDownloadError = (error: string) => {
    if (activeSmartDownloadId) {
      const filename = `${videoTitle.replace(/[^a-zA-Z0-9\s-_]/g, "").replace(/\s+/g, "_").substring(0, 50)}_SmartDownload.mp4`
      onDownloadError(activeSmartDownloadId, error, filename)
      setActiveSmartDownloadId(null)
    }
  }

  if (streams.length === 0) {
    return null
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Mode Selection */}
      <DownloadModeSelector
        mode={downloadMode}
        onModeChange={setDownloadMode}
      />

      {/* Enhanced Content based on selected mode */}
      {downloadMode === "smart" ? (
        <div className="space-y-4 sm:space-y-6">
          <SmartDownloadButton
            streams={streams}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            onDownloadStart={handleSmartDownloadStart}
            onDownloadProgress={handleSmartDownloadProgress}
            onDownloadComplete={(filename) => {
              if (activeSmartDownloadId) {
                onDownloadComplete(activeSmartDownloadId, filename)
                setActiveSmartDownloadId(null)
              }
            }}
            onDownloadError={handleSmartDownloadError}
          />
          
          {/* Enhanced option to switch to manual */}
          <div className="text-center">
            <button
              onClick={() => setDownloadMode("manual")}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-4 decoration-dotted hover:decoration-solid"
            >
              Need more control? Switch to manual selection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Keep existing StreamSelector functionality completely intact */}
          <StreamSelector
            streams={streams}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            onDownloadStart={onDownloadStart}
            onDownloadProgress={onDownloadProgress}
            onDownloadComplete={onDownloadComplete}
            onDownloadError={onDownloadError}
          />
          
          {/* Enhanced option to switch back to smart */}
          <div className="text-center">
            <button
              onClick={() => setDownloadMode("smart")}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline underline-offset-4 decoration-dotted hover:decoration-solid"
            >
              Want automatic selection? Switch to smart download
            </button>
          </div>
        </div>
      )}
    </div>
  )
}