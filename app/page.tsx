"use client"

import { useState } from "react"
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
} from "lucide-react"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showToast, setShowToast] = useState(false)

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
        window.location.href = "/dashboard"
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
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
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">INSIDER</h1>
                <p className="text-slate-500">Sei Blockchain Analytics & Monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-purple-600 hover:bg-purple-700"
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
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            AI-Powered Wallet Intelligence
            <span className="text-purple-600"> for Sei Blockchain</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            The first comprehensive tooling infrastructure for building AI agents on Sei. 
            Analyze wallet behaviors, predict market movements, and detect anomalies with 95%+ accuracy 
            using advanced machine learning and real-time blockchain data.
          </p>
          
          {/* Key Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">AI Agent Infrastructure</h3>
              <p className="text-sm text-slate-600">Complete SDK and APIs for building intelligent trading bots</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">95%+ Detection Accuracy</h3>
              <p className="text-sm text-slate-600">Proven ML models for rugpull and anomaly detection</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-900 mb-1">Real-time Processing</h3>
              <p className="text-sm text-slate-600">Sub-second alerts and 1M+ transactions/day capacity</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Start Building"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-slate-300 text-slate-700 bg-transparent"
              onClick={() => window.open("/api-docs", "_blank")}
            >
              <FileText className="h-5 w-5 mr-2" />
              View API Docs
            </Button>
          </div>
        </section>

        {/* SDK & Integration Preview */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Developer-First Infrastructure</h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Built for developers building the next generation of AI agents on Sei. 
              Simple APIs, comprehensive SDKs, and real-time data streams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Code Example */}
            <Card className="bg-slate-900 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Quick Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-green-400 overflow-x-auto">
{`// Install INSIDER SDK
npm install @insider/sei-sdk

// Initialize wallet monitoring
import { InsiderSDK } from '@insider/sei-sdk'

const insider = new InsiderSDK({
  apiKey: 'your-api-key',
  network: 'sei-mainnet'
})

// Monitor wallet behavior
const analysis = await insider.analyzeWallet(
  '0x1234...5678'
)

console.log(analysis.riskScore) // 0.23
console.log(analysis.patterns) // ['whale', 'defi']
`}
                </pre>
              </CardContent>
            </Card>

            {/* Live Data Preview */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Live Data Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="font-medium text-green-900">Whale Movement Detected</p>
                    <p className="text-sm text-green-700">$2.3M SEI transfer</p>
                  </div>
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <p className="font-medium text-orange-900">Token Unlock Alert</p>
                    <p className="text-sm text-orange-700">$ATOM unlock in 2 hours</p>
                  </div>
                  <Badge className="bg-orange-600 text-white">ALERT</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-900">AI Prediction</p>
                    <p className="text-sm text-blue-700">Bullish pattern (89% confidence)</p>
                  </div>
                  <Badge className="bg-blue-600 text-white">AI</Badge>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleConnectWallet}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try Live Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Production-Ready Performance</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Trusted by developers and institutions for mission-critical applications
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm text-center">
              <CardContent className="pt-6">
                <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">95.7%</div>
                <p className="text-slate-500">AI Detection Accuracy</p>
                <p className="text-xs text-purple-600 mt-1">Rugpull & Anomaly Detection</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">&lt;200ms</div>
                <p className="text-slate-500">API Response Time</p>
                <p className="text-xs text-yellow-600 mt-1">99.9% Uptime SLA</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center">
              <CardContent className="pt-6">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">1.2M+</div>
                <p className="text-slate-500">Transactions/Day</p>
                <p className="text-xs text-blue-600 mt-1">Real-time Processing</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-slate-900">50+</div>
                <p className="text-slate-500">AI Agents Built</p>
                <p className="text-xs text-green-600 mt-1">Developer Community</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Infrastructure Architecture */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">AI Agent Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Database className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">1. Data Ingestion</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Real-time Sei blockchain data via WebSocket, RPC endpoints, and off-chain APIs. 
                  1M+ transactions processed daily with sub-second latency.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">2. ML Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Advanced machine learning models for pattern recognition, anomaly detection, and predictive analytics.
                  95%+ accuracy for rugpull detection.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">3. API Layer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  RESTful APIs and WebSocket streams for real-time data access. 
                  Complete SDK for JavaScript, Python, and Go developers.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="bg-white border-slate-200 shadow-sm text-center p-6">
              <CardHeader>
                <Bot className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-slate-900 text-xl">4. AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-500">
                  Deploy intelligent trading bots, monitoring systems, and automated strategies.
                  Pre-built templates and custom agent frameworks.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Backend Architecture Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Backend Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-600 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data Collection
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Sei RPC WebSocket</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">CryptoRank API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Messari API</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Cron Jobs (6h interval)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Real-time Processing
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">WebSocket Listeners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">On-chain Event Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">MongoDB/Postgres</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Status Confirmation</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-600 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                API Endpoints
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/list</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/next</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/unlocks/impact</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">/api/subscribe</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-600 flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Alert System
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Telegram Bots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Discord Webhooks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Email Notifications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Real-time Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Technical Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Detection Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Token Unlock Detection</span>
                    <span className="text-slate-700">98%</span>
                  </div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Whale Movement</span>
                    <span className="text-slate-700">94%</span>
                  </div>
                  <Progress value={94} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">Anomaly Detection</span>
                    <span className="text-slate-700">89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Real-time Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-slate-700">API Response: &lt;300ms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-600" />
                  <span className="text-slate-700">Alert Delivery: &lt;60s</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-700">Data Points: 1.2M/hour</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Uptime: 99.9%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Data Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Off-chain Fetch (6h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">On-chain Confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Status Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-slate-700">Alert Routing</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Agent Use Cases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">AI Agent Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-purple-50 border-purple-200 shadow-sm">
              <CardContent className="pt-6">
                <Bot className="h-8 w-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Trading Bots</h4>
                <p className="text-sm text-slate-700">
                  Build intelligent trading agents that react to whale movements, token unlocks, and market anomalies 
                  with millisecond precision.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 shadow-sm">
              <CardContent className="pt-6">
                <Shield className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Risk Monitoring</h4>
                <p className="text-sm text-slate-700">
                  Deploy AI agents for real-time rugpull detection, suspicious activity monitoring, and 
                  compliance automation for DeFi protocols.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Market Intelligence</h4>
                <p className="text-sm text-slate-700">
                  Create AI-powered market analysis tools that predict trends, identify opportunities, 
                  and provide institutional-grade insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200 shadow-sm">
              <CardContent className="pt-6">
                <Bell className="h-8 w-8 text-orange-600 mb-4" />
                <h4 className="font-semibold text-slate-900 mb-2">Alert Systems</h4>
                <p className="text-sm text-slate-700">
                  Build custom notification agents for portfolio management, whale tracking, 
                  and automated risk assessment across multiple wallets.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-12 border border-purple-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Building AI Agents Today</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Join the developer community building the next generation of intelligent blockchain applications on Sei. 
            Get started with our comprehensive SDK and real-time data infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Try Live Dashboard"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-purple-300 text-purple-700 bg-white hover:bg-purple-50"
              onClick={() => window.open("/api-docs", "_blank")}
            >
              <FileText className="h-5 w-5 mr-2" />
              API Documentation
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              Free tier available
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              Production-ready
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-slate-900">INSIDER</span>
              </div>
              <p className="text-slate-500 text-sm">
                Advanced blockchain analytics and monitoring platform for the Sei ecosystem.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Developer Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/api-docs" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="/sdk" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    SDK & Libraries
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/insider-sei"
                    className="text-slate-500 hover:text-purple-600 flex items-center"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <a href="/examples" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    AI Agent Examples
                  </a>
                </li>
                <li>
                  <a href="/tutorials" className="text-slate-500 hover:text-purple-600">
                    Tutorials & Guides
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/pricing" className="text-slate-500 hover:text-purple-600">
                    Pricing & Plans
                  </a>
                </li>
                <li>
                  <a href="/status" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    System Status
                  </a>
                </li>
                <li>
                  <a href="/changelog" className="text-slate-500 hover:text-purple-600">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="/roadmap" className="text-slate-500 hover:text-purple-600">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/discord" className="text-slate-500 hover:text-purple-600 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Discord Community
                  </a>
                </li>
                <li>
                  <a href="/support" className="text-slate-500 hover:text-purple-600">
                    Developer Support
                  </a>
                </li>
                <li>
                  <a href="/faq" className="text-slate-500 hover:text-purple-600">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/feedback" className="text-slate-500 hover:text-purple-600">
                    Feature Requests
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/terms" className="text-slate-500 hover:text-purple-600">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-slate-500 hover:text-purple-600">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/cookies" className="text-slate-500 hover:text-purple-600">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-slate-200">
            <p className="text-slate-500 text-sm">© 2025 Sei Blockchain Analytics. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://github.com/your-repo" className="text-slate-500 hover:text-purple-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/your-handle" className="text-slate-500 hover:text-purple-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://discord.gg/your-server" className="text-slate-500 hover:text-purple-600">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
