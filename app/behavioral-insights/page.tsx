"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, Activity, TrendingUp, Users, Search } from "lucide-react"
import { SpendingHeatmap } from "@/components/spending-heatmap"
import { TopTokensChart } from "@/components/top-tokens-chart"
import { WhaleTransferPlot } from "@/components/whale-transfer-plot"
import { AIRecommendationPanel } from "@/components/ai-recommendation-panel"

interface BehaviorMetrics {
  riskScore: number
  diversificationIndex: number
  activityConsistency: number
  whaleInfluence: number
  defiEngagement: number
}

interface SpendingPattern {
  dailyAverage: number
  weeklyTrend: string
  topCategories: { category: string; percentage: number }[]
}

export default function BehavioralInsightsPage() {
  const [walletAddress, setWalletAddress] = useState("0x1234...5678")
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics | null>(null)
  const [spendingPattern, setSpendingPattern] = useState<SpendingPattern | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load wallet from localStorage
    const savedWallet = localStorage.getItem("connectedWallet")
    if (savedWallet) {
      setWalletAddress(savedWallet)
    }
  }, [])

  useEffect(() => {
    if (walletAddress) {
      fetchBehaviorData()
    }
  }, [walletAddress])

  const fetchBehaviorData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/insights/${walletAddress}`)
      const data = await response.json()
      setBehaviorMetrics(data.behaviorMetrics)
      setSpendingPattern(data.spendingPattern)
    } catch (error) {
      console.error("Failed to fetch behavior data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 0.3) return "text-red-600"
    if (score < 0.7) return "text-orange-600"
    return "text-green-600"
  }

  const getScoreLabel = (score: number) => {
    if (score < 0.3) return "Low"
    if (score < 0.7) return "Medium"
    return "High"
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-br from-purple-50 to-blue-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">AI Wallet Intelligence</h1>
                <p className="text-slate-600 mt-1">
                  Advanced ML-powered behavioral analysis and risk assessment for Sei wallets
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Enter wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-64 bg-white border-slate-300 text-slate-900 focus:border-purple-500"
                />
              </div>
              <Button onClick={fetchBehaviorData} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="h-4 w-4 mr-2" />
                {isLoading ? "Processing..." : "Analyze with AI"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* AI Intelligence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {behaviorMetrics ? (
            <>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-red-600" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.riskScore)}`}>
                    {(behaviorMetrics.riskScore * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.riskScore)}`}>
                    {getScoreLabel(behaviorMetrics.riskScore)} Risk Level
                  </p>
                  <Progress value={behaviorMetrics.riskScore * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                    Portfolio Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.diversificationIndex)}`}>
                    {(behaviorMetrics.diversificationIndex * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.diversificationIndex)}`}>
                    Diversification Score
                  </p>
                  <Progress value={behaviorMetrics.diversificationIndex * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-600" />
                    Trading Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.activityConsistency)}`}>
                    {(behaviorMetrics.activityConsistency * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.activityConsistency)}`}>
                    Consistency Score
                  </p>
                  <Progress value={behaviorMetrics.activityConsistency * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-900 flex items-center">
                    <Bot className="h-4 w-4 mr-2 text-purple-600" />
                    AI Confidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(behaviorMetrics.defiEngagement)}`}>
                    {(behaviorMetrics.defiEngagement * 100).toFixed(0)}%
                  </div>
                  <p className={`text-xs ${getScoreColor(behaviorMetrics.defiEngagement)}`}>
                    Prediction Accuracy
                  </p>
                  <Progress value={behaviorMetrics.defiEngagement * 100} className="mt-2" />
                </CardContent>
              </Card>
            </>
          ) : (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="animate-pulse pt-6">
                  <div className="h-8 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-2 bg-slate-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* AI Behavioral Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Pattern Recognition
              </CardTitle>
              <p className="text-sm text-slate-600">Machine learning insights on trading behavior</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Trading Style</span>
                  <span className="text-lg font-semibold text-blue-600">Conservative DeFi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Risk Tolerance</span>
                  <span className="text-lg font-semibold text-green-600">Medium-Low</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Behavior Similarity</span>
                  <span className="text-lg font-semibold text-slate-900">Institutional</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Anomaly Detection</span>
                  <span className="text-lg font-semibold text-green-600">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                AI Recommendations
              </CardTitle>
              <p className="text-sm text-slate-600">Personalized suggestions based on analysis</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-1">
                    <Activity className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Portfolio Optimization</span>
                  </div>
                  <p className="text-xs text-blue-700">Consider diversifying into yield farming protocols</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-900">Risk Management</span>
                  </div>
                  <p className="text-xs text-green-700">Your current risk level is optimal for your profile</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center mb-1">
                    <Brain className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-orange-900">Gas Optimization</span>
                  </div>
                  <p className="text-xs text-orange-700">Batch transactions during low-fee periods</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Intelligence Dashboard */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              AI Intelligence Dashboard
            </CardTitle>
            <p className="text-sm text-slate-600">Advanced machine learning analysis and predictions</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="heatmap" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                <TabsTrigger value="heatmap" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Map
                </TabsTrigger>
                <TabsTrigger value="tokens" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Token Intelligence
                </TabsTrigger>
                <TabsTrigger value="whales" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Risk Signals
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Predictions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="heatmap">
                <SpendingHeatmap walletAddress={walletAddress} />
              </TabsContent>

              <TabsContent value="tokens">
                <TopTokensChart walletAddress={walletAddress} />
              </TabsContent>

              <TabsContent value="whales">
                <WhaleTransferPlot walletAddress={walletAddress} />
              </TabsContent>

              <TabsContent value="ai">
                <AIRecommendationPanel walletAddress={walletAddress} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
