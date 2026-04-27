"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import {
  Eye,
  EyeOff,
  Trash2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryEntry {
  id: string
  password: string
  score: number
  status: "safe" | "warning" | "breach"
  date: string
}

// Mock history data
const mockHistory: HistoryEntry[] = [
  {
    id: "1",
    password: "MyS3cur3P@ss!",
    score: 92,
    status: "safe",
    date: "2024-01-15 14:32",
  },
  {
    id: "2",
    password: "password123",
    score: 28,
    status: "breach",
    date: "2024-01-14 09:15",
  },
  {
    id: "3",
    password: "JohnDoe2024",
    score: 55,
    status: "warning",
    date: "2024-01-13 16:45",
  },
  {
    id: "4",
    password: "Tr0ub4dor&3",
    score: 85,
    status: "safe",
    date: "2024-01-12 11:20",
  },
  {
    id: "5",
    password: "qwerty",
    score: 12,
    status: "breach",
    date: "2024-01-11 08:00",
  },
  {
    id: "6",
    password: "Correct-Horse-Battery",
    score: 78,
    status: "safe",
    date: "2024-01-10 13:30",
  },
]

const statusConfig = {
  safe: {
    icon: ShieldCheck,
    label: "Safe",
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/30",
  },
  warning: {
    icon: Shield,
    label: "Warning",
    bg: "bg-[#FFB74D]/10",
    text: "text-[#FFB74D]",
    border: "border-[#FFB74D]/30",
  },
  breach: {
    icon: ShieldAlert,
    label: "Breach",
    bg: "bg-destructive/10",
    text: "text-destructive",
    border: "border-destructive/30",
  },
}

function HistoryContent() {
  const { showToast } = useToast()
  const [history, setHistory] = useState<HistoryEntry[]>(mockHistory)
  const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id))
    showToast("Entry deleted", "success")
  }

  const clearHistory = () => {
    setHistory([])
    showToast("History cleared", "success")
  }

  const exportHistory = () => {
    const data = history.map((entry) => ({
      score: entry.score,
      status: entry.status,
      date: entry.date,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "password-history.json"
    a.click()
    URL.revokeObjectURL(url)
    showToast("History exported", "success")
  }

  const filteredHistory = history.filter((entry) => {
    if (!searchQuery) return true
    return (
      entry.status.includes(searchQuery.toLowerCase()) ||
      entry.date.includes(searchQuery)
    )
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Analysis History
              </h1>
              <p className="text-muted-foreground">
                View and manage your password analysis history
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={exportHistory}
                disabled={history.length === 0}
                className="border-border"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={clearHistory}
                disabled={history.length === 0}
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by status or date..."
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-xl bg-muted/50 border border-border",
                "text-foreground placeholder:text-muted-foreground",
                "focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none",
                "transition-all duration-200"
              )}
            />
          </div>

          {/* History Table */}
          {filteredHistory.length > 0 ? (
            <div className="glass rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Password
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredHistory.map((entry) => {
                      const config = statusConfig[entry.status]
                      const StatusIcon = config.icon
                      const isVisible = showPasswords.has(entry.id)

                      return (
                        <tr
                          key={entry.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <code className="font-mono text-sm text-muted-foreground">
                                {isVisible
                                  ? entry.password
                                  : "••••••••••••"}
                              </code>
                              <button
                                onClick={() => togglePassword(entry.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={isVisible ? "Hide password" : "Show password"}
                              >
                                {isVisible ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 overflow-hidden rounded-full bg-muted/30">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    entry.score >= 80
                                      ? "bg-primary"
                                      : entry.score >= 50
                                      ? "bg-[#FFB74D]"
                                      : "bg-destructive"
                                  )}
                                  style={{ width: `${entry.score}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground tabular-nums">
                                {entry.score}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                config.bg,
                                config.text
                              )}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {config.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-muted-foreground">
                              {entry.date}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass rounded-xl border border-border p-12 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No history found
              </h3>
              <p className="text-muted-foreground">
                {history.length === 0
                  ? "Your password analysis history will appear here"
                  : "No entries match your search"}
              </p>
            </div>
          )}

          {/* Privacy Banner */}
          <div className="mt-8">
            <PrivacyBanner variant="compact" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <ToastProvider>
      <HistoryContent />
    </ToastProvider>
  )
}
