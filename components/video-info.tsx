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
    <Card className="youtube-card border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 lg:w-80">
            <img
              src={metadata.thumbnail || "/placeholder.svg"}
              alt={metadata.title}
              className="w-full h-48 lg:h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=180&width=320&text=Video+Thumbnail"
              }}
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <Play className="h-12 w-12 text-white fill-current" />
            </div>
          </div>

          {/* Video Details */}
          <div className="flex-1 p-6 space-y-4">
            <h2 className="text-xl lg:text-2xl font-serif font-bold text-white line-clamp-2 leading-tight">
              {metadata.title}
            </h2>

            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{metadata.uploader}</span>
              </div>

              {metadata.duration > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{formatDuration(metadata.duration)}</span>
                </div>
              )}

              {metadata.view_count > 0 && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span>{formatViewCount(metadata.view_count)}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                {metadata.streams.length} formats available
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                Ready to download
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
