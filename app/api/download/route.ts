import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

/**
 * POST handler for the download API route
 * Simulates video download by serving sample files or generating mock content
 * @param request - Next.js request object containing download parameters
 * @returns NextResponse with file content or error message
 */
export async function POST(request: NextRequest) {
  try {
    // Extract download parameters from request body
    const { video_url, stream_id, filename } = await request.json()

    // Validate required parameters
    if (!video_url || !stream_id) {
      return NextResponse.json({ detail: "Video URL and stream ID are required" }, { status: 400 })
    }

    // Default sample file configuration
    let sampleFile = "sample-720p.mp4"
    let contentType = "video/mp4"

    // Map different stream IDs to appropriate sample files
    if (stream_id.includes("480p")) {
      sampleFile = "sample-480p.mp4"
    } else if (stream_id.includes("audio") || stream_id.includes("mp3")) {
      sampleFile = "sample-audio.mp3"
      contentType = "audio/mpeg"
    }

    try {
      // Try to read the actual sample file from public directory
      const filePath = join(process.cwd(), "public", "samples", sampleFile)
      const fileBuffer = await readFile(filePath)
      const blob = new Blob([fileBuffer], { type: contentType })

      // Determine download filename
      const downloadFilename = filename || `video_${stream_id}.${contentType.includes("audio") ? "mp3" : "mp4"}`

      // Return file as downloadable response
      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${downloadFilename}"`,
          "Content-Length": blob.size.toString(),
        },
      })
    } catch (fileError) {
      console.log("[v0] Sample file not found, using fallback mock data")

      // Create a more realistic video-like mock file (5MB for video, 3MB for audio)
      const fileSize = contentType.includes("audio") ? 1024 * 1024 * 3 : 1024 * 1024 * 5
      const mockContent = new Uint8Array(fileSize)

      // Add some realistic file headers for MP4/MP3
      if (contentType.includes("video")) {
        // Basic MP4 header bytes
        const mp4Header = [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]
        mp4Header.forEach((byte, index) => {
          if (index < mockContent.length) mockContent[index] = byte
        })
      } else {
        // Basic MP3 header bytes
        const mp3Header = [0xff, 0xfb, 0x90, 0x00]
        mp3Header.forEach((byte, index) => {
          if (index < mockContent.length) mockContent[index] = byte
        })
      }

      // Fill rest with pattern data instead of random
      for (let i = 8; i < mockContent.length; i++) {
        mockContent[i] = i % 256
      }

      const blob = new Blob([mockContent], { type: contentType })
      const downloadFilename = filename || `video_${stream_id}.${contentType.includes("audio") ? "mp3" : "mp4"}`

      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${downloadFilename}"`,
          "Content-Length": blob.size.toString(),
        },
      })
    }
  } catch (error) {
    console.error("Error downloading video:", error)
    return NextResponse.json({ detail: "Failed to download video" }, { status: 500 })
  }
}
