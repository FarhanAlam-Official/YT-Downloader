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
