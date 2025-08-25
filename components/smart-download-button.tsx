"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Zap, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Video, 
  Music, 
  Merge,
  FileVideo,
  Info
} from "lucide-react"
import { 
  type Stream, 
  type SmartDownloadInfo, 
  type SmartDownloadProgress,
  getSmartDownloadInfo,
  smartDownload,
  YouTubeApiError 
} from "@/lib/api"

interface SmartDownloadButtonProps {
  streams: Stream[]
  videoUrl: string
  videoTitle: string
  onDownloadStart: (filename: string) => void
  onDownloadProgress: (progress: number, stage?: string) => void
  onDownloadComplete: (filename: string) => void
  onDownloadError: (error: string, filename?: string) => void
  disabled?: boolean
}

type DownloadStage = 
  | "ready" 
  | "loading-info"
  | "analyzing" 
  | "downloading-video" 
  | "downloading-audio" 
  | "merging" 
  | "complete" 
  | "error"

export function SmartDownloadButton({
  streams,
  videoUrl,
  videoTitle,
  onDownloadStart,
  onDownloadProgress,
  onDownloadComplete,
  onDownloadError,
  disabled = false
}: SmartDownloadButtonProps) {
  const [downloadStage, setDownloadStage] = useState<DownloadStage>("ready")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [smartInfo, setSmartInfo] = useState<SmartDownloadInfo | null>(null)
  const [loading, setLoading] = useState(false)

  // Load smart download info when component mounts
  useEffect(() => {
    loadSmartDownloadInfo()
  }, [videoUrl])

  const loadSmartDownloadInfo = async () => {
    if (!videoUrl) return
    
    try {
      setLoading(true)
      setDownloadStage("loading-info")
      setError(null)
      
      const info = await getSmartDownloadInfo(videoUrl, false) // Prioritize highest quality merging
      setSmartInfo(info)
      setDownloadStage("ready")
      
    } catch (error) {
      const errorMessage = error instanceof YouTubeApiError ? error.message : "Failed to analyze video"
      setError(errorMessage)
      setDownloadStage("error")
    } finally {
      setLoading(false)
    }
  }

  const handleSmartDownload = async () => {
    if (!smartInfo) {
      setError("Smart download info not available")
      return
    }

    let filename = ""
    try {
      setError(null)
      setProgress(0)
      setDownloadStage("analyzing")
      
      const sanitizedTitle = videoTitle
        .replace(/[^a-zA-Z0-9\s-_]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 50)

      filename = `${sanitizedTitle}_SmartDownload.mp4`
      onDownloadStart(filename)

      // Start smart download with progress tracking
      const blob = await smartDownload(
        videoUrl,
        false, // Prioritize highest quality merging over progressive
        (progressInfo: SmartDownloadProgress) => {
          setDownloadStage(progressInfo.stage)
          setProgress(progressInfo.progress)
          
          // Report progress to parent component
          onDownloadProgress(progressInfo.progress, progressInfo.stage)
          
          if (progressInfo.error) {
            setError(progressInfo.error)
            onDownloadError(progressInfo.error, filename)
            return
          }
        }
      )

      // Download successful, trigger file download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)

      // Ensure completion is reported
      if (downloadStage !== "complete") {
        setDownloadStage("complete")
        setProgress(100)
      }
      onDownloadComplete(filename)
      
    } catch (error) {
      const errorMessage = error instanceof YouTubeApiError ? error.message : "Download failed"
      setError(errorMessage)
      setDownloadStage("error")
      setProgress(0)
      onDownloadError(errorMessage, filename)
    }
  }

  const getStageText = () => {
    switch (downloadStage) {
      case "ready": return "Download Best Quality"
      case "loading-info": return "Analyzing available options..."
      case "analyzing": return "Starting download..."
      case "downloading-video": return "Downloading video..."
      case "downloading-audio": return "Downloading audio..."
      case "merging": return "Merging files..."
      case "complete": return "Download complete!"
      case "error": return "Try again"
      default: return "Download"
    }
  }

  const getStageIcon = () => {
    switch (downloadStage) {
      case "ready": return <Zap className="h-5 w-5" />
      case "loading-info": return <Loader2 className="h-5 w-5 animate-spin" />
      case "analyzing": return <Loader2 className="h-5 w-5 animate-spin" />
      case "downloading-video": return <Video className="h-5 w-5" />
      case "downloading-audio": return <Music className="h-5 w-5" />
      case "merging": return <Merge className="h-5 w-5 animate-pulse" />
      case "complete": return <CheckCircle className="h-5 w-5" />
      case "error": return <AlertCircle className="h-5 w-5" />
      default: return <Download className="h-5 w-5" />
    }
  }

  const isDownloading = ["loading-info", "analyzing", "downloading-video", "downloading-audio", "merging"].includes(downloadStage)
  const isLoading = loading || downloadStage === "loading-info"

  // Show loading state while fetching smart info
  if (isLoading && !smartInfo) {
    return (
      <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
            <Loader2 className="h-5 w-5 text-green-400 animate-spin dark:text-green-400 light:text-green-600" />
            <span className="text-green-foreground font-medium dark:text-green-foreground light:text-green-700">Analyzing Video...</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Finding the best quality options for you
          </p>
        </div>
      </Card>
    )
  }

  // Show error if smart info failed to load
  if (!smartInfo && downloadStage === "error") {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4 dark:text-red-200 light:text-red-700" />
        <AlertDescription className="text-red-200 dark:text-red-200 light:text-red-700">
          {error || "Unable to analyze video for smart download. Please use manual selection."}
        </AlertDescription>
      </Alert>
    )
  }

  // Show error if no smart info available
  if (!smartInfo) {
    return (
      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4 dark:text-red-200 light:text-red-700" />
        <AlertDescription className="text-red-200 dark:text-red-200 light:text-red-700">
          No suitable streams available for smart download. Please use manual selection.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
            <Zap className="h-5 w-5 text-green-400 dark:text-green-400 light:text-green-600" />
            <span className="text-green-foreground font-medium dark:text-green-foreground light:text-green-700">Smart Download Ready</span>
          </div>
          <p className="text-muted-foreground text-sm">
            We've selected the best quality available for you
          </p>
        </div>

        {/* Quality Info */}
        <div className="stream-selector-card rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Selected Quality:</span>
            <Badge className="bg-green-500/20 text-green-foreground border-green-500/30">
              {smartInfo.recommended_quality}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Estimated Size:</span>
            <span className="text-foreground font-medium">{smartInfo.estimated_size_mb.toFixed(1)} MB</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Type:</span>
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-green-400 dark:text-green-400 light:text-green-600" />
              <span className="text-green-foreground text-sm dark:text-green-foreground light:text-green-700">
                {smartInfo.merge_required ? "Merged File (Video + Audio)" : "Single File (Video + Audio)"}
              </span>
            </div>
          </div>
          
          {smartInfo.merge_required && !smartInfo.ffmpeg_available && (
            <div className="stream-selector-card p-2 rounded text-xs">
              ⚠️ FFmpeg not available - may fall back to lower quality
            </div>
          )}
        </div>

        {/* Progress Section */}
        {isDownloading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">{getStageText()}</span>
              <span className="text-green-400 text-sm">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Stage Indicators */}
            <div className="flex justify-between text-xs text-gray-500">
              <span className={downloadStage === "analyzing" ? "text-green-400" : ""}>Analyze</span>
              <span className={downloadStage === "downloading-video" ? "text-green-400" : ""}>Video</span>
              {smartInfo.merge_required && (
                <span className={downloadStage === "downloading-audio" ? "text-green-400" : ""}>Audio</span>
              )}
              {smartInfo.merge_required && (
                <span className={downloadStage === "merging" ? "text-green-400" : ""}>Merge</span>
              )}
              <span className={downloadStage === "complete" ? "text-green-400" : ""}>Done</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
            <AlertCircle className="h-4 w-4 dark:text-red-foreground light:text-red-700" />
            <AlertDescription className="text-red-foreground dark:text-red-foreground light:text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {downloadStage === "complete" && (
          <div className="stream-selector-card p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400 dark:text-green-400 light:text-green-600" />
              <div className="text-sm">
                <p className="text-green-foreground font-medium dark:text-green-foreground light:text-green-700">Download Complete!</p>
                <p className="text-green-foreground/80 dark:text-green-foreground/80 light:text-green-600/80">Your video has been downloaded and is ready to play.</p>
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        <Button
          onClick={handleSmartDownload}
          disabled={disabled || isDownloading || isLoading}
          className={`w-full h-14 text-lg font-medium transition-all duration-300 ${
            downloadStage === "complete" 
              ? "bg-green-600 hover:bg-green-700" 
              : downloadStage === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"
          }`}
        >
          <div className="flex items-center gap-3">
            {getStageIcon()}
            {getStageText()}
          </div>
        </Button>

        {/* Info Note */}
        {downloadStage === "ready" && smartInfo.merge_required && (
          <div className="stream-selector-card p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0 dark:text-blue-400 light:text-blue-600" />
              <div className="text-xs text-blue-foreground dark:text-blue-foreground light:text-blue-700">
                <p className="font-medium mb-1 dark:font-medium light:font-medium">Advanced Processing</p>
                <p className="dark:text-blue-foreground light:text-blue-700">This will download high-quality video and audio separately, then merge them into a single file for the best quality experience.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}