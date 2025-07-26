"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Brain, TrendingUp, Shield, Clock, Zap, Target, Star, AlertTriangle } from "lucide-react"

interface WalletPersonality {
  type: string
  confidence: number
  traits: string[]
  description: string
  color: string
}

interface BehaviorMetrics {
  tradingFrequency: number
  riskTolerance: number
  diversification: number
  timeHorizon: number
  socialInfluence: number
  technicalSophistication: number
}

interface IdentityInsights {
  walletAge: number
  totalTransactions: number
  averageTransactionSize: number
  preferredTokens: string[]
  activeHours: number[]
  networkConnections: number
  reputation: number
}

export function IdentityProfiler() {
  const [walletAddress, setWalletAddress] = useState("sei1abc...def")
  const [personality, setPersonality] = useState<WalletPersonality | null>(null)
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics | null>(null)
  const [identityInsights, setIdentityInsights] = useState<IdentityInsights | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock data untuk demo
  const mockPersonality: WalletPersonality = {
    type: "Smart Money Accumulator",
    confidence: 87,
    traits: ["Patient", "Research-Driven", "Risk-Aware", "Trend-Follower"],
    description: "Wallet ini menunjukkan pola akumulasi yang cerdas dengan timing entry yang presisi. Cenderung hold jangka panjang dan diversifikasi portfolio dengan baik.",
    color: "bg-blue-500"
  }

  const mockBehaviorMetrics: BehaviorMetrics = {
    tradingFrequency: 65,
    riskTolerance: 45,
    diversification: 78,
    timeHorizon: 82,
    socialInfluence: 34,
    technicalSophistication: 91
  }

  const mockIdentityInsights: IdentityInsights = {
    walletAge: 245,
    totalTransactions: 1247,
    averageTransactionSize: 2850,
    preferredTokens: ["SEI", "USDC", "ETH", "ATOM"],
    activeHours: [9, 10, 11, 14, 15, 16, 20, 21],
    networkConnections: 156,
    reputation: 78
  }

  useEffect(() => {
    // Simulate loading personality data
    setIsAnalyzing(true)
    setTimeout(() => {
      setPersonality(mockPersonality)
      setBehaviorMetrics(mockBehaviorMetrics)
      setIdentityInsights(mockIdentityInsights)
      setIsAnalyzing(false)
    }, 2000)
  }, [])

  const getPersonalityTypes = () => [
    { type: "HODLER", description: "Long-term investor", percentage: 23 },
    { type: "FLIPPER", description: "Short-term trader", percentage: 18 },
    { type: "FARMER", description: "DeFi yield hunter", percentage: 15 },
    { type: "ARBITRAGEUR", description: "Cross-platform trader", percentage: 12 },
    { type: "WHALE", description: "Large volume trader", percentage: 8 },
    { type: "SNIPER", description: "Early opportunity hunter", percentage: 7 },
    { type: "COLLECTOR", description: "NFT enthusiast", percentage: 6 },
    { type: "OTHERS", description: "Mixed behavior", percentage: 11 }
  ]

  const getMetricColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-blue-600"
    if (value >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getMetricBg = (value: number) => {
    if (value >= 80) return "bg-green-100"
    if (value >= 60) return "bg-blue-100"
    if (value >= 40) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Identity Profiler</h2>
          <p className="text-muted-foreground">AI-powered behavioral analysis dan personality mapping</p>
        </div>
        <Badge variant="outline" className="bg-purple-50">
          <Brain className="h-3 w-3 mr-1" />
          ML Confidence: {personality?.confidence || 0}%
        </Badge>
      </div>

      {isAnalyzing ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto text-purple-500 mb-4 animate-pulse" />
              <p className="text-lg font-medium">Analyzing Behavioral Patterns...</p>
              <p className="text-sm text-muted-foreground">Processing 42 behavioral parameters</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="personality" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personality">Personality DNA</TabsTrigger>
            <TabsTrigger value="behavior">Behavior Metrics</TabsTrigger>
            <TabsTrigger value="insights">Identity Insights</TabsTrigger>
            <TabsTrigger value="prediction">Predictive Model</TabsTrigger>
          </TabsList>

          <TabsContent value="personality" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Personality Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Wallet Personality Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personality && (
                    <>
                      <div className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarFallback className={`${personality.color} text-white text-xl`}>
                            {personality.type.split(' ').map(word => word[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-bold">{personality.type}</h3>
                        <p className="text-sm text-muted-foreground mt-2">{personality.description}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Confidence Level</span>
                          <span className="text-sm">{personality.confidence}%</span>
                        </div>
                        <Progress value={personality.confidence} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Key Traits</h4>
                        <div className="flex flex-wrap gap-2">
                          {personality.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary">{trait}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Personality Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Personality Type Distribution</CardTitle>
                  <CardDescription>Distribusi tipe personality di network SEI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getPersonalityTypes().map((type, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{type.type}</span>
                          <span>{type.percentage}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={type.percentage} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-20">{type.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {behaviorMetrics && Object.entries(behaviorMetrics).map(([key, value]) => {
                const labels: Record<string, { label: string, icon: any, description: string }> = {
                  tradingFrequency: { label: "Trading Frequency", icon: Zap, description: "Seberapa sering melakukan trading" },
                  riskTolerance: { label: "Risk Tolerance", icon: Shield, description: "Toleransi terhadap risiko investasi" },
                  diversification: { label: "Diversification", icon: Target, description: "Tingkat diversifikasi portfolio" },
                  timeHorizon: { label: "Time Horizon", icon: Clock, description: "Orientasi jangka waktu investasi" },
                  socialInfluence: { label: "Social Influence", icon: TrendingUp, description: "Pengaruh media sosial terhadap keputusan" },
                  technicalSophistication: { label: "Technical Skill", icon: Brain, description: "Tingkat kecanggihan teknis" }
                }
                
                const metric = labels[key]
                const IconComponent = metric.icon
                
                return (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <IconComponent className="h-4 w-4" />
                        {metric.label}
                      </CardTitle>
                      <CardDescription className="text-xs">{metric.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={`text-2xl font-bold ${getMetricColor(value)}`}>{value}</span>
                          <span className="text-sm text-muted-foreground">/100</span>
                        </div>
                        <Progress value={value} className="h-2" />
                        <div className={`text-xs p-2 rounded ${getMetricBg(value)}`}>
                          {value >= 80 ? "Sangat Tinggi" : value >= 60 ? "Tinggi" : value >= 40 ? "Sedang" : "Rendah"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  {identityInsights && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{identityInsights.walletAge}</p>
                        <p className="text-sm text-blue-600">Days Active</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{identityInsights.totalTransactions.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Total Transactions</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">${identityInsights.averageTransactionSize.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">Avg Transaction</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{identityInsights.reputation}/100</p>
                        <p className="text-sm text-orange-600">Reputation Score</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {identityInsights && (
                    <>
                      <div>
                        <h4 className="font-medium mb-2">Preferred Tokens</h4>
                        <div className="flex flex-wrap gap-2">
                          {identityInsights.preferredTokens.map((token, index) => (
                            <Badge key={index} variant="outline">{token}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Active Hours (UTC)</h4>
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 24 }, (_, i) => (
                            <div
                              key={i}
                              className={`h-6 rounded text-xs flex items-center justify-center ${
                                identityInsights.activeHours.includes(i)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Network Connections</h4>
                        <div className="flex items-center gap-2">
                          <Progress value={(identityInsights.networkConnections / 500) * 100} className="flex-1" />
                          <span className="text-sm font-medium">{identityInsights.networkConnections}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Predictive Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">High Probability (85%)</h4>
                    <p className="text-sm text-green-600">Wallet akan melakukan accumulation dalam 48 jam berdasarkan pola historis</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Medium Probability (67%)</h4>
                    <p className="text-sm text-blue-600">Kemungkinan diversifikasi ke token baru dalam 1 minggu</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Low Probability (23%)</h4>
                    <p className="text-sm text-yellow-600">Kemungkinan exit dari posisi utama dalam 30 hari</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Risk Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <p className="font-medium text-red-800">Unusual Activity Detected</p>
                    <p className="text-sm text-red-600">Trading frequency meningkat 300% dari rata-rata</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <p className="font-medium text-yellow-800">Pattern Change</p>
                    <p className="text-sm text-yellow-600">Shift dari long-term ke short-term trading pattern</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-medium text-blue-800">New Connection</p>
                    <p className="text-sm text-blue-600">Terhubung dengan 5 wallet baru dalam 24 jam</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}