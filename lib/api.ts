// API service functions for YouTube downloader

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface Stream {
  id: string
  type: "video" | "audio"
  quality: string
  format: string
  filesize: string
  codec: string
  url: string
}

export interface VideoMetadata {
  title: string
  duration: number
  thumbnail: string
  uploader: string
  view_count: number
  streams: Stream[]
}

export interface SmartDownloadInfo {
  video_title: string
  video_duration: number
  recommended_quality: string
  estimated_size_mb: number
  merge_required: boolean
  download_type: string
  ffmpeg_available: boolean
}

export interface SystemInfo {
  ffmpeg_available: boolean
  ffmpeg_version: string | null
  smart_download_supported: boolean
}

export interface SmartDownloadProgress {
  stage: 'analyzing' | 'downloading-video' | 'downloading-audio' | 'merging' | 'complete' | 'error'
  progress: number
  message: string
  error?: string
}

export interface ApiError {
  detail: string
}

export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message)
    this.name = "YouTubeApiError"
  }
}

export async function fetchVideoMetadata(url: string): Promise<VideoMetadata> {
  try {
    const response = await fetch(`${API_BASE}/api/video-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))
      throw new YouTubeApiError(errorData.detail, response.status)
    }

    const data: VideoMetadata = await response.json()
    return data
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new YouTubeApiError("Unable to connect to the server. Please make sure the backend is running.")
    }

    throw new YouTubeApiError("An unexpected error occurred while fetching video metadata.")
  }
}

export async function downloadVideo(videoUrl: string, streamId: string, filename?: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE}/api/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: videoUrl,
        stream_id: streamId,
        filename: filename, // Pass filename to backend
      }),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))
      throw new YouTubeApiError(errorData.detail, response.status)
    }

    return await response.blob()
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new YouTubeApiError("Unable to connect to the server. Please make sure the backend is running.")
    }

    throw new YouTubeApiError("An unexpected error occurred during download.")
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`
  }
  return `${count} views`
}

// Smart Download API Functions
export async function getSystemInfo(): Promise<SystemInfo> {
  try {
    const response = await fetch(`${API_BASE}/api/system-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))
      throw new YouTubeApiError(errorData.detail, response.status)
    }

    const data: SystemInfo = await response.json()
    return data
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new YouTubeApiError("Unable to connect to the server. Please make sure the backend is running.")
    }

    throw new YouTubeApiError("An unexpected error occurred while checking system info.")
  }
}

export async function getSmartDownloadInfo(url: string, preferProgressive: boolean = false): Promise<SmartDownloadInfo> {
  try {
    const response = await fetch(`${API_BASE}/api/smart-download-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: url,
        prefer_progressive: preferProgressive,
      }),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))
      throw new YouTubeApiError(errorData.detail, response.status)
    }

    const data: SmartDownloadInfo = await response.json()
    return data
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new YouTubeApiError("Unable to connect to the server. Please make sure the backend is running.")
    }

    throw new YouTubeApiError("An unexpected error occurred while analyzing video.")
  }
}

export async function smartDownload(
  url: string, 
  preferProgressive: boolean = false,
  onProgress?: (progress: SmartDownloadProgress) => void
): Promise<Blob> {
  try {
    if (onProgress) {
      onProgress({ stage: 'analyzing', progress: 10, message: 'Analyzing video streams...' })
    }
    
    // Start download request
    const response = await fetch(`${API_BASE}/api/smart-download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: url,
        prefer_progressive: preferProgressive,
      }),
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }))
      throw new YouTubeApiError(errorData.detail, response.status)
    }

    // For progress tracking, we'll simulate progress based on typical download behavior
    if (onProgress) {
      let currentProgress = 15
      let currentStage: SmartDownloadProgress['stage'] = 'downloading-video'
      let progressMessage = 'Downloading video...'
      
      // Create more realistic progress simulation
      const progressInterval = setInterval(() => {
        if (currentProgress < 90) {
          // Slower progress at the beginning, faster in the middle
          const increment = currentProgress < 30 ? Math.random() * 5 + 2 : 
                           currentProgress < 70 ? Math.random() * 8 + 4 :
                           Math.random() * 4 + 1
          
          currentProgress += increment
          currentProgress = Math.min(currentProgress, 90) // Cap at 90%
          
          // Update stage based on progress
          if (currentProgress > 20 && currentProgress <= 50) {
            currentStage = 'downloading-video'
            progressMessage = 'Downloading video stream...'
          } else if (currentProgress > 50 && currentProgress <= 75) {
            currentStage = 'downloading-audio'
            progressMessage = 'Downloading audio stream...'
          } else if (currentProgress > 75) {
            currentStage = 'merging'
            progressMessage = 'Merging video and audio...'
          }
          
          onProgress({ stage: currentStage, progress: Math.round(currentProgress), message: progressMessage })
        }
      }, 500) // Update every 500ms for smoother progress
      
      // Wait for the actual blob download
      const blob = await response.blob()
      
      // Clear the interval and set completion
      clearInterval(progressInterval)
      onProgress({ stage: 'complete', progress: 100, message: 'Download complete!' })
      
      return blob
    } else {
      // No progress callback, just return the blob
      return await response.blob()
    }
  } catch (error) {
    if (onProgress) {
      const errorMessage = error instanceof YouTubeApiError ? error.message : 'Download failed'
      onProgress({ 
        stage: 'error', 
        progress: 0, 
        message: 'Download failed', 
        error: errorMessage 
      })
    }
    
    if (error instanceof YouTubeApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new YouTubeApiError("Unable to connect to the server. Please make sure the backend is running.")
    }

    throw new YouTubeApiError("An unexpected error occurred during smart download.")
  }
}
