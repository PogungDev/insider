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
import { UniversalSearch } from "@/app/features/shared/components/UniversalSearch"
import { MultiLayerAlerts } from "@/app/features/shared/components/MultiLayerAlerts"
import { Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    // Ensure this code only runs in the browser
    if (typeof window !== 'undefined') {
      const wallet = localStorage.getItem("connectedWallet")
      if (wallet) {
        setConnectedWallet(wallet as any)
      } else {
        window.location.href = "/"
      }
    }
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6 p-4 bg-white rounded-lg shadow">
            <GlobalMetrics data={mockData.globalKPIs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentTransactions transactions={mockData.recentTransactions} />
              <TopWhales whales={mockData.topWhales} />
            </div>
          </div>
        )
      case "wallet-graph-explorer":
        return <WalletGraphExplorer />
      case "identity-profiler":
        return <IdentityProfiler />
      case "behavioral-clustering":
        return <HabitAnalyzer /> // Placeholder for Behavioral Clustering
      case "annotated-timeline":
        return <IdentityProfiler />
      case "threat-monitor":
        return <ThreatMonitor />
      case "contract-auditor":
        return <ThreatMonitor />
      case "liquidity-scanner":
        return <LiquidityRadar /> // Placeholder for Liquidity Scanner
      case "exploit-simulator":
        return <ThreatMonitor />
      case "liquidity-radar":
        return <LiquidityRadar />
      case "flow-pattern-detector":
        return <FlowPatternDetector />
      case "smart-money-tracker":
        return <SmartMoneyTracker />
      case "cross-chain-monitor":
        return <FlowPatternDetector />
      case "habit-analyzer":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Habit Analyzer</h1>
            </div>
            <HabitAnalyzer />
          </div>
        )
      case "alerts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Multi-Layer Alerts</h1>
            </div>
            <MultiLayerAlerts />
          </div>
        )
      case "sentiment-decoder":
        return <SentimentDecoder />
      case "personality-profiler":
        return <SentimentDecoder />
      case "predictive-model":
        return <PredictiveModel />
      case "strategy-backtester":
        return <StrategyBacktester />
      case "report-generator":
        return <ReportGenerator />
      case "alpha-ranking":
        return <AlphaRanking />
      case "ai-recommendations":
        return <PredictiveModel /> // Placeholder for AI Recommendations
      default:
        return <div className="text-center p-4">Content for {activeTab} is coming soon!</div>
    }
  }

  if (!connectedWallet) return null

  return (
    <WalletProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-2xl">
                <UniversalSearch />
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('alerts')}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt="@user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">User</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          user@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </WalletProvider>
  )
}
