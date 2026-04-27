"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    text: "text-destructive",
  },
  info: {
    icon: Info,
    bg: "bg-accent/10",
    border: "border-accent/30",
    text: "text-accent",
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type]
          const Icon = config.icon

          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg border",
                "glass shadow-lg min-w-[300px] animate-in slide-in-from-right-5",
                config.bg,
                config.border
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", config.text)} />
              <p className="flex-1 text-sm text-foreground">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
