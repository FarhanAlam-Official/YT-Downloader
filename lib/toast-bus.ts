"use client"

export type AppToast = {
  type: "info" | "success" | "error" | "warning"
  title: string
  message: string
  duration?: number
}

type Listener = (toast: AppToast) => void

const listeners: Listener[] = []

export function emitToast(toast: AppToast) {
  for (const l of listeners) l(toast)
}

export function subscribeToast(listener: Listener) {
  listeners.push(listener)
  return () => {
    const idx = listeners.indexOf(listener)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

// Convenience API
export const toast = {
  info: (message: string, title = "Info", duration?: number) =>
    emitToast({ type: "info", title, message, duration }),
  success: (message: string, title = "Success", duration?: number) =>
    emitToast({ type: "success", title, message, duration }),
  error: (message: string, title = "Error", duration?: number) =>
    emitToast({ type: "error", title, message, duration }),
  warning: (message: string, title = "Warning", duration?: number) =>
    emitToast({ type: "warning", title, message, duration }),
}

