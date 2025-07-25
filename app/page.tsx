"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wallet,
  Zap,
  Brain,
  Target,
  Bell,
  Users,
  TrendingUp,
  Shield,
  Database,
  Wifi,
  Clock,
  DollarSign,
  CalendarDays,
  ArrowRight,
  CheckCircle,
  Activity,
  BarChart3,
  Github,
  Twitter,
  FileText,
  Play,
  ExternalLink,
  Bot,
  Server,
} from "lucide-react"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      // Save wallet address to localStorage for persistence
      const mockWalletAddress = "0x1234567890abcdef1234567890abcdef12345678"
      localStorage.setItem("connectedWallet", mockWalletAddress)

      // Show success toast
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      // Redirect to dashboard after successful connection
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert className="border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully connected to wallet 0x1234...5678
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">INSIDER</h1>
                <p className="text-slate-500">Sei Blockchain Analytics & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-emerald-600 border-emerald-600 glass">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 hover-lift"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI-Powered Wallet Intelligence
            <span className="block text-slate-700 dark:text-slate-300"> for Sei Blockchain</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            The first comprehensive tooling infrastructure for building AI agents on Sei. 
            Analyze wallet behaviors, predict market movements, and detect anomalies with 95%+ accuracy 
            using advanced machine learning and real-time blockchain data.
          </p>
          
          {/* Key Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="gradient-purple p-6 rounded-lg glass hover-lift soft-shadow">
              <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">AI Agent Infrastructure</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Complete SDK and APIs for building intelligent trading bots</p>
            </div>
            <div className="gradient-blue p-6 rounded-lg glass hover-lift soft-shadow">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">95%+ Detection Accuracy</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Proven ML models for rugpull and anomaly detection</p>
            </div>
            <div className="gradient-green p-6 rounded-lg glass hover-lift soft-shadow">
              <Zap className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Real-time Processing</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Sub-second alerts and 1M+ transactions/day capacity</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 hover-lift text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Start Building"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass border-blue-200 dark:border-blue-800 hover-lift text-lg px-8 py-3"
              onClick={() => router.push('/api-docs')}
            >
              <FileText className="h-5 w-5 mr-2" />
              View API Docs
            </Button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass hover-lift soft-shadow border-0">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
              </CardContent>
            </Card>
            <Card className="glass hover-lift soft-shadow border-0">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
            <Card className="glass hover-lift soft-shadow border-0">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">AI</div>
                <div className="text-sm text-muted-foreground">Powered Analytics</div>
              </CardContent>
            </Card>
            <Card className="glass hover-lift soft-shadow border-0">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">Free</div>
                <div className="text-sm text-muted-foreground">No API Keys</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Live Data Preview */}
        <section className="mb-16">
          <Card className="glass hover-lift soft-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Live Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="gradient-blue p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Whale Activity</h3>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$2.4M</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Last 24h volume</p>
                </div>
                <div className="gradient-purple p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Dev Wallets</h3>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">127</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Active this week</p>
                </div>
                <div className="gradient-green p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Token Unlocks</h3>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">15</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Next 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Performance Metrics */}
        <section className="mb-16">
          <Card className="glass hover-lift soft-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">API Calls</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">~50ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data Processing</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">~200ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">AI Analysis</span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">~1.2s</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">System Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Memory Usage</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">CPU Load</span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cache Hit Rate</span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Agent Infrastructure */}
        <section className="mb-16">
          <Card className="glass hover-lift soft-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Agent Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Smart Contract Analysis</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Automated risk assessment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Pattern recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Anomaly detection
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-300">Behavioral Insights</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Whale movement prediction
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Dev wallet identification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Market sentiment analysis
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Backend Architecture */}
        <section className="mb-16">
          <Card className="glass hover-lift soft-shadow border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                Backend Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Data Layer</h3>
                  <p className="text-sm text-muted-foreground">Real-time blockchain data ingestion and processing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Processing Engine</h3>
                  <p className="text-sm text-muted-foreground">High-performance analytics and ML inference</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Security Layer</h3>
                  <p className="text-sm text-muted-foreground">Rate limiting, authentication, and data protection</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Action Buttons */}
        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 hover-lift"
              onClick={() => router.push('/dashboard')}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Open Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="glass border-blue-200 dark:border-blue-800 hover-lift"
              onClick={() => router.push('/api-docs')}
            >
              <FileText className="mr-2 h-5 w-5" />
              API Documentation
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
