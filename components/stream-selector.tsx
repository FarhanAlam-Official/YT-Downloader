"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Video, Music, Download, Loader2, AlertCircle, Filter, CheckCircle } from "lucide-react"
import { type Stream, downloadVideo, YouTubeApiError } from "@/lib/api"

interface StreamSelectorProps {
  streams: Stream[]
  videoUrl: string
  videoTitle: string // Added videoTitle prop for proper naming
  onDownloadStart: (streamId: string, filename: string) => void
  onDownloadProgress: (streamId: string, progress: number, stage?: string) => void
  onDownloadComplete: (streamId: string, filename: string) => void
  onDownloadError: (streamId: string, error: string, filename?: string) => void
}

export function StreamSelector({
  streams,
  videoUrl,
  videoTitle,
  onDownloadStart,
  onDownloadProgress,
  onDownloadComplete,
  onDownloadError,
}: StreamSelectorProps) {
  const [downloadingStreams, setDownloadingStreams] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [showVideoOnly, setShowVideoOnly] = useState(false)
  const [showAudioOnly, setShowAudioOnly] = useState(true) // Changed default to true to show audio files by default

  const handleDownload = async (stream: Stream) => {
    const streamId = stream.id
    setDownloadingStreams((prev: Set<string>) => new Set(prev).add(streamId))
    setError(null)

    const sanitizedTitle = videoTitle
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50)

    const extension = stream.type === "video" ? "mp4" : "mp3"
    const filename = `${sanitizedTitle}_${stream.quality}.${extension}`

    onDownloadStart(streamId, filename)

    let progressInterval: NodeJS.Timeout | null = null

    try {
      // Start progress simulation for manual downloads
      let currentProgress = 5
      onDownloadProgress(streamId, currentProgress, "downloading")
      
      progressInterval = setInterval(() => {
        if (currentProgress < 85) {
          currentProgress += Math.random() * 10 + 5 // Random increment between 5-15
          currentProgress = Math.min(currentProgress, 85) // Cap at 85%
          onDownloadProgress(streamId, Math.round(currentProgress), "downloading")
        }
      }, 400) // Update every 400ms
      
      // Start the actual download
      const blob = await downloadVideo(videoUrl, streamId, filename)
      
      // Stop progress simulation and complete download
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      
      // Create download link and trigger download
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
      
      // Notify completion
      onDownloadComplete(streamId, filename)
      
    } catch (error) {
      // Make sure to clear any running progress interval on error
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
      }
      
      let errorMessage = "Download failed. Please try again."
      if (error instanceof YouTubeApiError) {
        errorMessage = error.message
      }
      setError(errorMessage)
      onDownloadError(streamId, errorMessage, filename)
      console.error("Download error:", error)
    } finally {
      setDownloadingStreams((prev: Set<string>) => {
        const newSet = new Set(prev)
        newSet.delete(streamId)
        return newSet
      })
    }
  }

  // Organize streams by type
  const progressiveStreams = streams.filter(stream => 
    stream.type === 'video' && !stream.quality.includes('video only') && !stream.quality.includes('audio only')
  )
  const videoOnlyStreams = streams.filter(stream => 
    stream.quality.includes('video only') || (stream.type === 'video' && stream.quality.includes('video only'))
  )
  const audioOnlyStreams = streams.filter(stream => 
    stream.quality.includes('audio only') || stream.type === 'audio'
  )

  // Filter streams based on user preferences
  const getFilteredStreams = () => {
    let filteredStreams = [...progressiveStreams] // Always show progressive streams
    
    if (showVideoOnly) {
      filteredStreams = [...filteredStreams, ...videoOnlyStreams]
    }
    
    if (showAudioOnly) {
      filteredStreams = [...filteredStreams, ...audioOnlyStreams]
    }
    
    return filteredStreams
  }

  const filteredStreams = getFilteredStreams()

  if (streams.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg">
          <Download className="h-6 w-6 text-white dark:text-white light:text-white" />
          <h3 className="text-xl font-bold text-white dark:text-white light:text-white">Choose Your Download</h3>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the best quality that suits your needs. We recommend video files with audio for complete playback.
        </p>
      </div>

      {/* Recommendation Banner */}
      {progressiveStreams.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6">
          <div className="absolute inset-0 bg-green-500/5" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white dark:text-white light:text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-green-foreground mb-2">Best Choice Available!</h4>
              <p className="text-green-foreground/80 mb-3">
                We found {progressiveStreams.length} complete video file{progressiveStreams.length > 1 ? 's' : ''} that include both video and audio. 
                These are perfect for watching and will play with full sound.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-foreground">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Ready to download • No additional software needed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="stream-selector-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 dark:bg-blue-500/20 light:bg-blue-500/30 rounded-lg flex items-center justify-center">
            <Filter className="h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-foreground dark:text-white light:text-gray-900">Advanced Options</h4>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch
                  id="show-video-only"
                  checked={showVideoOnly}
                  onCheckedChange={setShowVideoOnly}
                  className="data-[state=checked]:bg-orange-500"
                />
                <Label htmlFor="show-video-only" className="text-sm font-medium text-muted-foreground dark:text-muted-foreground light:text-gray-700 cursor-pointer">
                  Show video-only files
                </Label>
              </div>
              <Badge variant="outline" className="text-orange-400 border-orange-400/50">
                {videoOnlyStreams.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground light:text-gray-600 ml-9">
              High quality video without audio tracks
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch
                  id="show-audio-only"
                  checked={showAudioOnly}
                  onCheckedChange={setShowAudioOnly}
                  className="data-[state=checked]:bg-blue-500"
                />
                <Label htmlFor="show-audio-only" className="text-sm font-medium text-muted-foreground dark:text-muted-foreground light:text-gray-700 cursor-pointer">
                  Show audio-only files
                </Label>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                {audioOnlyStreams.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground light:text-gray-600 ml-9">
              Audio tracks only, perfect for music
            </p>
          </div>
        </div>
        
        {(showVideoOnly || showAudioOnly) && (
          <div className="mt-4 p-4 bg-amber-500/10 dark:bg-amber-500/10 light:bg-amber-100/50 border border-amber-500/20 dark:border-amber-500/20 light:border-amber-300/50 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 dark:text-amber-400 light:text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-foreground dark:text-amber-foreground light:text-amber-800 font-medium mb-1">Advanced User Notice</p>
                <p className="text-amber-foreground/80 dark:text-amber-foreground/80 light:text-amber-700/90">
                  Video-only files require separate audio. Audio-only files contain no video. 
                  Most users should choose complete video files above.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4 dark:text-red-foreground light:text-red-foreground" />
          <AlertDescription className="text-red-foreground">{error}</AlertDescription>
        </Alert>
      )}

      {/* Streams Grid */}
      <div className="space-y-6">
        {/* Stream Count and Sort Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Showing {filteredStreams.length} of {streams.length} formats</span>
            {filteredStreams.length !== streams.length && (
              <Badge variant="outline" className="text-xs">
                Filtered
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">
            Sorted by quality and completeness
          </div>
        </div>

        {/* Progressive Streams (Recommended) */}
        {progressiveStreams.filter(stream => filteredStreams.includes(stream)).length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-green-500 rounded-full" />
              <h4 className="text-lg font-semibold text-foreground">Complete Videos (Recommended)</h4>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Best Choice
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {progressiveStreams.filter(stream => filteredStreams.includes(stream)).map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  isRecommended={true}
                  isDownloading={downloadingStreams.has(stream.id)}
                  onDownload={() => handleDownload(stream)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Video-Only Streams */}
        {videoOnlyStreams.filter(stream => filteredStreams.includes(stream)).length > 0 && showVideoOnly && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-orange-500 rounded-full" />
              <h4 className="text-lg font-semibold text-foreground">Video Only (No Audio)</h4>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                Advanced
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {videoOnlyStreams.filter(stream => filteredStreams.includes(stream)).map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  isRecommended={false}
                  isDownloading={downloadingStreams.has(stream.id)}
                  onDownload={() => handleDownload(stream)}
                  type="video-only"
                />
              ))}
            </div>
          </div>
        )}

        {/* Audio-Only Streams */}
        {audioOnlyStreams.filter(stream => filteredStreams.includes(stream)).length > 0 && showAudioOnly && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full" />
              <h4 className="text-lg font-semibold text-foreground">Audio Only</h4>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Music
              </Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {audioOnlyStreams.filter(stream => filteredStreams.includes(stream)).map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  isRecommended={false}
                  isDownloading={downloadingStreams.has(stream.id)}
                  onDownload={() => handleDownload(stream)}
                  type="audio-only"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Separate StreamCard component for better organization
interface StreamCardProps {
  stream: Stream
  isRecommended: boolean
  isDownloading: boolean
  onDownload: () => void
  type?: 'progressive' | 'video-only' | 'audio-only'
}

function StreamCard({ stream, isRecommended, isDownloading, onDownload, type = 'progressive' }: StreamCardProps) {
  const getCardStyles = () => {
    if (isRecommended) {
      return "bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/30 ring-1 ring-green-500/20 hover:ring-green-500/40"
    }
    if (type === 'video-only') {
      return "bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-500/30 hover:border-orange-500/50"
    }
    if (type === 'audio-only') {
      return "bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/30 hover:border-blue-500/50"
    }
    return "bg-gray-900/40 border-gray-700/50 hover:border-gray-600/50"
  }

  const getIconConfig = () => {
    if (stream.type === "video") {
      if (isRecommended) return { icon: Video, bg: "bg-green-500", text: "text-white" }
      if (type === 'video-only') return { icon: Video, bg: "bg-orange-500", text: "text-white" }
      return { icon: Video, bg: "bg-blue-500", text: "text-white" }
    }
    return { icon: Music, bg: "bg-blue-500", text: "text-white" }
  }

  const getTypeLabel = () => {
    if (stream.quality.includes('with audio')) return { text: "Video + Audio", icon: "🔊", color: "text-green-400" }
    if (stream.quality.includes('video only')) return { text: "Video Only", icon: "🔇", color: "text-orange-400" }
    if (stream.quality.includes('audio only')) return { text: "Audio Only", icon: "🎵", color: "text-blue-400" }
    return { text: "Complete", icon: "🔊", color: "text-green-400" }
  }

  const { icon: Icon, bg, text } = getIconConfig()
  const typeLabel = getTypeLabel()

  return (
    <div className={`relative rounded-2xl border backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] ${getCardStyles()}`}>
      {isRecommended && (
        <div className="absolute -top-3 left-6">
          <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-medium shadow-lg">
            ✨ Recommended
          </Badge>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className={`h-6 w-6 ${text} dark:${text} light:${text}`} />
          </div>
          <div>
            <h5 className="text-lg font-bold text-foreground mb-1">
              {stream.quality.replace(/ \(.*?\)/g, '')}
            </h5>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {stream.format.toUpperCase()}
              </Badge>
              {isRecommended && (
                <Badge className="bg-green-500/20 text-green-300 text-xs border-green-500/30">
                  Complete
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Size:</span>
          <span className="text-foreground font-medium">{stream.filesize}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Codec:</span>
          <span className="text-muted-foreground text-xs">{stream.codec}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className={`flex items-center gap-1 font-medium ${typeLabel.color}`}>
            <span>{typeLabel.icon}</span>
            <span className="text-xs">{typeLabel.text}</span>
          </span>
        </div>
      </div>

      <Button
        onClick={onDownload}
        disabled={isDownloading}
        className={`w-full h-12 text-base font-medium transition-all duration-200 ${
          isRecommended
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
            : type === 'video-only'
            ? 'bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white'
            : type === 'audio-only'
            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
            : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
        }`}
      >
        {isDownloading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2 dark:text-white light:text-gray-800" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2 dark:text-white light:text-gray-800" />
            Download {isRecommended ? '(Best Choice)' : ''}
          </>
        )}
      </Button>
    </div>
  )
}
