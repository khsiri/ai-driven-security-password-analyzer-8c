"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Status = "idle" | "scanning" | "success" | "warning"

interface SecurityCardProps {
  icon: LucideIcon
  title: string
  description: string
  buttonText: string
  onScan?: () => Promise<Status>
}

const statusConfig = {
  idle: {
    badge: null,
    color: "text-muted-foreground",
  },
  scanning: {
    badge: "Scanning...",
    color: "text-accent",
  },
  success: {
    badge: "Verified",
    color: "text-primary",
  },
  warning: {
    badge: "Not Available",
    color: "text-destructive",
  },
}

export function SecurityCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onScan,
}: SecurityCardProps) {
  const [status, setStatus] = useState<Status>("idle")

  const handleScan = async () => {
    setStatus("scanning")
    if (onScan) {
      const result = await onScan()
      setStatus(result)
    } else {
      // Simulate scan
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStatus(Math.random() > 0.3 ? "success" : "warning")
    }
  }

  const config = statusConfig[status]

  return (
    <div className="glass glass-hover rounded-xl p-6 border border-border transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300",
            status === "success"
              ? "bg-primary/20 glow-green"
              : status === "warning"
              ? "bg-destructive/20 glow-red"
              : "bg-accent/10"
          )}
        >
          {status === "scanning" ? (
            <Loader2 className="h-7 w-7 text-accent animate-spin" />
          ) : status === "success" ? (
            <CheckCircle2 className="h-7 w-7 text-primary" />
          ) : status === "warning" ? (
            <AlertCircle className="h-7 w-7 text-destructive" />
          ) : (
            <Icon className="h-7 w-7 text-accent" />
          )}
        </div>
        {config.badge && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              status === "success"
                ? "bg-primary/20 text-primary"
                : status === "warning"
                ? "bg-destructive/20 text-destructive"
                : "bg-accent/20 text-accent"
            )}
          >
            {config.badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Button
        onClick={handleScan}
        disabled={status === "scanning"}
        variant={status === "success" ? "outline" : "default"}
        className={cn(
          "w-full transition-all duration-300",
          status === "success" && "border-primary/50 text-primary hover:bg-primary/10"
        )}
      >
        {status === "scanning" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : status === "success" ? (
          "Scan Again"
        ) : (
          buttonText
        )}
      </Button>
    </div>
  )
}
