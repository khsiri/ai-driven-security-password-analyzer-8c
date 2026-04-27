"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SecurityCard } from "@/components/security-card"
import { OTPInput } from "@/components/otp-input"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import {
  ScanFace,
  ScanEye,
  Fingerprint,
  Keyboard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

function SecurityContent() {
  const { showToast } = useToast()
  const [otpStatus, setOtpStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const [behavioralStatus, setBehavioralStatus] = useState<"idle" | "analyzing" | "complete">("idle")
  const [typingPattern, setTypingPattern] = useState("")

  const handleOTPComplete = async (otp: string) => {
    setOtpStatus("verifying")
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))
    if (otp === "123456") {
      setOtpStatus("success")
      showToast("OTP verified successfully!", "success")
    } else {
      setOtpStatus("error")
      showToast("Invalid OTP. Please try again.", "error")
      setTimeout(() => setOtpStatus("idle"), 2000)
    }
  }

  const handleBehavioralAnalysis = async () => {
    if (!typingPattern.trim()) {
      showToast("Please type something first", "error")
      return
    }
    setBehavioralStatus("analyzing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setBehavioralStatus("complete")
    showToast("Behavioral pattern analyzed successfully!", "success")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Security Check</h1>
            <p className="text-muted-foreground">
              Multi-factor authentication and biometric verification dashboard
            </p>
          </div>

          {/* MFA Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <SecurityCard
              icon={ScanFace}
              title="Face Lock"
              description="Use facial recognition for secure authentication"
              buttonText="Scan Face"
            />
            <SecurityCard
              icon={ScanEye}
              title="Iris Scan"
              description="Advanced iris pattern recognition for maximum security"
              buttonText="Start Scan"
            />
            <SecurityCard
              icon={Fingerprint}
              title="Biometric"
              description="Fingerprint verification for quick and secure access"
              buttonText="Scan Fingerprint"
            />
          </div>

          {/* OTP Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="glass rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">OTP Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code (try 123456)
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <OTPInput length={6} onComplete={handleOTPComplete} />

                <div className="flex items-center gap-2">
                  {otpStatus === "verifying" && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                      <span className="text-sm text-accent">Verifying...</span>
                    </>
                  )}
                  {otpStatus === "success" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">Verified Successfully</span>
                    </>
                  )}
                  {otpStatus === "error" && (
                    <span className="text-sm text-destructive">Invalid OTP</span>
                  )}
                </div>

                <Button variant="outline" className="border-border">
                  Resend Code
                </Button>
              </div>
            </div>

            {/* Behavioral Analysis */}
            <div className="glass rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Keyboard className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Behavioral Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Type naturally to analyze your pattern
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={typingPattern}
                  onChange={(e) => setTypingPattern(e.target.value)}
                  placeholder="Type here to analyze your typing pattern..."
                  className={cn(
                    "w-full h-24 rounded-lg bg-muted/50 border border-border p-4",
                    "text-foreground placeholder:text-muted-foreground resize-none",
                    "focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none",
                    "transition-all duration-200"
                  )}
                  disabled={behavioralStatus === "analyzing"}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {behavioralStatus === "analyzing" && (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-sm text-accent">Analyzing pattern...</span>
                      </>
                    )}
                    {behavioralStatus === "complete" && (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary">Pattern recognized</span>
                      </>
                    )}
                  </div>

                  <Button
                    onClick={handleBehavioralAnalysis}
                    disabled={behavioralStatus === "analyzing"}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {behavioralStatus === "analyzing" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing
                      </>
                    ) : (
                      "Analyze Pattern"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Banner */}
          <PrivacyBanner variant="full" />
        </div>
      </main>
    </div>
  )
}

export default function SecurityPage() {
  return (
    <ToastProvider>
      <SecurityContent />
    </ToastProvider>
  )
}
