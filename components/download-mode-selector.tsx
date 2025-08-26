"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
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
    <div className="space-y-6 animate-fade-in-up">
      {/* Enhanced Header */}
      <div className="text-center">
        <h3 className="text-2xl font-serif font-bold text-white mb-3">Choose Download Method</h3>
        <p className="text-gray-400">
          Select how you want to download your video
        </p>
      </div>

      {/* Enhanced Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Smart Download Mode */}
        <div 
          className={`card-feature relative p-8 cursor-pointer transition-all duration-500 ${
            mode === "smart" 
              ? "border-success-500/50 bg-success-500/10 shadow-lg shadow-success-500/20" 
              : "hover:border-success-500/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("smart")}
        >
          {/* Enhanced Recommended Badge */}
          <div className="absolute -top-3 left-8">
            <div className="badge variant-success animated px-4 py-2 shadow-lg">
              ✨ Recommended
            </div>
          </div>

          <div className="space-y-6">
            {/* Enhanced Icon and Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-1">Smart Download</h4>
                <p className="text-success-300 font-medium">One-click best quality</p>
              </div>
              {mode === "smart" && (
                <div className="checkmark w-6 h-6"></div>
              )}
            </div>

            {/* Enhanced Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                <span>Automatically selects highest quality</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                <span>Merges video + audio into single file</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" />
                <span>No technical knowledge required</span>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <button
              className={`youtube-gradient w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                mode === "smart" 
                  ? "bg-gradient-to-r from-success-500 to-success-600" 
                  : "bg-gradient-to-r from-success-500/30 to-success-600/30 hover:from-success-500/50 hover:to-success-600/50"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("smart")
              }}
            >
              {mode === "smart" ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Selected
                </span>
              ) : (
                "Choose Smart Download"
              )}
            </button>
          </div>
        </div>

        {/* Manual Selection Mode */}
        <div 
          className={`card-feature relative p-8 cursor-pointer transition-all duration-500 ${
            mode === "manual" 
              ? "border-info-500/50 bg-info-500/10 shadow-lg shadow-info-500/20" 
              : "hover:border-info-500/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("manual")}
        >
          <div className="space-y-6">
            {/* Enhanced Icon and Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-info-500 to-info-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-1">Manual Selection</h4>
                <p className="text-info-300 font-medium">Full control over formats</p>
              </div>
              {mode === "manual" && (
                <div className="checkmark w-6 h-6"></div>
              )}
            </div>

            {/* Enhanced Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-info-400 rounded-full" />
                <span>Choose specific quality and format</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-info-400 rounded-full" />
                <span>Access to all available streams</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-info-400 rounded-full" />
                <span>Advanced options for power users</span>
              </div>
            </div>

            {/* Enhanced Action Button */}
            <button
              className={`btn-glass w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                mode === "manual" 
                  ? "bg-gradient-to-r from-info-500 to-info-600 border-info-500" 
                  : "hover:bg-info-500/20 hover:border-info-500/50"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("manual")
              }}
            >
              {mode === "manual" ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Selected
                </span>
              ) : (
                "Choose Manual Selection"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Info Section */}
      {mode === "smart" && (
        <div className="glass-card border border-success-500/30 bg-success-500/10 rounded-2xl p-6 animate-scale-in">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-success-400" />
            </div>
            <div>
              <p className="text-success-200 font-semibold mb-2">Smart Download Process</p>
              <p className="text-success-200/90 leading-relaxed">
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