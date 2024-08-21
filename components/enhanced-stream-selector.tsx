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
  onDownloadComplete: (streamId: string) => void
  onDownloadError: (streamId: string, error: string) => void
}

export function EnhancedStreamSelector({
  streams,
  videoUrl,
  videoTitle,
  onDownloadStart,
  onDownloadComplete,
  onDownloadError,
}: EnhancedStreamSelectorProps) {
  const [downloadMode, setDownloadMode] = useState<DownloadMode>("smart")

  // Handlers for smart download (we'll generate a unique ID for tracking)
  const handleSmartDownloadStart = (filename: string) => {
    const smartId = "smart-download-" + Date.now()
    onDownloadStart(smartId, filename)
  }

  const handleSmartDownloadComplete = () => {
    const smartId = "smart-download-" + Date.now()
    onDownloadComplete(smartId)
  }

  const handleSmartDownloadError = (error: string) => {
    const smartId = "smart-download-" + Date.now()
    onDownloadError(smartId, error)
  }

  if (streams.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Mode Selection */}
      <DownloadModeSelector
        mode={downloadMode}
        onModeChange={setDownloadMode}
      />

      {/* Content based on selected mode */}
      {downloadMode === "smart" ? (
        <div className="space-y-6">
          <SmartDownloadButton
            streams={streams}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            onDownloadStart={handleSmartDownloadStart}
            onDownloadComplete={handleSmartDownloadComplete}
            onDownloadError={handleSmartDownloadError}
          />
          
          {/* Option to switch to manual */}
          <div className="text-center">
            <button
              onClick={() => setDownloadMode("manual")}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline"
            >
              Need more control? Switch to manual selection
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Keep existing StreamSelector functionality completely intact */}
          <StreamSelector
            streams={streams}
            videoUrl={videoUrl}
            videoTitle={videoTitle}
            onDownloadStart={onDownloadStart}
            onDownloadComplete={onDownloadComplete}
            onDownloadError={onDownloadError}
          />
          
          {/* Option to switch back to smart */}
          <div className="text-center">
            <button
              onClick={() => setDownloadMode("smart")}
              className="text-sm text-gray-400 hover:text-gray-300 transition-colors underline"
            >
              Want automatic selection? Switch to smart download
            </button>
          </div>
        </div>
      )}
    </div>
  )
}