"use client"

import { useState } from "react"
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
  onAnalyze: (password: string) => void
  isLoading?: boolean
}

export function PasswordInput({ onAnalyze, isLoading = false }: PasswordInputProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.trim()) {
      onAnalyze(password)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-500" />
        <div className="relative glass rounded-xl p-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password to analyze..."
                className={cn(
                  "w-full bg-transparent px-4 py-4 pr-12 text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none text-lg font-mono"
                )}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              disabled={!password.trim() || isLoading}
              className={cn(
                "h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
                "transition-all duration-300",
                password.trim() && !isLoading && "glow-green"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Analyze Securely
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Shield className="h-3.5 w-3.5 text-primary" />
        Your password never leaves your device
      </p>
    </form>
  )
}
