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
    <div className="relative">
      {/* Beautiful Modern Input Card */}
      <div className="youtube-card animate-fade-in-up overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="relative">
          {/* Gradient Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-youtube-red/5 via-transparent to-success-500/5 opacity-50"></div>
          
          <div className="relative p-8 sm:p-10">
            {/* Enhanced Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-youtube-red to-brand-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Link className="h-6 w-6 text-white animate-breathe" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full animate-pulse border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                    Paste YouTube Link
                  </h2>
                  <p className="text-sm text-gray-400">Get started by entering a YouTube URL</p>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/20 rounded-full border border-success-500/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-300 font-medium">Ready to process your video</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Beautiful Input Field */}
              <div className="relative group">
                {/* Input Background with Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full text-lg px-8 py-6 text-white placeholder:text-gray-500 bg-black/30 border-2 border-white/20 rounded-2xl focus:border-youtube-red/50 focus:outline-none transition-all duration-300 backdrop-blur-sm hover:bg-black/40 focus:bg-black/50 animate-gpu"
                    disabled={isLoading}
                    aria-label="YouTube video URL"
                    aria-describedby="url-help"
                  />
                  
                  {/* Enhanced Input Indicators */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                    {url && !isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-success-400 font-medium">Valid URL</span>
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="pulse-loader">
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                        </div>
                        <span className="text-xs text-info-400 font-medium">Processing...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Focus Ring */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-focus-within:border-youtube-red/40 transition-colors duration-300 pointer-events-none"></div>
                  
                  {/* Beautiful Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-youtube-red/10 via-success-500/10 to-info-500/10 rounded-2xl blur-xl"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="flex-1 relative overflow-hidden px-8 py-5 text-lg font-bold rounded-2xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed animate-gpu"
                  style={{
                    background: 'linear-gradient(135deg, #00D084 0%, #00B874 100%)',
                    boxShadow: '0 8px 32px rgba(0, 208, 132, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                  aria-label={isLoading ? "Processing video..." : "Get video information"}
                >
                  {/* Button Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Processing Video...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Video Info</span>
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Link className="h-4 w-4" />
                        </div>
                      </>
                    )}
                  </span>
                  
                  {/* Enhanced Shimmer Effect for Loading */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  )}
                </button>
                
                {/* Beautiful Clear Button */}
                {url && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setUrl('')}
                    className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group backdrop-blur-sm"
                    aria-label="Clear URL"
                  >
                    <div className="flex items-center justify-center gap-2 text-white">
                      <span className="text-sm font-medium group-hover:text-gray-200">Clear</span>
                      <div className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300 font-bold">
                        ×
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </form>

            {/* Premium Enhanced Error Display */}
            {error && (
              <div className="mt-10 animate-shake">
                <div className="bg-gradient-to-br from-error-500/15 via-error-500/10 to-error-600/15 border-2 border-error-500/40 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-error-500/30 to-error-600/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <AlertCircle className="h-7 w-7 text-error-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-error-300 font-bold mb-3 text-xl">Oops! Something went wrong</p>
                      <p className="text-error-100 leading-relaxed text-base">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="mt-4 px-4 py-2 bg-error-500/20 hover:bg-error-500/30 border border-error-500/40 rounded-xl text-error-300 text-sm font-medium transition-all duration-300"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Help Text with Premium Styling */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span className="text-base text-gray-300 font-semibold tracking-wide">Supported Formats</span>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
              </div>
              <div id="url-help" className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-success-500/15 to-success-600/10 rounded-2xl border border-success-500/30 hover:border-success-500/50 hover:bg-gradient-to-br hover:from-success-500/20 hover:to-success-600/15 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-success-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">YouTube Videos</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-info-500/15 to-info-600/10 rounded-2xl border border-info-500/30 hover:border-info-500/50 hover:bg-gradient-to-br hover:from-info-500/20 hover:to-info-600/15 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-info-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">Playlists</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-warning-500/15 to-warning-600/10 rounded-2xl border border-warning-500/30 hover:border-warning-500/50 hover:bg-gradient-to-br hover:from-warning-500/20 hover:to-warning-600/15 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-warning-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-gray-200 font-medium group-hover:text-white transition-colors duration-300">YouTube Shorts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress Indicator with Premium Effects */}
        {isLoading && (
          <div className="absolute bottom-0 inset-x-0 h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-youtube-red via-success-500 via-info-500 to-warning-500 animate-shimmer shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  )
}
