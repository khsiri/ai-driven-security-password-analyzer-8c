"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: "green" | "blue" | "red" | "yellow"
}

const colorMap = {
  green: {
    bg: "bg-[#00C9A7]/10",
    text: "text-[#00C9A7]",
    glow: "glow-green",
    border: "border-[#00C9A7]/20",
  },
  blue: {
    bg: "bg-[#00A8E8]/10",
    text: "text-[#00A8E8]",
    glow: "glow-blue",
    border: "border-[#00A8E8]/20",
  },
  red: {
    bg: "bg-[#FF4D4D]/10",
    text: "text-[#FF4D4D]",
    glow: "glow-red",
    border: "border-[#FF4D4D]/20",
  },
  yellow: {
    bg: "bg-[#FFB74D]/10",
    text: "text-[#FFB74D]",
    glow: "",
    border: "border-[#FFB74D]/20",
  },
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "green",
}: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl glass glass-hover",
        "border transition-all duration-300 p-6",
        colors.border,
        "hover:scale-[1.02]"
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", colors.glow)} />
      <div className="relative">
        <div
          className={cn(
            "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg",
            colors.bg
          )}
        >
          <Icon className={cn("h-6 w-6", colors.text)} />
        </div>
        <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
