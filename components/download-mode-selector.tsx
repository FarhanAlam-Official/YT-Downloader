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
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Choose Download Method</h3>
        <p className="text-gray-400 text-sm">
          Select how you want to download your video
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Smart Download Mode */}
        <Card 
          className={`relative p-6 cursor-pointer transition-all duration-300 border-2 ${
            mode === "smart" 
              ? "border-green-500 bg-green-500/5 ring-2 ring-green-500/20" 
              : "border-gray-700 hover:border-green-500/50 bg-gray-900/40"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("smart")}
        >
          {/* Recommended Badge */}
          <div className="absolute -top-3 left-6">
            <Badge className="bg-green-500 text-white px-3 py-1 text-xs font-medium shadow-lg">
              ✨ Recommended
            </Badge>
          </div>

          <div className="space-y-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Smart Download</h4>
                <p className="text-sm text-green-300">One-click best quality</p>
              </div>
              {mode === "smart" && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
              )}
            </div>

            {/* Features */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span>Automatically selects highest quality</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span>Merges video + audio into single file</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span>No technical knowledge required</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              className={`w-full ${
                mode === "smart" 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-green-500/20 hover:bg-green-500/30 text-green-300"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("smart")
              }}
            >
              {mode === "smart" ? "Selected" : "Choose Smart Download"}
            </Button>
          </div>
        </Card>

        {/* Manual Selection Mode */}
        <Card 
          className={`relative p-6 cursor-pointer transition-all duration-300 border-2 ${
            mode === "manual" 
              ? "border-blue-500 bg-blue-500/5 ring-2 ring-blue-500/20" 
              : "border-gray-700 hover:border-blue-500/50 bg-gray-900/40"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => !disabled && onModeChange("manual")}
        >
          <div className="space-y-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Manual Selection</h4>
                <p className="text-sm text-blue-300">Full control over formats</p>
              </div>
              {mode === "manual" && (
                <CheckCircle className="h-5 w-5 text-blue-500 ml-auto" />
              )}
            </div>

            {/* Features */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Choose specific quality and format</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Access to all available streams</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span>Advanced options for power users</span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              className={`w-full ${
                mode === "manual" 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-300"
              }`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation()
                !disabled && onModeChange("manual")
              }}
            >
              {mode === "manual" ? "Selected" : "Choose Manual Selection"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Info Section */}
      {mode === "smart" && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-green-200 font-medium mb-1">Smart Download Process</p>
              <p className="text-green-200/80">
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