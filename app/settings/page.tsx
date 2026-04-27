"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PrivacyBanner } from "@/components/privacy-banner"
import { ToastProvider, useToast } from "@/components/toast-provider"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Bell,
  Eye,
  Database,
  Moon,
  Sun,
  Monitor,
  Save,
  RotateCcw,
  Lock,
  Key,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingToggleProps {
  label: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
  icon: React.ElementType
}

function SettingToggle({
  label,
  description,
  enabled,
  onChange,
  icon: Icon,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{label}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-200",
          enabled ? "bg-primary" : "bg-muted"
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            enabled && "translate-x-5"
          )}
        />
      </button>
    </div>
  )
}

function SettingsContent() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState({
    breachNotifications: true,
    autoAnalyze: false,
    darkMode: true,
    storeHistory: true,
    biometricLock: false,
    twoFactorAuth: true,
  })
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    showToast("Setting updated", "success")
  }

  const handleSave = () => {
    showToast("Settings saved successfully", "success")
  }

  const handleReset = () => {
    setSettings({
      breachNotifications: true,
      autoAnalyze: false,
      darkMode: true,
      storeHistory: true,
      biometricLock: false,
      twoFactorAuth: true,
    })
    setTheme("dark")
    showToast("Settings reset to defaults", "info")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Configure your security preferences and notifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset} className="border-border">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="glass rounded-xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Appearance
            </h3>
            <div className="flex gap-4">
              {[
                { value: "dark" as const, icon: Moon, label: "Dark" },
                { value: "light" as const, icon: Sun, label: "Light" },
                { value: "system" as const, icon: Monitor, label: "System" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 px-6 py-4 rounded-xl border transition-all duration-200",
                    theme === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  <option.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass rounded-xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Security
            </h3>
            <div className="space-y-1">
              <SettingToggle
                icon={Shield}
                label="Breach Notifications"
                description="Get notified when your password appears in a data breach"
                enabled={settings.breachNotifications}
                onChange={(v) => updateSetting("breachNotifications", v)}
              />
              <SettingToggle
                icon={Key}
                label="Two-Factor Authentication"
                description="Require additional verification for sensitive operations"
                enabled={settings.twoFactorAuth}
                onChange={(v) => updateSetting("twoFactorAuth", v)}
              />
              <SettingToggle
                icon={Lock}
                label="Biometric Lock"
                description="Use fingerprint or face recognition to access the app"
                enabled={settings.biometricLock}
                onChange={(v) => updateSetting("biometricLock", v)}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="glass rounded-xl border border-border p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Privacy
            </h3>
            <div className="space-y-1">
              <SettingToggle
                icon={Eye}
                label="Auto-Analyze"
                description="Automatically analyze passwords as you type"
                enabled={settings.autoAnalyze}
                onChange={(v) => updateSetting("autoAnalyze", v)}
              />
              <SettingToggle
                icon={Database}
                label="Store History"
                description="Keep a local history of your password analyses"
                enabled={settings.storeHistory}
                onChange={(v) => updateSetting("storeHistory", v)}
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="glass rounded-xl border border-border p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Notifications
            </h3>
            <div className="space-y-1">
              <SettingToggle
                icon={Bell}
                label="Push Notifications"
                description="Receive push notifications for security alerts"
                enabled={settings.breachNotifications}
                onChange={(v) => updateSetting("breachNotifications", v)}
              />
            </div>
          </div>

          {/* Privacy Banner */}
          <PrivacyBanner variant="full" />
        </div>
      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  )
}
