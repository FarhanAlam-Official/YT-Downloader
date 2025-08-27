"use client"

import { useState, useEffect } from "react"
import { X, Download, CheckCircle, AlertCircle, Minimize2, Maximize2 } from "lucide-react"

interface DownloadStatus {
  id: string
  filename: string
  progress: number
  status: "downloading" | "completed" | "error"
  error?: string
}

interface DownloadProgressModalProps {
  downloads: DownloadStatus[]
  isOpen: boolean
  onClose: () => void
  onOpen?: () => void
}

export function DownloadProgressModal({ downloads, isOpen, onClose, onOpen }: DownloadProgressModalProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  // Auto-open modal when downloads start
  useEffect(() => {
    if (downloads.length > 0 && downloads.some(d => d.status === 'downloading') && !isOpen && onOpen) {
      onOpen()
    }
  }, [downloads, isOpen, onOpen])

  if (!isOpen) return null

  const activeDownloads = downloads.filter(d => d.status === 'downloading')
  const completedDownloads = downloads.filter(d => d.status === 'completed')
  const errorDownloads = downloads.filter(d => d.status === 'error')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-2xl transition-all duration-300 ${
          isMinimized ? 'max-h-20' : 'max-h-[80vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Beautiful Modal Card */}
        <div className="youtube-card border-2 border-white/20 overflow-hidden">
          {/* Modal Header */}
          <div className="relative bg-gradient-to-r from-youtube-red/20 via-brand-red-500/20 to-brand-red-600/20 p-6 border-b border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-youtube-red to-brand-red-600 flex items-center justify-center shadow-xl">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white">Download Progress</h3>
                  <p className="text-sm text-gray-300">
                    {activeDownloads.length > 0 
                      ? `${activeDownloads.length} active download${activeDownloads.length > 1 ? 's' : ''}`
                      : downloads.length === completedDownloads.length 
                        ? 'All downloads completed!'
                        : `${downloads.length} download${downloads.length > 1 ? 's' : ''} processed`
                    }
                  </p>
                </div>
              </div>

              {/* Header Controls */}
              <div className="flex items-center gap-2">
                {/* Overall Status Badge */}
                {activeDownloads.length > 0 && (
                  <div className="badge variant-error animated bg-gradient-to-r from-youtube-red/20 to-brand-red-600/20 border-youtube-red/40 text-youtube-red">
                    <div className="pulse-loader mr-2">
                      <div className="pulse-dot bg-youtube-red"></div>
                      <div className="pulse-dot bg-youtube-red"></div>
                      <div className="pulse-dot bg-youtube-red"></div>
                    </div>
                    Processing
                  </div>
                )}
                
                {downloads.length > 0 && activeDownloads.length === 0 && (
                  <div className="badge variant-success">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </div>
                )}

                {/* Minimize/Maximize Button */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 group"
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  ) : (
                    <Minimize2 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  )}
                </button>

                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onClose()
                  }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-error-500/20 border border-white/20 hover:border-error-500/50 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Close progress modal"
                >
                  <X className="h-5 w-5 text-white group-hover:text-error-400 group-hover:scale-110 transition-all" />
                </button>
              </div>
            </div>

            {/* Progress Summary Bar */}
            {downloads.length > 0 && (
              <div className="mt-4">
                <div className="progress-enhanced h-2">
                  <div 
                    className="progress-enhanced__fill bg-gradient-to-r from-youtube-red to-brand-red-600"
                    style={{ 
                      width: `${(completedDownloads.length / downloads.length) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{completedDownloads.length} of {downloads.length} completed</span>
                  <span>{Math.round((completedDownloads.length / downloads.length) * 100)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Content */}
          {!isMinimized && (
            <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
              {downloads.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-500/20 flex items-center justify-center">
                    <Download className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400">No downloads in progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloads.map((download, index) => (
                    <div 
                      key={download.id} 
                      className="glass-card rounded-xl p-5 border border-white/10 animate-scale-in hover:border-white/20 transition-all duration-300" 
                      style={{animationDelay: `${index * 50}ms`}}
                    >
                      {/* Download Item Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate mb-1 text-sm">
                            {download.filename}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono">
                            ID: {download.id.slice(0, 8)}...
                          </p>
                        </div>
                        
                        {/* Status Icon & Progress */}
                        <div className="flex items-center gap-3 ml-4">
                          {download.status === 'downloading' && (
                            <div className="flex items-center gap-2">
                              <div className="pulse-loader">
                                <div className="pulse-dot bg-youtube-red"></div>
                                <div className="pulse-dot bg-youtube-red"></div>
                                <div className="pulse-dot bg-youtube-red"></div>
                              </div>
                              <span className="text-xs font-mono text-youtube-red min-w-[3rem] text-right">
                                {Math.round(download.progress)}%
                              </span>
                            </div>
                          )}
                          
                          {download.status === 'completed' && (
                            <div className="flex items-center gap-2">
                              <div className="checkmark w-6 h-6"></div>
                              <span className="text-xs font-semibold text-success-400">
                                Complete
                              </span>
                            </div>
                          )}
                          
                          {download.status === 'error' && (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-error-500" />
                              <span className="text-xs font-semibold text-error-400">
                                Failed
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="space-y-2">
                        <div className="progress-enhanced h-3">
                          <div 
                            className={`progress-enhanced__fill transition-all duration-500 ${
                              download.status === 'downloading' 
                                ? 'bg-gradient-to-r from-youtube-red to-brand-red-600 animated' 
                                : download.status === 'completed'
                                  ? 'bg-gradient-to-r from-success-500 to-success-600'
                                  : 'bg-gradient-to-r from-error-500 to-error-600'
                            }`}
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                        
                        {/* Status Text */}
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${
                            download.status === 'downloading' ? 'text-youtube-red' :
                            download.status === 'completed' ? 'text-success-400' :
                            'text-error-400'
                          }`}>
                            {download.status === 'downloading' && 'Downloading...'}
                            {download.status === 'completed' && 'Download completed successfully!'}
                            {download.status === 'error' && 'Download failed'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Error Message */}
                      {download.status === 'error' && download.error && (
                        <div className="mt-3 glass-card border border-error-500/30 bg-error-500/10 rounded-lg p-3">
                          <p className="text-error-400 text-xs flex items-start gap-2">
                            <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                            <span>{download.error}</span>
                          </p>
                        </div>
                      )}
                      
                      {/* Success Message */}
                      {download.status === 'completed' && (
                        <div className="mt-3 glass-card border border-success-500/30 bg-success-500/10 rounded-lg p-3">
                          <p className="text-success-400 text-xs flex items-center gap-2">
                            <CheckCircle className="h-3 w-3" />
                            <span>File saved to your Downloads folder</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          {!isMinimized && downloads.length > 0 && (
            <div className="border-t border-white/20 p-6 bg-gradient-to-r from-white/5 to-white/10">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-success-500">
                    {completedDownloads.length}
                  </p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-youtube-red">
                    {activeDownloads.length}
                  </p>
                  <p className="text-xs text-gray-400">In Progress</p>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-error-500">
                    {errorDownloads.length}
                  </p>
                  <p className="text-xs text-gray-400">Failed</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}