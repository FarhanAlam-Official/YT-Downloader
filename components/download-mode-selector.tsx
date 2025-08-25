"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RecommendedBadge } from "@/components/recommended-badge"
import { Zap, Settings, CheckCircle, Info } from "lucide-react"

export type DownloadMode = "smart" | "manual"

interface DownloadModeSelectorProps {
  mode: DownloadMode
  onModeChange: (mode: DownloadMode) => void
  disabled?: boolean
}

export function DownloadModeSelector({ 
  mode, 
  onModeChange, 
  disabled = false 
}: DownloadModeSelectorProps) {
  return (
    <div className="space-y-6 animate-fade-in-up overflow-visible">
      {/* Enhanced Header */}
      <div className="text-center">
        <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Choose Download Method</h3>
        <p className="text-muted-foreground">
          Select how you want to download your video
        </p>
      </div>

      {/* Enhanced Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6 pt-8 overflow-visible">
        {/* Smart Download Mode */}
        <div className="relative overflow-visible">
        <div 
          className={`stream-selector-card relative p-6 sm:p-8 cursor-pointer transition-all duration-500 !overflow-visible ${
            mode === "smart" 
              ? "border-success-500/50 bg-success-500/10 shadow-lg shadow-success-500/20" 
              : "hover:border-success-500/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("smart")}
        >
          {/* Recommended Badge - 50% overlapping the top-left corner */}
          <div className="absolute -top-5 -left-5 sm:-top-6 sm:-left-6 z-30">
            <RecommendedBadge animated={true} />
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Icon and Title */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-white dark:text-white light:text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 dark:text-foreground light:text-gray-800">Smart Download</h4>
                <p className="text-success-foreground font-medium text-sm sm:text-base dark:text-success-foreground light:text-success-700">One-click best quality</p>
              </div>
              {mode === "smart" && (
                <div className="checkmark w-5 h-5 sm:w-6 sm:h-6 self-center"></div>
              )}
            </div>

            {/* Enhanced Features */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse flex-shrink-0" />
                <span>Automatically selects highest quality</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse flex-shrink-0" />
                <span>Merges video + audio into single file</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse flex-shrink-0" />
                <span>No technical knowledge required</span>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <button
              className={`youtube-gradient w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative ${
                mode === "smart" 
                  ? "bg-gradient-to-r from-success-500 to-success-600 ring-2 ring-success-500/30" 
                  : "bg-gradient-to-r from-success-500/30 to-success-600/30 hover:from-success-500/50 hover:to-success-600/50 hover:ring-2 hover:ring-success-500/20"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("smart")
              }}
            >
              {mode === "smart" ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 dark:text-white light:text-gray-800" />
                  Selected
                </span>
              ) : (
                "Choose Smart Download"
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Manual Selection Mode */}
        <div 
          className={`stream-selector-card relative p-6 sm:p-8 cursor-pointer transition-all duration-500 ${
            mode === "manual" 
              ? "border-info-500/50 bg-info-500/10 shadow-lg shadow-info-500/20" 
              : "hover:border-info-500/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("manual")}
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Enhanced Icon and Title */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-col sm:flex-row">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-info-500 to-info-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Settings className="h-6 w-6 sm:h-7 sm:w-7 text-white dark:text-white light:text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 dark:text-foreground light:text-gray-800">Manual Selection</h4>
                <p className="text-info-foreground font-medium text-sm sm:text-base dark:text-info-foreground light:text-info-700">Full control over formats</p>
              </div>
              {mode === "manual" && (
                <div className="checkmark w-5 h-5 sm:w-6 sm:h-6 self-center"></div>
              )}
            </div>

            {/* Enhanced Features */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-info-400 rounded-full flex-shrink-0" />
                <span>Choose specific quality and format</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-info-400 rounded-full flex-shrink-0" />
                <span>Access to all available streams</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <div className="w-2 h-2 bg-info-400 rounded-full flex-shrink-0" />
                <span>Advanced options for power users</span>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <button
              className={`btn-glass w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative ${
                mode === "manual" 
                  ? "bg-gradient-to-r from-success-500 to-success-600 border-success-500 ring-2 ring-success-500/30 text-white" 
                  : "border-2 border-success-600 bg-success-500/5 hover:bg-success-500/10 text-success-700 dark:text-success-200 shadow-sm hover:shadow-md"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("manual")
              }}
            >
              {mode === "manual" ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  Selected
                </span>
              ) : (
<span className="font-semibold text-foreground dark:text-success-200">Choose Manual Download</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Info Section */}
      {mode === "smart" && (
        <div className="stream-selector-card border border-success-500/30 bg-success-500/10 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-success-foreground dark:text-success-foreground light:text-success-700" />
            </div>
            <div>
              <p className="text-success-foreground font-semibold mb-2 dark:text-success-foreground light:text-success-700">Smart Download Process</p>
              <p className="text-success-foreground/90 leading-relaxed dark:text-success-foreground/90 light:text-success-700/90">
                We'll automatically find the best video quality, pair it with high-quality audio, 
                and merge them into a single MP4 file ready to play anywhere.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}