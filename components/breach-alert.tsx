"use client"

import { AlertTriangle, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

type RiskLevel = "high" | "medium" | "low"

interface BreachAlertProps {
  message: string
  riskLevel: RiskLevel
  breachCount?: number
}

const riskConfig = {
  high: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    badge: "bg-destructive text-destructive-foreground",
    icon: "text-destructive",
    glow: "glow-red",
  },
  medium: {
    bg: "bg-[#FFB74D]/10",
    border: "border-[#FFB74D]/30",
    badge: "bg-[#FFB74D] text-black",
    icon: "text-[#FFB74D]",
    glow: "",
  },
  low: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    badge: "bg-primary text-primary-foreground",
    icon: "text-primary",
    glow: "glow-green",
  },
}

export function BreachAlert({
  message,
  riskLevel,
  breachCount,
}: BreachAlertProps) {
  const config = riskConfig[riskLevel]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 border",
        config.bg,
        config.border,
        config.glow
      )}
    >
      {/* Animated scan line effect for high risk */}
      {riskLevel === "high" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-destructive to-transparent animate-scan-line" />
        </div>
      )}

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            riskLevel === "high"
              ? "bg-destructive/20 animate-pulse"
              : config.bg
          )}
        >
          {riskLevel === "high" ? (
            <ShieldAlert className={cn("h-6 w-6", config.icon)} />
          ) : (
            <AlertTriangle className={cn("h-6 w-6", config.icon)} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground">Security Alert</h3>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase",
                config.badge
              )}
            >
              {riskLevel} Risk
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          {breachCount && breachCount > 0 && (
            <p className="mt-2 text-sm">
              <span className="text-destructive font-semibold">
                {breachCount.toLocaleString()}
              </span>{" "}
              <span className="text-muted-foreground">known data breaches</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
