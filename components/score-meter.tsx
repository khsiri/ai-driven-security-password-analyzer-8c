"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreMeterProps {
  score: number
  size?: number
}

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Strong", color: "#00C9A7" }
  if (score >= 50) return { label: "Medium", color: "#FFB74D" }
  return { label: "Weak", color: "#FF4D4D" }
}

export function ScoreMeter({ score, size = 200 }: ScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const { label, color } = getScoreLabel(score)

  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 10px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn("text-5xl font-bold tabular-nums")}
          style={{ color }}
        >
          {animatedScore}
        </span>
        <span className="text-sm text-muted-foreground">/100</span>
        <span
          className={cn("mt-2 px-3 py-1 rounded-full text-sm font-medium")}
          style={{
            backgroundColor: `${color}20`,
            color,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  )
}
