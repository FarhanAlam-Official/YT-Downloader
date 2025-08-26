"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Download, AlertCircle } from "lucide-react"

interface DownloadStatus {
  id: string
  filename: string
  progress: number
  status: "downloading" | "completed" | "error"
  error?: string
}

interface DownloadProgressProps {
  downloads: DownloadStatus[]
}

export function DownloadProgress({ downloads }: DownloadProgressProps) {
  if (downloads.length === 0) {
    return null
  }

  return (
    <div className="glass-card rounded-2xl border border-white/20 animate-fade-in-up">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info-500/20 flex items-center justify-center">
              <Download className="h-5 w-5 text-info-500" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Downloads</h3>
              <p className="text-sm text-gray-400">{downloads.length} active download{downloads.length > 1 ? 's' : ''}</p>
            </div>
          </div>
          
          {/* Overall Status */}
          <div className="flex items-center gap-2">
            {downloads.some(d => d.status === 'downloading') && (
              <div className="badge variant-info animated">
                <div className="pulse-loader mr-2">
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                  <div className="pulse-dot"></div>
                </div>
                Active
              </div>
            )}
            
            {downloads.every(d => d.status === 'completed') && (
              <div className="badge variant-success animated">
                <div className="checkmark w-4 h-4 mr-2"></div>
                All Complete
              </div>
            )}
          </div>
        </div>

        {/* Downloads List */}
        <div className="space-y-6">
          {downloads.map((download, index) => (
            <div key={download.id} className="glass-card rounded-xl p-6 border border-white/10 animate-scale-in" style={{animationDelay: `${index * 100}ms`}}>
              {/* Download Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate mb-1">{download.filename}</h4>
                  <p className="text-sm text-gray-400 truncate">ID: {download.id}</p>
                </div>
                
                {/* Status Icon & Badge */}
                <div className="flex items-center gap-3 ml-4">
                  {download.status === 'downloading' && (
                    <div className="w-8 h-8 rounded-full bg-info-500/20 flex items-center justify-center">
                      <div className="pulse-loader">
                        <div className="pulse-dot"></div>
                        <div className="pulse-dot"></div>
                        <div className="pulse-dot"></div>
                      </div>
                    </div>
                  )}
                  
                  {download.status === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success-500" />
                    </div>
                  )}
                  
                  {download.status === 'error' && (
                    <div className="w-8 h-8 rounded-full bg-error-500/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-error-500" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`badge ${download.status === 'downloading' ? 'variant-info' : download.status === 'completed' ? 'variant-success' : 'variant-error'}`}>
                    {download.status === 'downloading' && `${Math.round(download.progress)}%`}
                    {download.status === 'completed' && 'Complete'}
                    {download.status === 'error' && 'Failed'}
                  </div>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="space-y-3">
                <div className="progress-enhanced">
                  <div 
                    className={`progress-enhanced__fill ${download.status === 'downloading' ? 'animated' : ''}`}
                    style={{ width: `${download.progress}%` }}
                  ></div>
                </div>
                
                {/* Progress Details */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {download.status === 'downloading' && 'Downloading...'}
                    {download.status === 'completed' && 'Download completed successfully!'}
                    {download.status === 'error' && 'Download failed'}
                  </span>
                  
                  {download.status === 'downloading' && (
                    <span className="font-mono text-info-500">
                      {Math.round(download.progress)}%
                    </span>
                  )}
                </div>
              </div>
              
              {/* Error Message */}
              {download.status === 'error' && download.error && (
                <div className="mt-4 glass-card border border-error-500/30 bg-error-500/10 rounded-lg p-3">
                  <p className="text-error-500 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{download.error}</span>
                  </p>
                </div>
              )}
              
              {/* Success Message */}
              {download.status === 'completed' && (
                <div className="mt-4 glass-card border border-success-500/30 bg-success-500/10 rounded-lg p-3">
                  <p className="text-success-500 text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>File saved to your Downloads folder</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Download Summary */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-success-500">
                {downloads.filter(d => d.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-info-500">
                {downloads.filter(d => d.status === 'downloading').length}
              </p>
              <p className="text-sm text-gray-400">In Progress</p>
            </div>
            
            <div>
              <p className="text-2xl font-bold text-error-500">
                {downloads.filter(d => d.status === 'error').length}
              </p>
              <p className="text-sm text-gray-400">Failed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
