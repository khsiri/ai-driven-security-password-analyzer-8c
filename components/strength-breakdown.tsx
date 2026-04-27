"use client"

import { cn } from "@/lib/utils"

interface StrengthItem {
  label: string
  value: number
  maxValue: number
}

interface StrengthBreakdownProps {
  items: StrengthItem[]
}

function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "#00C9A7"
  if (percentage >= 50) return "#FFB74D"
  return "#FF4D4D"
}

export function StrengthBreakdown({ items }: StrengthBreakdownProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percentage = Math.round((item.value / item.maxValue) * 100)
        const color = getProgressColor(percentage)

        return (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{item.label}</span>
              <span className="text-muted-foreground">
                {item.value}/{item.maxValue}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out"
                )}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}60`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
