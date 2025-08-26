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
    <div className="glass-card rounded-2xl border border-white/20 overflow-hidden animate-fade-in-up">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Link className="h-6 w-6 text-youtube-red animate-breathe" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            Paste YouTube Link
          </h2>
          <div className="ml-auto">
            <div className="badge variant-info text-xs px-3 py-1">
              Ready
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="youtube-input w-full text-lg px-6 py-4 text-white placeholder:text-gray-400 focus:scale-[1.02] transition-all duration-300"
              disabled={isLoading}
              aria-label="YouTube video URL"
              aria-describedby="url-help"
            />
            
            {/* Input Enhancement Indicators */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {url && !isLoading && (
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
              )}
              {isLoading && (
                <div className="pulse-loader">
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                </div>
              )}
            </div>
            
            {/* Focus Ring Enhancement */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-youtube-red/30 transition-colors duration-300 pointer-events-none"></div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="youtube-gradient flex-1 px-8 py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              aria-label={isLoading ? "Processing video..." : "Get video information"}
            >
              {/* Button Content */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Get Video</span>
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Link className="h-3 w-3" />
                    </div>
                  </>
                )}
              </span>
              
              {/* Shimmer Effect for Loading */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              )}
            </button>
            
            {/* Secondary Action Button */}
            {url && !isLoading && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="btn-glass px-4 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                aria-label="Clear URL"
              >
                <div className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300">
                  ×
                </div>
              </button>
            )}
          </div>
        </form>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mt-6 animate-shake">
            <div className="glass-card border border-error-500/30 bg-error-500/10 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-error-500 font-medium mb-1">Error occurred</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Help Text */}
        <div className="mt-6 text-center">
          <p id="url-help" className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-success-500 rounded-full"></div>
              <span>YouTube videos</span>
            </div>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-info-500 rounded-full"></div>
              <span>Playlists</span>
            </div>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-warning-500 rounded-full"></div>
              <span>Shorts</span>
            </div>
          </p>
        </div>
      </div>
      
      {/* Progress Indicator */}
      {isLoading && (
        <div className="h-1 bg-gradient-to-r from-youtube-red via-success-500 to-info-500 animate-shimmer"></div>
      )}
    </div>
  )
}
