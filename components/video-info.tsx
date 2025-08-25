"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, User, Play } from "lucide-react"
import { type VideoMetadata, formatDuration, formatViewCount } from "@/lib/api"

interface VideoInfoProps {
  metadata: VideoMetadata
}

export function VideoInfo({ metadata }: VideoInfoProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="video-info-card animate-scale-in overflow-hidden border-2 border-white/10 hover:border-white/20 transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Beautiful Thumbnail Section */}
        <div className="relative flex-shrink-0 lg:w-96 group">
          <div className="relative overflow-hidden bg-gradient-to-br from-youtube-dark to-surface-secondary">
            {/* Consistent 16:9 Aspect Ratio Container */}
            <div className="aspect-video relative">
              {/* Loading Skeleton */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white/60" />
                    </div>
                  </div>
                </div>
              )}
              
              <img
                src={metadata.thumbnail || "/placeholder.svg"}
                alt={metadata.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 animate-gpu ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=180&width=320&text=Video+Thumbnail"
                  setImageError(true)
                  setImageLoaded(true)
                }}
              />
              
              {/* Beautiful Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-youtube-red/10 via-transparent to-brand-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Enhanced Play Button with Glow */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-sm">
                <div className="relative">
                  <div className="youtube-gradient w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl animate-breathe hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-current ml-1" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-youtube-red/30 blur-xl animate-pulse"></div>
                </div>
              </div>
              
              {/* Premium Duration Badge */}
              {metadata.duration > 0 && (
                <div className="absolute bottom-3 right-3">
                  <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm font-mono shadow-lg">
                    {formatDuration(metadata.duration)}
                  </div>
                </div>
              )}
              
              {/* Quality Indicator */}
              {metadata.streams.some(stream => stream.quality && stream.quality.includes('1080')) && (
                <div className="absolute top-3 right-3">
                  <div className="px-2 py-1 bg-youtube-red/90 backdrop-blur-md rounded-md text-white text-xs font-bold shadow-lg">
                    HD
                  </div>
                </div>
              )}
            </div>
            
            {/* Beautiful Enhanced Content Below Thumbnail */}
            <div className="relative p-4 sm:p-6 space-y-4 bg-gradient-to-b from-black/60 via-black/80 to-black/95 backdrop-blur-sm [.light_&]:from-gray-100 [.light_&]:via-gray-200 [.light_&]:to-gray-300 [.light_&]:text-[--icon-primary]">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-youtube-red to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-success-500 to-transparent rounded-full blur-2xl"></div>
              </div>
              
              {/* Enhanced Stats Row with Beautiful Animations */}
              <div className="relative z-10 flex items-center justify-between gap-3 mb-4 [.light_&]:text-[--icon-primary]">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:scale-105 transition-all duration-300 group">
                    <div className="relative">
                      <Clock className="h-4 w-4 text-foreground group-hover:text-youtube-red transition-colors duration-300 [.light_&]:text-[--icon-primary]" />
                      <div className="absolute inset-0 bg-youtube-red/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm font-mono text-foreground font-medium tracking-wide [.light_&]:text-[--icon-primary]">{formatDuration(metadata.duration)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg hover:scale-105 transition-all duration-300 group">
                    <div className="relative">
                      <Eye className="h-4 w-4 text-foreground group-hover:text-success-400 transition-colors duration-300 [.light_&]:text-[--icon-primary]" />
                      <div className="absolute inset-0 bg-success-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground [.light_&]:text-[--icon-primary]">{formatViewCount(metadata.view_count)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {metadata.streams.some(stream => stream.quality && stream.quality.includes('1080')) && (
                    <div className="px-3 py-1.5 bg-gradient-to-r from-youtube-red to-youtube-red-hover rounded-lg text-white text-xs font-bold shadow-lg border border-youtube-red/50 hover:scale-105 transition-all duration-300">
                      HD
                    </div>
                  )}
                  <div className="px-3 py-1.5 bg-gradient-to-r from-success-500 to-success-600 rounded-lg text-white text-xs font-bold shadow-lg border border-success-500/50 hover:scale-105 transition-all duration-300">
                    {metadata.streams.length}
                  </div>
                </div>
              </div>
              
              {/* Premium Video Title Section with Hover Effects */}
              <div className="relative z-10 space-y-3 group cursor-default [.light_&]:text-[--icon-primary]">
                <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-youtube-red group-hover:via-foreground group-hover:to-youtube-red group-hover:bg-clip-text transition-all duration-500">
                  {metadata.title}
                </h3>
                
                {/* Enhanced Channel Info with Premium Styling */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-youtube-red via-brand-red-600 to-youtube-red-hover flex items-center justify-center shadow-lg ring-2 ring-white/20 hover:ring-youtube-red/50 transition-all duration-300">
                      <User className="h-3.5 w-3.5 text-white [.light_&]:text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success-500 rounded-full border-2 border-black ring-1 ring-white/20"></div>
                    <div className="absolute inset-0 rounded-full bg-youtube-red/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-muted-foreground font-medium truncate block hover:text-foreground transition-colors duration-300">{metadata.uploader}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-success-foreground font-semibold tracking-wide">Verified</span>
                  </div>
                </div>
              </div>
              
              {/* Beautiful Interactive Action Buttons */}
              <div className="relative z-10 flex gap-2 sm:gap-3 pt-2 [.light_&]:text-[--icon-primary]">
                <div className="flex-1 group">
                  <div className="relative overflow-hidden px-3 sm:px-4 py-2.5 bg-gradient-to-r from-youtube-red/25 via-youtube-red/20 to-youtube-red-hover/25 border border-youtube-red/40 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-youtube-red/60 hover:shadow-lg hover:shadow-youtube-red/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-youtube-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-youtube-red to-youtube-red-hover rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                        <Play className="h-2.5 w-2.5 text-white fill-current" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-youtube-red group-hover:text-foreground transition-colors duration-300">Preview</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 group">
                  <div className="relative overflow-hidden px-3 sm:px-4 py-2.5 bg-gradient-to-r from-info-500/25 via-info-500/20 to-info-600/25 border border-info-500/40 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-info-500/60 hover:shadow-lg hover:shadow-info-500/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-info-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-info-500 to-info-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                        <Eye className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-info-foreground group-hover:text-foreground transition-colors duration-300">Details</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Premium Quality & Format Indicators */}
              <div className="relative z-10 flex flex-wrap gap-2 pt-2 [.light_&]:text-[--icon-primary]">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-success-500/20 to-success-600/20 border border-success-500/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-success-foreground">Ready</span>
                </div>
                
                {metadata.streams.filter(stream => stream.type === 'video').length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-youtube-red/20 to-youtube-red-hover/20 border border-youtube-red/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
                    <div className="w-2 h-2 bg-youtube-red rounded-full"></div>
                    <span className="text-xs font-semibold text-youtube-red">Video</span>
                  </div>
                )}
                
                {metadata.streams.filter(stream => stream.type === 'audio').length > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-warning-500/20 to-warning-600/20 border border-warning-500/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
                    <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-warning-foreground">Audio</span>
                  </div>
                )}
              </div>
              
              {/* Elegant Download Status with Animated Progress */}
              <div className="relative z-10 pt-3 border-t border-white/10 [.light_&]:border-gray-300 [.light_&]:text-[--icon-primary]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Download Status</span>
                  <span className="text-xs font-bold text-success-foreground">Ready to Start</span>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-youtube-red/20 via-youtube-red/40 to-success-500/20 opacity-50 animate-pulse"></div>
                  <div className="h-full bg-gradient-to-r from-youtube-red via-brand-red-500 to-success-500 rounded-full shadow-sm" style={{width: '100%'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Video Details */}
        <div className="flex-1 p-6 lg:p-8 space-y-6">
          {/* Premium Title Section */}
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-foreground leading-tight line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-default">
              {metadata.title}
            </h2>
            
            {/* Enhanced Channel Info with Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-youtube-red via-brand-red-600 to-youtube-red-hover flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-youtube-dark"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg sm:text-xl font-semibold text-foreground truncate">{metadata.uploader}</p>
                <p className="text-sm text-muted-foreground">Video Creator</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-success-foreground">Verified</p>
              </div>
            </div>
          </div>

          {/* Beautiful Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metadata.duration > 0 && (
              <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-info-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-info-500 to-info-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Duration</p>
                    <p className="text-lg font-bold text-foreground">{formatDuration(metadata.duration)}</p>
                  </div>
                </div>
              </div>
            )}

            {metadata.view_count > 0 && (
              <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-success-500/30 transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Views</p>
                    <p className="text-lg font-bold text-foreground">{formatViewCount(metadata.view_count)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="glass-card p-4 rounded-xl border border-white/10 hover:border-youtube-red/30 transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-youtube-red to-youtube-red-hover flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Formats</p>
                  <p className="text-lg font-bold text-foreground">{metadata.streams.length} available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-500/20 to-success-600/20 border border-success-500/30 rounded-full backdrop-blur-sm">
              <div className="checkmark w-4 h-4"></div>
              <span className="text-sm font-medium text-success-foreground">Ready to Download</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-info-500/20 to-info-600/20 border border-info-500/30 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-info-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-info-foreground">Multiple Qualities</span>
            </div>
            
            {metadata.streams.some(stream => stream.quality && stream.quality.includes('1080')) && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-youtube-red/20 to-youtube-red-hover/20 border border-youtube-red/30 rounded-full backdrop-blur-sm">
                <span className="text-sm font-bold text-youtube-red">HD Quality</span>
              </div>
            )}
            
            {metadata.streams.some(stream => stream.type === 'audio') && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warning-500/20 to-warning-600/20 border border-warning-500/30 rounded-full backdrop-blur-sm">
                <span className="text-sm font-medium text-warning-foreground">Audio Available</span>
              </div>
            )}
          </div>

          {/* Beautiful Action Hint */}
          <div className="glass-card border border-white/10 rounded-xl p-5 bg-gradient-to-r from-youtube-red/5 via-transparent to-success-500/5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-youtube-red to-success-500 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-youtube-red to-success-500 animate-ping opacity-30"></div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground mb-1">Ready for Download</p>
                <p className="text-sm text-muted-foreground">Choose your preferred download method below to get started</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-success-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-success-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
