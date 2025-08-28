"use client"

import { useState, useEffect } from "react"
import { subscribeToast, type AppToast } from "@/lib/toast-bus"
import { X, Download, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

interface Toast {
  id: string
  type: "info" | "success" | "error" | "warning"
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

  // Use colored background based on toast type
  const getToastStyles = () => `${colors.bg} border border-gray-200 dark:border-gray-700`

  const getColorClasses = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950/30',
          border: 'bg-green-500',
          badge: 'bg-green-500/15 border-green-500/30 text-green-600 dark:text-green-300',
          progress: 'bg-green-500/60',
          icon: 'bg-green-500',
          text: 'text-green-800 dark:text-green-200',
          message: 'text-green-700 dark:text-green-300'
        }
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950/30',
          border: 'bg-red-500',
          badge: 'bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-300',
          progress: 'bg-red-500/60',
          icon: 'bg-red-500',
          text: 'text-red-800 dark:text-red-200',
          message: 'text-red-700 dark:text-red-300'
        }
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/30',
          border: 'bg-orange-500',
          badge: 'bg-orange-500/15 border-orange-500/30 text-orange-600 dark:text-orange-300',
          progress: 'bg-orange-500/60',
          icon: 'bg-orange-500',
          text: 'text-orange-800 dark:text-orange-200',
          message: 'text-orange-700 dark:text-orange-300'
        }
      default: // info
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/30',
          border: 'bg-blue-500',
          badge: 'bg-blue-500/15 border-blue-500/30 text-blue-600 dark:text-blue-300',
          progress: 'bg-blue-500/60',
          icon: 'bg-blue-500',
          text: 'text-blue-800 dark:text-blue-200',
          message: 'text-blue-700 dark:text-blue-300'
        }
    }
  }

  const colors = getColorClasses()
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        )
      case "error":
        return (
          <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
        )
      case "warning":
        return (
          <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
        )
      default:
        return (
          <div className={`w-8 h-8 rounded-lg ${colors.icon} flex items-center justify-center`}>
            <Download className="h-5 w-5 text-white" />
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
      {/* Left accent bar - thicker and more prominent */}
      <div className={`absolute inset-0 pointer-events-none`}> 
        <div className={`absolute left-0 top-0 h-full w-2 ${colors.border} rounded-l-2xl`}/>
      </div>

      {/* Shine */}
      {/* subtle diagonal highlight */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
      </div>

      <div className="p-4 pl-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold mb-1 flex items-center gap-2 ${colors.text}`}>
              {toast.title}
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase border ${colors.badge}`}>
                {toast.type === 'success' ? 'Completed' : toast.type === 'error' ? 'Failed' : toast.type === 'warning' ? 'Attention' : 'Starting'}
              </span>
            </h4>
            <p className={`text-xs leading-relaxed ${colors.message}`}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-200/50 hover:bg-gray-300/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 flex items-center justify-center transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="h-3 w-3 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
          <div
            className={`h-full transition-all duration-300 ease-linear ${colors.progress}`}
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

  // Bridge global toast bus to this local system
  useEffect(() => {
    const unsub = subscribeToast((t: AppToast) => {
      addToast({ type: t.type, title: t.title, message: t.message, duration: t.duration })
    })
    return unsub
  }, [])

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