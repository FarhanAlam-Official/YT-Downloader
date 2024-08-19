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

    // For now, we'll simulate progress since the backend doesn't support streaming progress yet
    // In a real implementation, you'd use Server-Sent Events or WebSockets
    if (onProgress) {
      onProgress({ stage: 'analyzing', progress: 10, message: 'Analyzing video streams...' })
      
      // Simulate progress updates
      setTimeout(() => {
        onProgress({ stage: 'downloading-video', progress: 30, message: 'Downloading video...' })
      }, 500)
      
      setTimeout(() => {
        onProgress({ stage: 'downloading-audio', progress: 60, message: 'Downloading audio...' })
      }, 1500)
      
      setTimeout(() => {
        onProgress({ stage: 'merging', progress: 85, message: 'Merging video and audio...' })
      }, 2500)
    }

    const blob = await response.blob()
    
    if (onProgress) {
      onProgress({ stage: 'complete', progress: 100, message: 'Download complete!' })
    }
    
    return blob
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
