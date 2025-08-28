"use client"

import { useState, useEffect } from "react"
import { X, Download, CheckCircle, AlertCircle } from "lucide-react"

interface Toast {
  id: string
  type: "info" | "success" | "error"
  title: string
  message: string
  duration?: number
}

interface ToastNotificationProps {
  toasts: Toast[]
  onRemoveToast: (id: string) => void
}

export function ToastNotification({ toasts, onRemoveToast }: ToastNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: () => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Auto remove after duration
    if (toast.duration) {
      const timer = setTimeout(() => {
        handleRemove()
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(onRemove, 300) // Wait for animation
  }

  // Neutral, theme-aware surface; colors are applied via accent bar + icon bg
  const getToastStyles = () => "bg-background/95 border-border text-foreground"

  const colorBg = toast.type === 'success' ? 'bg-success-400/25' : toast.type === 'error' ? 'bg-error-400/25' : 'bg-info-400/25'
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className={`w-7 h-7 rounded-lg ${colorBg} flex items-center justify-center`}>
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        )
      case "error":
        return (
          <div className={`w-7 h-7 rounded-lg ${colorBg} flex items-center justify-center`}>
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
        )
      default:
        return (
          <div className={`w-7 h-7 rounded-lg ${colorBg} flex items-center justify-center`}>
            <Download className="h-4 w-4 text-white" />
          </div>
        )
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${getToastStyles()}`}
    >
      {/* Accent border based on type */}
      <div className={`absolute inset-0 pointer-events-none`}> 
        <div className={`absolute left-0 top-0 h-full w-1
          ${toast.type === 'success' ? 'bg-success-400/80' : toast.type === 'error' ? 'bg-error-400/80' : 'bg-info-400/80'}`}/>
      </div>

      {/* Shine */}
      {/* subtle diagonal highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
              {toast.title}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border
                ${toast.type === 'success' ? 'bg-success-500/15 border-success-500/30 text-success-600 dark:text-success-300' : toast.type === 'error' ? 'bg-error-500/15 border-error-500/30 text-error-600 dark:text-error-300' : 'bg-info-500/15 border-info-500/30 text-info-600 dark:text-info-300'}`}>
                {toast.type === 'success' ? 'Completed' : toast.type === 'error' ? 'Failed' : 'Starting'}
              </span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 rounded-lg bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="h-3 w-3 text-foreground" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
          <div
            className={`h-full transition-all duration-300 ease-linear ${toast.type === 'success' ? 'bg-success-500/60' : toast.type === 'error' ? 'bg-error-500/60' : 'bg-info-500/60'}`}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  )
}

// Custom hook for managing toasts
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    }
    
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const showDownloadStart = (filename: string) => {
    return addToast({
      type: "info",
      title: "Download Started",
      message: `Preparing ${filename}...`,
      duration: 3000
    })
  }

  const showDownloadComplete = (filename: string) => {
    return addToast({
      type: "success",
      title: "Download Complete!",
      message: `${filename} has been saved to your Downloads folder.`,
      duration: 5000
    })
  }

  const showDownloadError = (filename: string, error: string) => {
    return addToast({
      type: "error",
      title: "Download Failed",
      message: `Failed to download ${filename}: ${error}`,
      duration: 7000
    })
  }

  return {
    toasts,
    removeToast,
    addToast,
    showDownloadStart,
    showDownloadComplete,
    showDownloadError
  }
}