"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Bell, Wallet, Calendar, TrendingUp, Shield, Mail, MessageSquare, Smartphone, ArrowLeft, Bot, Brain } from "lucide-react"
import { useParams } from 'next/navigation'

interface AlertSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  type: "unlock" | "whale" | "anomaly" | "general"
}

const mockAlertSettings: AlertSetting[] = [
  {
    id: "sei-unlock-aug1",
    title: "SEI Token Unlock - Aug 1",
    description: "21.5M SEI tokens cliff unlock",
    enabled: true,
    type: "unlock",
  },
  {
    id: "atom-unlock-aug5",
    title: "ATOM Token Unlock - Aug 5",
    description: "500K ATOM tokens linear unlock",
    enabled: false,
    type: "unlock",
  },
  {
    id: "sei-unlock-sep1",
    title: "SEI Token Unlock - Sep 1",
    description: "30M SEI tokens cliff unlock",
    enabled: true,
    type: "unlock",
  },
  {
    id: "whale-movements",
    title: "Whale Movements",
    description: "Large transactions > $100K",
    enabled: true,
    type: "whale",
  },
  {
    id: "anomaly-detection",
    title: "Anomaly Detection",
    description: "Unusual wallet behavior patterns",
    enabled: false,
    type: "anomaly",
  },
  {
    id: "general-alerts",
    title: "General Market Alerts",
    description: "Price movements and volume spikes",
    enabled: true,
    type: "general",
  },
]

export default function WalletProfilePage() {
  const params = useParams()
  const address = params.address as string
  
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>(mockAlertSettings)
  const [walletAddress, setWalletAddress] = useState(address || "0x1234...5678")
  const [telegramUsername, setTelegramUsername] = useState("@yourhandle")
  const [email, setEmail] = useState("user@example.com")
  const [discordUsername, setDiscordUsername] = useState("user#1234")

  useEffect(() => {
    // In a real app, this would fetch from a backend endpoint like /api/wallet-profile/alerts
    // For now, we'll just use the mock data as the initial state.
    console.log("Fetching wallet profile for address:", address)
  }, [address])

  const handleAlertToggle = (alertId: string) => {
    setAlertSettings((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert)),
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "unlock":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "whale":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "anomaly":
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4 text-purple-600" />
    }
  }

  const unlockAlerts = alertSettings.filter((alert) => alert.type === "unlock")
  const otherAlerts = alertSettings.filter((alert) => alert.type !== "unlock")

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">AI WALLET MONITOR</h1>
              <p className="text-slate-500">Intelligent wallet monitoring for {address}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wallet Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI Wallet Intelligence
                </CardTitle>
                <CardDescription className="text-slate-500">Your wallet under AI-powered monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="wallet-address" className="text-slate-700">
                    Monitored Wallet Address
                  </Label>
                  <Input
                    id="wallet-address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-slate-900 mt-1"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">AI Status</span>
                  <Badge className="bg-green-600 text-white flex items-center">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Smart Alerts</span>
                  <Badge variant="outline" className="text-slate-700 border-slate-300">
                    {alertSettings.filter((alert) => alert.enabled).length} AI-Powered
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Risk Score</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Medium (7.2/10)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Notification Channels */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-600" />
                  AI Notification Channels
                </CardTitle>
                <CardDescription className="text-slate-500">Configure how you receive intelligent alerts and insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="text-slate-700 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Telegram
                  </Label>
                  <Input
                    id="telegram"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discord" className="text-slate-700 flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Discord
                  </Label>
                  <Input
                    id="discord"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Token Unlock Alerts */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  AI Token Unlock Alerts
                </CardTitle>
                <CardDescription className="text-slate-500">
                  AI-powered predictions for token unlock impacts and market movements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {unlockAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-medium text-slate-900">{alert.title}</h4>
                        <p className="text-sm text-slate-500">{alert.description}</p>
                      </div>
                    </div>
                    <Switch checked={alert.enabled} onCheckedChange={() => handleAlertToggle(alert.id)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Other AI Alerts */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Advanced AI Monitoring
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Machine learning-powered detection of market anomalies and whale behaviors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {otherAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-medium text-slate-900">{alert.title}</h4>
                        <p className="text-sm text-slate-500">{alert.description}</p>
                      </div>
                    </div>
                    <Switch checked={alert.enabled} onCheckedChange={() => handleAlertToggle(alert.id)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Bot className="h-4 w-4 mr-2" />
                Save AI Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}