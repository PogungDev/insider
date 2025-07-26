"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/app/core/layout/Sidebar"
import { WalletProvider } from "@/app/core/providers/WalletProvider"
import { GlobalMetrics } from "@/app/features/analytics/components/GlobalMetrics"
import { RecentTransactions } from "@/app/features/analytics/components/RecentTransactions"
import { TopWhales } from "@/app/features/analytics/components/TopWhales"
import { WalletSearch } from "@/app/features/wallet-explorer/components/WalletSearch"
import { WhaleWatch } from "@/app/features/whale-tracking/components/WhaleWatch"
import { DevScreener } from "@/app/features/analytics/components/DevScreener"
import { TrackedWallets } from "@/app/features/wallet-explorer/components/TrackedWallets"
import { WalletOverview } from "@/app/features/wallet-explorer/components/WalletOverview"
import { TxLog } from "@/app/features/wallet-explorer/components/TxLog"
import { WalletTagging } from "@/app/features/wallet-explorer/components/WalletTagging"
import { WhaleAlerts } from "@/app/features/whale-tracking/components/WhaleAlerts"
import { WhaleAnalytics } from "@/app/features/whale-tracking/components/WhaleAnalytics"
import { NetworkMetrics } from "@/app/features/analytics/components/NetworkMetrics"
import { TokenFlows } from "@/app/features/analytics/components/TokenFlows"
import { SentimentAnalysis } from "@/app/features/analytics/components/SentimentAnalysis"
import { AlertRules } from "@/app/features/alerts/components/AlertRules"
import { AlertHistory } from "@/app/features/alerts/components/AlertHistory"
import { UnlockCalendar } from "@/app/features/unlocks/components/UnlockCalendar"
import { ReportHistory } from "@/app/features/reports/components/ReportHistory"
import { APIDocumentation } from "@/app/features/api-management/components/APIDocumentation"
import { mockData } from "@/app/lib/constants/mockData";

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

  if (!connectedWallet) return null

  return (
    <WalletProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar setActiveTab={setActiveTab} />
        <div className="flex-1 p-6">
          {activeTab === "overview" && (
            <>
              <GlobalMetrics data={mockData.globalKPIs} />
              <RecentTransactions transactions={mockData.recentTransactions} />
              <TopWhales whales={mockData.topWhales} />
            </>
          )}
          {activeTab === "search" && <WalletSearch />}
          {activeTab === "whale-watch" && <WhaleWatch />}
          {activeTab === "dev-screener" && <DevScreener />}
          {activeTab === "tracked-wallets" && <TrackedWallets />}
          {activeTab === "wallet-overview" && <WalletOverview />}
          {activeTab === "tx-log" && <TxLog />}
          {activeTab === "wallet-tagging" && <WalletTagging />}
          {activeTab === "whale-alerts" && <WhaleAlerts />}
          {activeTab === "whale-analytics" && <WhaleAnalytics />}
          {activeTab === "network-metrics" && <NetworkMetrics />}
          {activeTab === "token-flows" && <TokenFlows />}
          {activeTab === "sentiment-analysis" && <SentimentAnalysis />}
          {activeTab === "alert-rules" && <AlertRules />}
          {activeTab === "alert-history" && <AlertHistory />}
          {activeTab === "unlock-calendar" && <UnlockCalendar />}
          {activeTab === "report-history" && <ReportHistory />}
          {activeTab === "api-docs" && <APIDocumentation />}
        </div>
      </div>
    </WalletProvider>
  )
}
