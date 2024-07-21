"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Loader2, AlertCircle } from "lucide-react"
import { fetchVideoMetadata, type VideoMetadata, YouTubeApiError } from "@/lib/api"

interface UrlInputProps {
  onVideoFetched: (metadata: VideoMetadata, url: string) => void
}

export function UrlInput({ onVideoFetched }: UrlInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const metadata = await fetchVideoMetadata(url.trim())
      onVideoFetched(metadata, url.trim())
    } catch (error) {
      if (error instanceof YouTubeApiError) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      console.error("Error fetching video metadata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="youtube-card border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white font-serif text-xl">
          <Link className="h-5 w-5 text-red-500" />
          Paste YouTube Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 youtube-input text-white placeholder:text-gray-400 border-gray-600 focus:border-red-500 focus:ring-red-500"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="youtube-red hover:youtube-red text-white font-medium px-6 transition-all duration-200 hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Get Video"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 text-center">Supports YouTube videos and playlists</div>
      </CardContent>
    </Card>
  )
}
