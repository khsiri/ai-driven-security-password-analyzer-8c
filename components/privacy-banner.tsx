"use client"

import { ShieldCheck, Lock, Eye, Server } from "lucide-react"
import { cn } from "@/lib/utils"

interface PrivacyBannerProps {
  variant?: "full" | "compact"
}

export function PrivacyBanner({ variant = "full" }: PrivacyBannerProps) {
  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">
          Zero-Knowledge Proof Enabled
        </span>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl p-6 border border-primary/20 glow-green">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-glow-green">
            Zero-Knowledge Proof Enabled
          </h3>
          <p className="text-sm text-muted-foreground">
            No password is stored or transmitted
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: Lock,
            label: "Local Analysis",
            description: "All processing happens on your device",
          },
          {
            icon: Eye,
            label: "No Tracking",
            description: "We never see your password",
          },
          {
            icon: Server,
            label: "No Storage",
            description: "Nothing is sent to our servers",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={cn(
              "flex flex-col items-center text-center p-3 rounded-lg",
              "bg-muted/30 border border-border/50"
            )}
          >
            <item.icon className="h-5 w-5 text-primary mb-2" />
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {item.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
