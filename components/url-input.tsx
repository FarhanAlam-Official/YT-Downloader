"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link, Loader2, AlertCircle } from "lucide-react"
import { fetchVideoMetadata, type VideoMetadata, YouTubeApiError } from "@/lib/api"

// Regular expression for validating YouTube URLs
const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/

interface UrlInputProps {
  onVideoFetched: (metadata: VideoMetadata, url: string) => void
}

/**
 * Validates if a string is a valid YouTube URL
 */
const isValidYoutubeUrl = (url: string): boolean => {
  return YOUTUBE_URL_REGEX.test(url.trim())
}

export function UrlInput({ onVideoFetched }: UrlInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null)

  // Validate URL on change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value
    setUrl(newUrl)
    
    if (newUrl.trim()) {
      setIsValidUrl(isValidYoutubeUrl(newUrl.trim()))
    } else {
      setIsValidUrl(null) // Reset validation state when URL is empty
    }
    
    // Clear error when user starts typing again
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUrl = url.trim()
    if (!trimmedUrl) return

    // Validate URL format first
    if (!isValidYoutubeUrl(trimmedUrl)) {
      setError("Please enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const metadata = await fetchVideoMetadata(trimmedUrl)
      onVideoFetched(metadata, trimmedUrl)
    } catch (error) {
      if (error instanceof YouTubeApiError) {
        // More user-friendly error messages based on error content
        if (error.message.includes("unavailable")) {
          setError("This video is unavailable or could not be found. Please check the URL and try again.")
        } else if (error.message.includes("private")) {
          setError("This video is private and cannot be accessed. Please try a different video.")
        } else if (error.message.includes("livestream")) {
          setError("Livestreams are not supported. Please try a different video.")
        } else if (error.statusCode && error.statusCode === 429) {
          setError("Too many requests. Please wait a moment before trying again.")
        } else if (error.statusCode && error.statusCode >= 500) {
          setError("Server error. Our systems are experiencing issues. Please try again later.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred. Please check your connection and try again.")
      }
      console.error("Error fetching video metadata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Beautiful Modern Input Card */}
      <div className="input-card animate-fade-in-up overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all duration-300">
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
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-1">
                    Paste YouTube Link
                  </h2>
                  <p className="text-sm text-muted-foreground">Get started by entering a YouTube URL</p>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/20 rounded-full border border-success-500/40 backdrop-blur-sm shadow-sm">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-success-foreground font-semibold">Ready to process your video</span>
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
                    onChange={handleUrlChange}
                    className={`w-full text-lg px-8 py-6 text-gray-900 placeholder:text-gray-500 bg-white border-2 ${isValidUrl === false ? 'border-error-500/50' : isValidUrl === true ? 'border-success-500/50' : 'border-gray-300'} rounded-2xl focus:border-youtube-red/50 focus:outline-none transition-all duration-300 backdrop-blur-sm hover:bg-gray-50 focus:bg-white animate-gpu dark:text-foreground dark:placeholder:text-muted-foreground dark:bg-black/30 dark:hover:bg-black/40 dark:focus:bg-black/50 ${isValidUrl === false ? 'dark:border-error-500/50' : isValidUrl === true ? 'dark:border-success-500/50' : 'dark:border-white/20'}`}
                    disabled={isLoading}
                    aria-label="YouTube video URL"
                    aria-describedby="url-help"
                  />
                  
                  {/* Enhanced Input Indicators */}
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
                    {url && !isLoading && isValidUrl === true && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-success-foreground font-semibold">Valid URL</span>
                      </div>
                    )}
                    {url && !isLoading && isValidUrl === false && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-error-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-error-foreground font-medium">Invalid URL</span>
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex items-center gap-2">
                        <div className="pulse-loader">
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                          <div className="pulse-dot"></div>
                        </div>
                        <span className="text-xs text-info-foreground font-medium">Processing...</span>
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
                  disabled={!url.trim() || isLoading || isValidUrl === false}
                  className="flex-1 relative overflow-hidden px-8 py-5 text-lg font-bold rounded-2xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed animate-gpu"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', /* Darker, more readable green */
                    boxShadow: '0 8px 32px rgba(5, 150, 105, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
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
                    className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group backdrop-blur-sm dark:bg-white/10 dark:border-white/20 dark:hover:bg-white/15 dark:hover:border-white/30 light:bg-gray-200 light:border-gray-300 light:hover:bg-gray-300 light:hover:border-gray-400 relative hover:ring-2 hover:ring-white/30 light:hover:ring-gray-400/30"
                    aria-label="Clear URL"
                  >
                    <div className="flex items-center justify-center gap-2 text-white dark:text-white light:text-gray-700">
                      <span className="text-sm font-medium group-hover:text-gray-200 dark:group-hover:text-gray-200 light:group-hover:text-gray-900">Clear</span>
                      <div className="w-5 h-5 text-gray-400 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white light:text-gray-500 light:group-hover:text-gray-700 transition-colors duration-300 font-bold">
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
                      <AlertCircle className="h-7 w-7 text-error-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-error-foreground font-bold mb-3 text-xl">Oops! Something went wrong</p>
                      <p className="text-error-foreground/90 leading-relaxed text-base">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="mt-4 px-4 py-2 bg-error-500/20 hover:bg-error-500/30 border border-error-500/40 rounded-xl text-error-foreground text-sm font-medium transition-all duration-300"
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
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                <span className="text-base text-foreground font-semibold tracking-wide">Supported Formats</span>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
              </div>
              <div id="url-help" className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-success-500/20 to-success-600/15 rounded-2xl border border-success-500/40 hover:border-success-500/60 hover:bg-gradient-to-br hover:from-success-500/25 hover:to-success-600/20 transition-all duration-300 group shadow-sm">
                  <div className="w-3 h-3 bg-success-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-foreground font-semibold group-hover:text-foreground transition-colors duration-300">YouTube Videos</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-info-500/15 to-info-600/10 rounded-2xl border border-info-500/30 hover:border-info-500/50 hover:bg-gradient-to-br hover:from-info-500/20 hover:to-info-600/15 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-info-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-foreground font-medium group-hover:text-foreground transition-colors duration-300">Playlists</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-warning-500/15 to-warning-600/10 rounded-2xl border border-warning-500/30 hover:border-warning-500/50 hover:bg-gradient-to-br hover:from-warning-500/20 hover:to-warning-600/15 transition-all duration-300 group">
                  <div className="w-3 h-3 bg-warning-500 rounded-full group-hover:animate-pulse"></div>
                  <span className="text-foreground font-medium group-hover:text-foreground transition-colors duration-300">YouTube Shorts</span>
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
