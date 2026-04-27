"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PasswordInput } from "@/components/password-input"
import { FeatureCard } from "@/components/feature-card"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Brain, ShieldAlert, Lock, Zap } from "lucide-react"

function HomeContent() {
  const router = useRouter()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async (password: string) => {
    setIsLoading(true)
    showToast("Analyzing password securely...", "info")

    // Simulate analysis
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store password in sessionStorage for the analysis page (local only, never transmitted)
    sessionStorage.setItem("analyzedPassword", password)
    router.push("/analysis")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-8">
            <div className="mb-6">
              <PrivacyBanner variant="compact" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-glow-green">
              AI Password Security Analyzer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Privacy-first. Zero-knowledge. Local analysis.
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-16">
            <PasswordInput onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <FeatureCard
              icon={Brain}
              title="AI Strength Analysis"
              description="Advanced machine learning algorithms evaluate your password complexity"
              color="green"
            />
            <FeatureCard
              icon={ShieldAlert}
              title="Breach Detection"
              description="Check if your password appears in known data breaches"
              color="red"
            />
            <FeatureCard
              icon={Lock}
              title="Privacy Protection"
              description="Zero-knowledge proof ensures your password never leaves your device"
              color="blue"
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Feedback"
              description="Instant analysis with actionable recommendations"
              color="yellow"
            />
          </div>

          {/* Privacy Banner */}
          <PrivacyBanner variant="full" />
        </div>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomeContent />
    </ToastProvider>
  )
}
