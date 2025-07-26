"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/app/core/layout/Sidebar"
import { WalletProvider } from "@/app/core/providers/WalletProvider"
import { GlobalMetrics } from "@/app/features/analytics/components/GlobalMetrics"
import { RecentTransactions } from "@/app/features/analytics/components/RecentTransactions"
import { TopWhales } from "@/app/features/analytics/components/TopWhales"
// Legacy components removed - now using Ultra-Dense Architecture components
import { APIDocumentation } from "@/app/features/api-management/components/APIDocumentation"
import { mockData } from "@/app/lib/constants/mockData";

// Ultra-Dense Architecture Components
import { WalletGraphExplorer } from "@/app/features/wallet-intelligence/components/WalletGraphExplorer"
import { IdentityProfiler } from "@/app/features/wallet-intelligence/components/IdentityProfiler"
import { ThreatMonitor } from "@/app/features/risk-radar/components/ThreatMonitor"
import { LiquidityRadar } from "@/app/features/capital-flow/components/LiquidityRadar"
import { FlowPatternDetector } from "@/app/features/capital-flow/components/FlowPatternDetector"
import { SmartMoneyTracker } from "@/app/features/capital-flow/components/SmartMoneyTracker"
import { HabitAnalyzer } from "@/app/features/behavioral-dna/components/HabitAnalyzer"
import { SentimentDecoder } from "@/app/features/behavioral-dna/components/SentimentDecoder"
import { PredictiveModel } from "@/app/features/behavioral-dna/components/PredictiveModel"
import { StrategyBacktester } from "@/app/features/alpha-synthesis/components/StrategyBacktester"
import { ReportGenerator } from "@/app/features/alpha-synthesis/components/ReportGenerator"
import { AlphaRanking } from "@/app/features/alpha-synthesis/components/AlphaRanking"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [connectedWallet, setConnectedWallet] = useState(null)

  useEffect(() => {
    const wallet = localStorage.getItem("connectedWallet")
    if (wallet) {
      setConnectedWallet(wallet as any)
    } else {
      window.location.href = "/"
    }
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <GlobalMetrics data={mockData.globalKPIs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions transactions={mockData.recentTransactions} />
              <TopWhales whales={mockData.topWhales} />
            </div>
          </div>
        )
      // Ultra-Dense Architecture Tabs
      case "wallet-graph-explorer":
        return <WalletGraphExplorer />
      case "identity-profiler":
        return <IdentityProfiler />
      case "annotated-timeline":
        return <IdentityProfiler /> // Using Identity Profiler for timeline view
      case "behavioral-insights":
        return <HabitAnalyzer /> // Using Habit Analyzer for behavioral insights
      case "threat-monitor":
        return <ThreatMonitor />
      case "contract-auditor":
        return <ThreatMonitor /> // Using Threat Monitor for contract auditing
      case "exploit-simulation":
        return <ThreatMonitor /> // Using Threat Monitor for exploit simulation
      case "vulnerability-scanner":
        return <ThreatMonitor /> // Using Threat Monitor for vulnerability scanning
      case "liquidity-radar":
        return <LiquidityRadar />
      case "flow-pattern-detector":
        return <FlowPatternDetector />
      case "smart-money-tracker":
        return <SmartMoneyTracker />
      case "cross-chain-monitor":
        return <FlowPatternDetector /> // Using Flow Pattern Detector for cross-chain monitoring
      case "habit-analyzer":
        return <HabitAnalyzer />
      case "sentiment-decoder":
        return <SentimentDecoder />
      case "predictive-model":
        return <PredictiveModel />
      case "personality-profiler":
        return <SentimentDecoder /> // Using Sentiment Decoder for personality profiling
      case "strategy-backtester":
        return <StrategyBacktester />
      case "report-generator":
        return <ReportGenerator />
      case "alpha-ranking":
        return <AlphaRanking />
      case "live-signals":
        return <AlphaRanking /> // Using Alpha Ranking for live signals
      // Legacy tabs removed - all functionality now available through Ultra-Dense Architecture
      case "api-docs":
        return <APIDocumentation />
      default:
        return (
          <div className="space-y-6">
            <GlobalMetrics data={mockData.globalKPIs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions transactions={mockData.recentTransactions} />
              <TopWhales whales={mockData.topWhales} />
            </div>
          </div>
        )
    }
  }

  if (!connectedWallet) return null

  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </WalletProvider>
  )
}
