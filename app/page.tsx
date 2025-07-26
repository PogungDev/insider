"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet } from "lucide-react"

export default function LandingPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      const mockWalletAddress = "0x1234567890abcdef1234567890abcdef12345678"
      localStorage.setItem("connectedWallet", mockWalletAddress)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className="border-green-500 bg-green-50 p-4 rounded">
            <p className="text-green-800">
              Successfully connected to wallet 0x1234...5678
            </p>
          </div>
        </div>
      )}

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
              <span className="text-emerald-600 border border-emerald-600 px-2 py-1 rounded text-sm">
                Live
              </span>
              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI-Powered Wallet Intelligence
            <span className="block text-slate-700 dark:text-slate-300"> for Sei Blockchain</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            The first comprehensive tooling infrastructure for building AI agents on Sei. 
            Analyze wallet behaviors, predict market movements, and detect anomalies with 95%+ accuracy 
            using advanced machine learning and real-time blockchain data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-purple-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-purple-800 mb-1">AI Agent Infrastructure</h3>
              <p className="text-sm text-purple-700">Complete SDK and APIs for building intelligent trading bots</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-blue-800 mb-1">95%+ Detection Accuracy</h3>
              <p className="text-sm text-blue-700">Proven ML models for rugpull and anomaly detection</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-green-800 mb-1">Real-time Processing</h3>
              <p className="text-sm text-green-700">Sub-second alerts and 1M+ transactions/day capacity</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Start Building"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-blue-200 text-lg px-8 py-3"
              onClick={() => router.push('/api-docs')}
            >
              View API Docs
            </Button>
          </div>
        </section>

        <section className="mb-16">
          {/* How It Works Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 mb-12">
            <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🔄 How INSIDER Works
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">📡</div>
                <h4 className="text-lg font-semibold mb-2 text-blue-700">Data Capture</h4>
                <p className="text-gray-600 text-sm">
                  Real-time monitoring of Sei blockchain via WebSocket connections. 
                  Captures transactions, swaps, and contract interactions instantly.
                </p>
                <div className="mt-3 text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">&lt; 100ms latency</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">🧠</div>
                <h4 className="text-lg font-semibold mb-2 text-purple-700">AI Processing</h4>
                <p className="text-gray-600 text-sm">
                  Advanced ML algorithms analyze behavioral patterns, detect anomalies, 
                  and calculate multi-factor risk scores.
                </p>
                <div className="mt-3 text-xs text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded">&lt; 200ms processing</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">⚡</div>
                <h4 className="text-lg font-semibold mb-2 text-green-700">Real-time Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Instant behavioral classification, investment strategy generation, 
                  and alert rule evaluation.
                </p>
                <div className="mt-3 text-xs text-green-600 font-mono bg-green-50 px-2 py-1 rounded">&lt; 100ms analysis</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">🚨</div>
                <h4 className="text-lg font-semibold mb-2 text-yellow-700">Smart Alerts</h4>
                <p className="text-gray-600 text-sm">
                  Multi-channel alert delivery via Telegram, Discord, email. 
                  Intelligent routing based on severity and user preferences.
                </p>
                <div className="mt-3 text-xs text-yellow-600 font-mono bg-yellow-50 px-2 py-1 rounded">&lt; 50ms delivery</div>
              </div>
            </div>
            
            {/* Data Flow Visualization */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold mb-4 text-center text-gray-800">Complete Data Pipeline</h4>
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                  Sei Blockchain
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg border border-purple-200">
                  WebSocket Listeners
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg border border-green-200">
                  ML/AI Engine
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg border border-yellow-200">
                  Alert System
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg border border-indigo-200">
                  Dashboard UI
                </div>
              </div>
            </div>
          </div>
          
          {/* Integration Examples */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 border border-gray-200 mb-12">
            <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🔗 Easy Integration
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <h4 className="text-xl font-semibold mb-4 text-green-700">📱 REST API</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-gray-400">// Analyze any wallet instantly</div>
                  <div className="text-blue-300">const</div> <div className="text-white"> analysis = </div>
                  <div className="text-blue-300">await</div> <div className="text-yellow-300"> fetch</div>
                  <div className="text-white">(</div><div className="text-green-300">'api/wallet/sei1.../analysis'</div><div className="text-white">)</div>
                  <br/>
                  <div className="text-gray-400">// Get real-time behavior score</div>
                  <div className="text-blue-300">console</div><div className="text-white">.</div>
                  <div className="text-yellow-300">log</div><div className="text-white">(</div>
                  <div className="text-white">analysis.</div><div className="text-purple-300">behaviorScore</div>
                  <div className="text-white">)</div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                <h4 className="text-xl font-semibold mb-4 text-blue-700">⚡ WebSocket</h4>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <div className="text-gray-400">// Real-time wallet monitoring</div>
                  <div className="text-blue-300">const</div> <div className="text-white"> ws = </div>
                  <div className="text-blue-300">new</div> <div className="text-yellow-300"> WebSocket</div>
                  <div className="text-white">(</div><div className="text-green-300">'wss://api.insider.com/stream'</div><div className="text-white">)</div>
                  <br/>
                  <div className="text-gray-400">// Subscribe to alerts</div>
                  <div className="text-white">ws.</div><div className="text-yellow-300">send</div>
                  <div className="text-white">(</div><div className="text-purple-300">subscribeToWallet</div><div className="text-white">)</div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-semibold text-blue-700">Telegram Bot</div>
                <div className="text-sm text-gray-600 mt-1">Instant wallet analysis via /analyze command</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">🎮</div>
                <div className="font-semibold text-purple-700">Discord Integration</div>
                <div className="text-sm text-gray-600 mt-1">Community alerts and whale movements</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-semibold text-green-700">Webhook Support</div>
                <div className="text-sm text-gray-600 mt-1">Custom integrations for any platform</div>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Intelligence Suite
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🧠</div>
              <h4 className="font-semibold text-lg mb-2 text-blue-800">Wallet Intelligence Hub</h4>
              <p className="text-sm text-gray-600">Deep behavioral pattern recognition with ML-powered insights, transaction forensics, and predictive analytics for wallet behavior trends.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-semibold text-lg mb-2 text-red-800">Risk Radar System</h4>
              <p className="text-sm text-gray-600">Real-time security threat detection, vulnerability scanning, and compliance tracking with automated risk mitigation recommendations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-semibold text-lg mb-2 text-green-800">Capital Flow Nexus</h4>
              <p className="text-sm text-gray-600">Advanced capital movement visualization, liquidity analysis, and arbitrage detection with market impact assessment.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🧬</div>
              <h4 className="font-semibold text-lg mb-2 text-purple-800">Behavioral DNA</h4>
              <p className="text-sm text-gray-600">Advanced ML algorithms for behavioral analysis, habit mapping, and real-time anomaly detection with trend prediction.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-lg mb-2 text-indigo-800">Alpha Synthesis Engine</h4>
              <p className="text-sm text-gray-600">AI-powered investment strategy generation, portfolio optimization, and alpha discovery with comprehensive backtesting capabilities.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-semibold text-lg mb-2 text-orange-800">Multi-Layer Alerts</h4>
              <p className="text-sm text-gray-600">Context-aware smart notifications with custom rule engine, multi-channel delivery, and automated escalation management.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Real-time Monitoring</div>
            </div>
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-emerald-600">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <div className="text-sm text-gray-600">Powered Analytics</div>
            </div>
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-amber-600">Free</div>
              <div className="text-sm text-gray-600">No API Keys</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                Live Data Preview
              </h3>
            </div>
            <div className="p-6">
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
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-3"
              onClick={() => router.push('/dashboard')}
            >
              Open Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-200 text-lg px-8 py-3"
              onClick={() => router.push('/api-docs')}
            >
              API Documentation
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
