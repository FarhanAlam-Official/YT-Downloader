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

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-gradient-to-r from-success-500/90 to-success-600/90 border-success-500/50"
      case "error":
        return "bg-gradient-to-r from-error-500/90 to-error-600/90 border-error-500/50"
      default:
        return "bg-gradient-to-r from-info-500/90 to-info-600/90 border-info-500/50"
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-white" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-white" />
      default:
        return <Download className="h-5 w-5 text-white" />
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${getToastStyles()}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white mb-1">
              {toast.title}
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="h-3 w-3 text-white" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/50 transition-all duration-300 ease-linear"
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