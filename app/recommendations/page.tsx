"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Sparkles,
  Shield,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const recommendations = [
  { id: 1, text: "Use 12+ characters", met: true },
  { id: 2, text: "Include uppercase letters (A-Z)", met: true },
  { id: 3, text: "Include lowercase letters (a-z)", met: true },
  { id: 4, text: "Include numbers (0-9)", met: false },
  { id: 5, text: "Add special symbols (!@#$%)", met: false },
  { id: 6, text: "Avoid common words", met: true },
  { id: 7, text: "Avoid personal information", met: true },
  { id: 8, text: "Use unique password for each account", met: false },
]

function generateStrongPassword(): string {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const all = lowercase + uppercase + numbers + symbols

  let password = ""
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest
  for (let i = 4; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)]
  }

  // Shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

function RecommendationsContent() {
  const { showToast } = useToast()
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const password = generateStrongPassword()
    setGeneratedPassword(password)
    setShowPassword(true)
    setIsGenerating(false)
    showToast("Strong password generated!", "success")
  }

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
      showToast("Password copied to clipboard", "success")
    }
  }

  const metCount = recommendations.filter((r) => r.met).length
  const totalCount = recommendations.length

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Password Recommendations
            </h1>
            <p className="text-muted-foreground">
              Follow these best practices to create a stronger password
            </p>
          </div>

          {/* Progress Overview */}
          <div className="glass rounded-xl p-6 border border-border mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Security Checklist
              </h2>
              <span className="text-sm text-muted-foreground">
                {metCount} of {totalCount} requirements met
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{
                  width: `${(metCount / totalCount) * 100}%`,
                  boxShadow: "0 0 10px rgba(0, 201, 167, 0.5)",
                }}
              />
            </div>
          </div>

          {/* Recommendations List */}
          <div className="glass rounded-xl border border-border overflow-hidden mb-8">
            <div className="divide-y divide-border">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors",
                    rec.met ? "bg-primary/5" : "bg-destructive/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      rec.met ? "bg-primary/20" : "bg-destructive/20"
                    )}
                  >
                    {rec.met ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      rec.met ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {rec.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Password Generator */}
          <div className="glass rounded-xl p-6 border border-primary/20 glow-green mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Strong Password Generator
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate a cryptographically secure password
                </p>
              </div>
            </div>

            {generatedPassword && (
              <div className="mb-6">
                <div className="relative">
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50 border border-border font-mono text-lg">
                    <Shield className="h-5 w-5 text-primary shrink-0" />
                    <span className="flex-1 overflow-hidden text-ellipsis">
                      {showPassword ? generatedPassword : "••••••••••••••••"}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Strong Password
                  </>
                )}
              </Button>
              {generatedPassword && (
                <Button variant="outline" onClick={handleCopy} className="border-border">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              )}
            </div>
          </div>

          {/* Privacy Banner */}
          <PrivacyBanner variant="compact" />
        </div>
      </main>
    </div>
  )
}

export default function RecommendationsPage() {
  return (
    <ToastProvider>
      <RecommendationsContent />
    </ToastProvider>
  )
}
