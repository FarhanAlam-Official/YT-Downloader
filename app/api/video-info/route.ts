import { type NextRequest, NextResponse } from "next/server"

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url - YouTube video URL
 * @returns Video ID string or null if not found
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * POST handler for the video-info API route
 * Fetches video metadata and available streams from YouTube or returns mock data
 * @param request - Next.js request object containing video URL
 * @returns NextResponse with video metadata or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Extract URL from request body
    const { url } = await request.json()

    // Validate URL parameter
    if (!url) {
      return NextResponse.json({ detail: "URL is required" }, { status: 400 })
    }

    // Validate YouTube URL and extract video ID
    const videoId = extractVideoId(url)
    if (!videoId) {
      return NextResponse.json({ detail: "Invalid YouTube URL" }, { status: 400 })
    }

    try {
      // Attempt to fetch video metadata using YouTube's oEmbed API
      const oembedResponse = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)

      if (!oembedResponse.ok) {
        throw new Error("Video not found or private")
      }

      const oembedData = await oembedResponse.json()

      // Construct thumbnail URL using YouTube's image service
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

      // Prepare video data with mock streams (since actual stream fetching is done server-side)
      const videoData = {
        title: oembedData.title,
        duration: 0, // oEmbed doesn't provide duration
        thumbnail: thumbnailUrl,
        uploader: oembedData.author_name,
        view_count: 0, // Not available in oEmbed
        streams: [
          // Video formats
          {
            id: "137+140",
            type: "video" as const,
            quality: "1080p",
            format: "mp4",
            filesize: "~85 MB",
            codec: "avc1.640028, mp4a.40.2",
            url: url,
          },
          {
            id: "22",
            type: "video" as const,
            quality: "720p",
            format: "mp4",
            filesize: "~45 MB",
            codec: "avc1.64001F, mp4a.40.2",
            url: url,
          },
          {
            id: "136+140",
            type: "video" as const,
            quality: "720p60",
            format: "mp4",
            filesize: "~65 MB",
            codec: "avc1.4d401f, mp4a.40.2",
            url: url,
          },
          {
            id: "18",
            type: "video" as const,
            quality: "360p",
            format: "mp4",
            filesize: "~23 MB",
            codec: "avc1.42001E, mp4a.40.2",
            url: url,
          },
          {
            id: "135+140",
            type: "video" as const,
            quality: "480p",
            format: "mp4",
            filesize: "~35 MB",
            codec: "avc1.4d401e, mp4a.40.2",
            url: url,
          },
          {
            id: "134+140",
            type: "video" as const,
            quality: "360p60",
            format: "mp4",
            filesize: "~40 MB",
            codec: "avc1.4d401e, mp4a.40.2",
            url: url,
          },
          // Audio formats
          {
            id: "140",
            type: "audio" as const,
            quality: "128kbps",
            format: "m4a",
            filesize: "~4 MB",
            codec: "mp4a.40.2",
            url: url,
          },
          {
            id: "251",
            type: "audio" as const,
            quality: "160kbps",
            format: "webm",
            filesize: "~5 MB",
            codec: "opus",
            url: url,
          },
          {
            id: "250",
            type: "audio" as const,
            quality: "70kbps",
            format: "webm",
            filesize: "~2.5 MB",
            codec: "opus",
            url: url,
          },
        ],
      }

      return NextResponse.json(videoData)
    } catch (fetchError) {
      // Fallback to mock data if oEmbed API fails
      const mockData = {
        title: "YouTube Video",
        duration: 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        uploader: "YouTube Channel",
        view_count: 0,
        streams: [
          {
            id: "137+140",
            type: "video" as const,
            quality: "1080p",
            format: "mp4",
            filesize: "~85 MB",
            codec: "avc1.640028, mp4a.40.2",
            url: url,
          },
          {
            id: "22",
            type: "video" as const,
            quality: "720p",
            format: "mp4",
            filesize: "~45 MB",
            codec: "avc1.64001F, mp4a.40.2",
            url: url,
          },
          {
            id: "136+140",
            type: "video" as const,
            quality: "720p60",
            format: "mp4",
            filesize: "~65 MB",
            codec: "avc1.4d401f, mp4a.40.2",
            url: url,
          },
          {
            id: "18",
            type: "video" as const,
            quality: "360p",
            format: "mp4",
            filesize: "~23 MB",
            codec: "avc1.42001E, mp4a.40.2",
            url: url,
          },
          {
            id: "135+140",
            type: "video" as const,
            quality: "480p",
            format: "mp4",
            filesize: "~35 MB",
            codec: "avc1.4d401e, mp4a.40.2",
            url: url,
          },
          {
            id: "134+140",
            type: "video" as const,
            quality: "360p60",
            format: "mp4",
            filesize: "~40 MB",
            codec: "avc1.4d401e, mp4a.40.2",
            url: url,
          },
          {
            id: "140",
            type: "audio" as const,
            quality: "128kbps",
            format: "m4a",
            filesize: "~4 MB",
            codec: "mp4a.40.2",
            url: url,
          },
          {
            id: "251",
            type: "audio" as const,
            quality: "160kbps",
            format: "webm",
            filesize: "~5 MB",
            codec: "opus",
            url: url,
          },
          {
            id: "250",
            type: "audio" as const,
            quality: "70kbps",
            format: "webm",
            filesize: "~2.5 MB",
            codec: "opus",
            url: url,
          },
        ],
      }
      return NextResponse.json(mockData)
    }
  } catch (error) {
    console.error("Error processing video info:", error)
    return NextResponse.json({ detail: "Failed to process video information" }, { status: 500 })
  }
}