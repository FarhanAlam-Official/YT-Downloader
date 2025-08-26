"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye, User, Play } from "lucide-react"
import { type VideoMetadata, formatDuration, formatViewCount } from "@/lib/api"

interface VideoInfoProps {
  metadata: VideoMetadata
}

export function VideoInfo({ metadata }: VideoInfoProps) {
  return (
    <div className="glass-card rounded-2xl border border-white/20 overflow-hidden animate-scale-in">
      <div className="flex flex-col lg:flex-row">
        {/* Enhanced Thumbnail */}
        <div className="relative flex-shrink-0 lg:w-80 group">
          <div className="relative overflow-hidden">
            <img
              src={metadata.thumbnail || "/placeholder.svg"}
              alt={metadata.title}
              className="w-full h-48 lg:h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=180&width=320&text=Video+Thumbnail"
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm">
              <div className="youtube-gradient w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-breathe">
                <Play className="h-8 w-8 text-white fill-current ml-1" />
              </div>
            </div>
            
            {/* Duration Badge */}
            {metadata.duration > 0 && (
              <div className="absolute bottom-4 right-4 badge variant-info px-3 py-1.5 text-sm font-mono">
                {formatDuration(metadata.duration)}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Video Details */}
        <div className="flex-1 p-8 space-y-6">
          {/* Title Section */}
          <div className="space-y-3">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-white line-clamp-2 leading-tight">
              {metadata.title}
            </h2>
            
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-youtube-red to-brand-red-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-medium text-gray-300">{metadata.uploader}</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metadata.duration > 0 && (
              <div className="glass-card rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-info-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-semibold text-white">{formatDuration(metadata.duration)}</p>
                </div>
              </div>
            )}

            {metadata.view_count > 0 && (
              <div className="glass-card rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Views</p>
                  <p className="font-semibold text-white">{formatViewCount(metadata.view_count)}</p>
                </div>
              </div>
            )}

            <div className="glass-card rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning-500/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Formats</p>
                <p className="font-semibold text-white">{metadata.streams.length} available</p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-3">
            <div className="badge variant-success animated">
              <div className="checkmark w-4 h-4 mr-2"></div>
              <span>Ready to Download</span>
            </div>
            
            <div className="badge variant-info">
              <div className="w-2 h-2 bg-info-500 rounded-full animate-pulse mr-2"></div>
              <span>Multiple Qualities</span>
            </div>
            
            {metadata.streams.some(stream => stream.quality && stream.quality.includes('1080')) && (
              <div className="badge variant-warning">
                <span className="font-mono">HD</span>
              </div>
            )}
            
            {metadata.streams.some(stream => stream.type === 'audio') && (
              <div className="badge variant-success">
                <span>Audio Available</span>
              </div>
            )}
          </div>

          {/* Action Hint */}
          <div className="flex items-center gap-3 text-sm text-gray-400 bg-gradient-to-r from-transparent via-white/5 to-transparent p-4 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>Choose your preferred download option below</span>
            <div className="ml-auto">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
