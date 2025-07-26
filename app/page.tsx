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
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2">
          ✅ Wallet Connected Successfully!
        </div>
      )}

      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                INSIDER
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/api-docs')}
              >
                API Docs
              </Button>
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
            Wallet Behavior Analyst
            <span className="block text-slate-700 dark:text-slate-300"> for Sei Blockchain</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Advanced analytics platform for understanding specific wallet behavior on Sei blockchain. 
            Monitor transaction patterns, detect anomalies, and gain investment insights with 
            real-time AI and machine learning technology.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-purple-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-purple-800 mb-1">Wallet Intelligence Hub</h3>
              <p className="text-sm text-purple-700">Graph Explorer, Identity Profiler, and Behavioral Clustering</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-blue-800 mb-1">Risk Radar System</h3>
              <p className="text-sm text-blue-700">Threat Monitor, Contract Auditor, and Exploit Simulator</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-green-800 mb-1">Behavioral DNA Analysis</h3>
              <p className="text-sm text-green-700">Habit Analyzer, Sentiment Decoder, and Predictive Model</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-3"
            >
              {isConnecting ? "Connecting..." : "Start Analysis"}
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
              🔄 How Wallet Behavior Analyst Works
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">🔍</div>
                <h4 className="text-lg font-semibold mb-2 text-blue-700">Wallet Input & Search</h4>
                <p className="text-gray-600 text-sm">
                  Enter wallet address for in-depth analysis. Universal Search 
                  enables fast and accurate searching across the entire blockchain.
                </p>
                <div className="mt-3 text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">Instant Search</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">🕸️</div>
                <h4 className="text-lg font-semibold mb-2 text-purple-700">Graph Exploration</h4>
                <p className="text-gray-600 text-sm">
                  Interactive visualization of wallet relationships with Graph Explorer. 
                  Identify hidden clusters and connection patterns.
                </p>
                <div className="mt-3 text-xs text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded">Interactive Network</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-green-200 hover:border-green-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">🧬</div>
                <h4 className="text-lg font-semibold mb-2 text-green-700">Behavioral Analysis</h4>
                <p className="text-gray-600 text-sm">
                  Habit Analyzer identifies unique behavioral patterns of each wallet. 
                  Sentiment Decoder and Predictive Model for deep insights.
                </p>
                <div className="mt-3 text-xs text-green-600 font-mono bg-green-50 px-2 py-1 rounded">AI-Powered Insights</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                <div className="text-3xl mb-4">⚠️</div>
                <h4 className="text-lg font-semibold mb-2 text-yellow-700">Risk & Alerts</h4>
                <p className="text-gray-600 text-sm">
                  Threat Monitor for detecting suspicious activities. 
                  Multi-Layer Alerts provide real-time warnings.
                </p>
                <div className="mt-3 text-xs text-yellow-600 font-mono bg-yellow-50 px-2 py-1 rounded">Real-time Monitoring</div>
              </div>
            </div>
            
            {/* Data Flow Visualization */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold mb-4 text-center text-gray-800">Wallet Analysis Flow</h4>
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg border border-blue-200">
                  Wallet Address
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg border border-purple-200">
                  Graph Explorer
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg border border-green-200">
                  Behavioral DNA
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg border border-yellow-200">
                  Risk Analysis
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg border border-indigo-200">
                  Insights & Reports
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
                  <div className="text-gray-400">// Instant wallet analysis</div>
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
              <p className="text-sm text-gray-600">Graph Explorer for network visualization, Identity Profiler for deep analysis, Behavioral Clustering for pattern grouping, and Annotated Timeline for historical tracking.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-semibold text-lg mb-2 text-red-800">Risk Radar System</h4>
              <p className="text-sm text-gray-600">Threat Monitor for real-time detection, Contract Auditor for smart contract security analysis, Liquidity Scanner, and Exploit Simulator for attack simulation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">💰</div>
              <h4 className="font-semibold text-lg mb-2 text-green-800">Capital Flow Nexus</h4>
              <p className="text-sm text-gray-600">Liquidity Radar for liquidity monitoring, Flow Pattern Detector for fund flow analysis, Smart Money Tracker, and Cross-Chain Monitor for cross-blockchain tracking.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🧬</div>
              <h4 className="font-semibold text-lg mb-2 text-purple-800">Behavioral DNA</h4>
              <p className="text-sm text-gray-600">Habit Analyzer for trading habit analysis, Sentiment Decoder for sentiment analysis, Personality Profiler for trader personality profiling, and Predictive Model for behavior prediction.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold text-lg mb-2 text-indigo-800">Alpha Synthesis Engine</h4>
              <p className="text-sm text-gray-600">Strategy Backtester for strategy testing, Report Generator for automated reports, Alpha Ranking for opportunity ranking, and AI Recommendations for investment recommendations.</p>
            </div>
            <div className="bg-white p-6 rounded-lg border hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-semibold text-lg mb-2 text-orange-800">Multi-Layer Alerts</h4>
              <p className="text-sm text-gray-600">Multi-layered alert system with real-time notifications for suspicious activities, behavioral pattern changes, and potential investment opportunities.</p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Real-time Monitoring</div>
            </div>
            <div className="bg-white p-6 text-center rounded-lg border">
              <div className="text-2xl font-bold text-green-600">95%+</div>
              <div className="text-sm text-gray-600">Detection Accuracy</div>
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
                  <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-200">Analyzed Wallets</h3>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">1,247</p>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Active monitoring</p>
                </div>
                <div className="gradient-green p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200">Risk Alerts</h3>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">23</p>
                  <p className="text-sm text-green-700 dark:text-green-300">Today's detections</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
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
