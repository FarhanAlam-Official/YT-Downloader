"use client"

import { ToastNotification, useToasts } from "@/components/toast-notification"

export function Toaster() {
  const { toasts, removeToast } = useToasts()
  return <ToastNotification toasts={toasts} onRemoveToast={removeToast} />
}
