"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ScoreMeter } from "@/components/score-meter"
import { StrengthBreakdown } from "@/components/strength-breakdown"
import { BreachAlert } from "@/components/breach-alert"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Copy, Lightbulb } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AnalysisResult {
  score: number
  length: { value: number; maxValue: number }
  uppercase: { value: number; maxValue: number }
  lowercase: { value: number; maxValue: number }
  numbers: { value: number; maxValue: number }
  symbols: { value: number; maxValue: number }
  breachDetected: boolean
  breachCount: number
  message: string
}

function analyzePassword(password: string): AnalysisResult {
  const length = password.length
  const uppercase = (password.match(/[A-Z]/g) || []).length
  const lowercase = (password.match(/[a-z]/g) || []).length
  const numbers = (password.match(/[0-9]/g) || []).length
  const symbols = (password.match(/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/g) || []).length

  // Calculate score
  let score = 0
  score += Math.min(length * 4, 40) // Max 40 points for length
  score += Math.min(uppercase * 3, 15) // Max 15 points for uppercase
  score += Math.min(lowercase * 2, 10) // Max 10 points for lowercase
  score += Math.min(numbers * 4, 20) // Max 20 points for numbers
  score += Math.min(symbols * 6, 15) // Max 15 points for symbols

  score = Math.min(score, 100)

  // Simulate breach detection (for demo purposes)
  const commonPasswords = ["password", "123456", "qwerty", "admin", "letmein", "welcome"]
  const breachDetected = commonPasswords.some(
    (p) => password.toLowerCase().includes(p)
  )
  const breachCount = breachDetected ? Math.floor(Math.random() * 10000) + 1000 : 0

  // Generate message
  let message = ""
  if (score >= 80) {
    message = "Excellent! Your password is strong and secure."
  } else if (score >= 50) {
    message = "This password is moderately strong but can be improved."
  } else {
    message = "This password is weak and should be changed immediately."
  }

  return {
    score,
    length: { value: Math.min(length, 16), maxValue: 16 },
    uppercase: { value: Math.min(uppercase, 4), maxValue: 4 },
    lowercase: { value: Math.min(lowercase, 6), maxValue: 6 },
    numbers: { value: Math.min(numbers, 4), maxValue: 4 },
    symbols: { value: Math.min(symbols, 4), maxValue: 4 },
    breachDetected,
    breachCount,
    message,
  }
}

function AnalysisContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const password = sessionStorage.getItem("analyzedPassword")
    if (!password) {
      router.push("/")
      return
    }

    // Simulate analysis delay
    const timer = setTimeout(() => {
      setResult(analyzePassword(password))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const handleCopyScore = () => {
    if (result) {
      navigator.clipboard.writeText(`Password Security Score: ${result.score}/100`)
      showToast("Score copied to clipboard", "success")
    }
  }

  const handleReanalyze = () => {
    setIsLoading(true)
    const password = sessionStorage.getItem("analyzedPassword")
    if (password) {
      setTimeout(() => {
        setResult(analyzePassword(password))
        setIsLoading(false)
        showToast("Analysis complete", "success")
      }, 1000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <p className="text-lg text-muted-foreground">Analyzing password security...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!result) return null

  const strengthItems = [
    { label: "Length", ...result.length },
    { label: "Uppercase Letters", ...result.uppercase },
    { label: "Lowercase Letters", ...result.lowercase },
    { label: "Numbers", ...result.numbers },
    { label: "Special Symbols", ...result.symbols },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="icon" className="border-border">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analysis Results</h1>
                <p className="text-sm text-muted-foreground">
                  Detailed password security breakdown
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCopyScore} className="border-border">
                <Copy className="h-4 w-4 mr-2" />
                Copy Score
              </Button>
              <Button variant="outline" onClick={handleReanalyze} className="border-border">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reanalyze
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Meter */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-8 border border-border flex flex-col items-center">
                <h2 className="text-lg font-semibold text-foreground mb-6">Security Score</h2>
                <ScoreMeter score={result.score} />
              </div>
            </div>

            {/* Strength Breakdown */}
            <div className="lg:col-span-2">
              <div className="glass rounded-xl p-8 border border-border h-full">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Strength Breakdown
                </h2>
                <StrengthBreakdown items={strengthItems} />
              </div>
            </div>
          </div>

          {/* Message Box */}
          <div
            className={cn(
              "mt-8 glass rounded-xl p-6 border",
              result.score >= 80
                ? "border-primary/30 bg-primary/5"
                : result.score >= 50
                ? "border-[#FFB74D]/30 bg-[#FFB74D]/5"
                : "border-destructive/30 bg-destructive/5"
            )}
          >
            <p className="text-foreground text-center text-lg">{result.message}</p>
          </div>

          {/* Breach Alert */}
          {result.breachDetected && (
            <div className="mt-8">
              <BreachAlert
                message="This password appears in known data breaches. We strongly recommend changing it immediately."
                riskLevel="high"
                breachCount={result.breachCount}
              />
            </div>
          )}

          {/* Recommendations CTA */}
          <div className="mt-8 text-center">
            <Link href="/recommendations">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-green">
                <Lightbulb className="h-4 w-4 mr-2" />
                View Recommendations
              </Button>
            </Link>
          </div>

          {/* Privacy Banner */}
          <div className="mt-8">
            <PrivacyBanner variant="compact" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AnalysisPage() {
  return (
    <ToastProvider>
      <AnalysisContent />
    </ToastProvider>
  )
}
