"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitBranch, TrendingUp, TrendingDown, Zap, Target, BarChart3, Network, ArrowRight, ArrowUpRight, ArrowDownRight, Repeat, Shuffle } from "lucide-react"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface FlowPattern {
  id: string
  type: 'accumulation' | 'distribution' | 'rotation' | 'arbitrage' | 'wash_trading' | 'pump_dump'
  confidence: number
  strength: number
  duration: number
  volume: number
  participants: number
  description: string
  riskLevel: 'low' | 'medium' | 'high'
  profitability: number
  timestamp: number
}

interface CrossChainFlow {
  id: string
  fromChain: string
  toChain: string
  token: string
  amount: number
  timestamp: number
  bridgeUsed: string
  fees: number
  timeToComplete: number
  isWhale: boolean
}

interface ArbitrageOpportunity {
  id: string
  tokenPair: string
  exchange1: string
  exchange2: string
  priceDiff: number
  profitPotential: number
  volume: number
  timeWindow: number
  riskScore: number
}

export function FlowPatternDetector() {
  const { targetWallet, analysisData } = useWallet()
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [flowPatterns, setFlowPatterns] = useState<FlowPattern[]>([])
  const [crossChainFlows, setCrossChainFlows] = useState<CrossChainFlow[]>([])
  const [arbitrageOps, setArbitrageOps] = useState<ArbitrageOpportunity[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    loadFlowData()
  }, [targetWallet, analysisData])

  const loadFlowData = () => {
    let mockPatterns: FlowPattern[] = [
      {
        id: "1",
        type: "accumulation",
        confidence: 87,
        strength: 92,
        duration: 6,
        volume: 2500000,
        participants: 23,
        description: "Smart money accumulation pattern detected in SEI/USDC with consistent buying pressure",
        riskLevel: "low",
        profitability: 15.2,
        timestamp: Date.now() - 3600000
      },
      {
        id: "2",
        type: "arbitrage",
        confidence: 94,
        strength: 78,
        duration: 2,
        volume: 890000,
        participants: 8,
        description: "Cross-DEX arbitrage pattern between DragonSwap and AstroPort",
        riskLevel: "medium",
        profitability: 3.8,
        timestamp: Date.now() - 1800000
      },
      {
        id: "3",
        type: "pump_dump",
        confidence: 76,
        strength: 85,
        duration: 4,
        volume: 1200000,
        participants: 45,
        description: "Potential pump and dump scheme detected in low-cap token",
        riskLevel: "high",
        profitability: -8.5,
        timestamp: Date.now() - 7200000
      },
      {
        id: "4",
        type: "rotation",
        confidence: 82,
        strength: 67,
        duration: 12,
        volume: 3400000,
        participants: 156,
        description: "Sector rotation from DeFi to GameFi tokens observed",
        riskLevel: "medium",
        profitability: 7.3,
        timestamp: Date.now() - 10800000
      }
    ]

    if (targetWallet && analysisData) {
      const walletPattern: FlowPattern = {
        id: `wallet-${targetWallet.slice(-8)}`,
        type: analysisData.riskScore > 70 ? 'accumulation' : 'distribution',
        confidence: analysisData.riskScore || 50,
        strength: Math.floor((analysisData.riskScore || 50) * 1.5),
        duration: Math.floor((analysisData.transactionCount || 100) / 10),
        volume: analysisData.totalValue || 500000,
        participants: Math.floor((analysisData.riskScore || 50) / 20),
        description: `Detected flow pattern for wallet ${targetWallet.slice(0,6)}...${targetWallet.slice(-4)}`,
        riskLevel: analysisData.riskScore > 70 ? 'low' : 'high',
        profitability: analysisData.riskScore > 70 ? 10 : -5,
        timestamp: Date.now() - 600000
      };
      mockPatterns.unshift(walletPattern);
    }

    let mockCrossChainFlows: CrossChainFlow[] = [
      {
        id: "1",
        fromChain: "Ethereum",
        toChain: "SEI",
        token: "USDC",
        amount: 450000,
        timestamp: Date.now() - 1200000,
        bridgeUsed: "Axelar",
        fees: 25.50,
        timeToComplete: 180,
        isWhale: true
      },
      {
        id: "2",
        fromChain: "Cosmos",
        toChain: "SEI",
        token: "ATOM",
        amount: 125000,
        timestamp: Date.now() - 2400000,
        bridgeUsed: "IBC",
        fees: 2.10,
        timeToComplete: 45,
        isWhale: false
      },
      {
        id: "3",
        fromChain: "SEI",
        toChain: "Osmosis",
        token: "SEI",
        amount: 280000,
        timestamp: Date.now() - 3600000,
        bridgeUsed: "IBC",
        fees: 1.80,
        timeToComplete: 60,
        isWhale: false
      }
    ]

    // Add wallet-specific cross-chain flows if targetWallet is available
    if (targetWallet && analysisData) {
      const walletCrossChainFlow: CrossChainFlow = {
        id: `wallet-flow-${targetWallet.slice(-8)}`,
        fromChain: "SEI",
        toChain: "Ethereum",
        token: "SEI",
        amount: (analysisData.totalValue || 100000) * 0.3,
        timestamp: Date.now() - 300000,
        bridgeUsed: "Axelar",
        fees: 15.25,
        timeToComplete: 120,
        isWhale: (analysisData.totalValue || 100000) > 500000
      }
      mockCrossChainFlows.unshift(walletCrossChainFlow)
    }

    const mockArbitrageOps: ArbitrageOpportunity[] = [
      {
        id: "1",
        tokenPair: "SEI/USDC",
        exchange1: "DragonSwap",
        exchange2: "AstroPort",
        priceDiff: 2.3,
        profitPotential: 1850,
        volume: 125000,
        timeWindow: 45,
        riskScore: 25
      },
      {
        id: "2",
        tokenPair: "ATOM/SEI",
        exchange1: "AstroPort",
        exchange2: "Kujira",
        priceDiff: 1.8,
        profitPotential: 920,
        volume: 89000,
        timeWindow: 120,
        riskScore: 35
      }
    ]

    setFlowPatterns(mockPatterns)
    setCrossChainFlows(mockCrossChainFlows)
    setArbitrageOps(mockArbitrageOps)
  }

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'accumulation': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'distribution': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'rotation': return <Repeat className="h-4 w-4 text-blue-500" />
      case 'arbitrage': return <Shuffle className="h-4 w-4 text-purple-500" />
      case 'wash_trading': return <Target className="h-4 w-4 text-orange-500" />
      case 'pump_dump': return <Zap className="h-4 w-4 text-red-600" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getPatternColor = (type: string) => {
    switch (type) {
      case 'accumulation': return 'bg-green-100 text-green-800'
      case 'distribution': return 'bg-red-100 text-red-800'
      case 'rotation': return 'bg-blue-100 text-blue-800'
      case 'arbitrage': return 'bg-purple-100 text-purple-800'
      case 'wash_trading': return 'bg-orange-100 text-orange-800'
      case 'pump_dump': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toFixed(0)}`
  }

  const runPatternAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      // Simulate new pattern detection
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flow Pattern Detector</h2>
          <p className="text-muted-foreground">AI-powered detection of capital movement patterns and trading behavior</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runPatternAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>
      </div>

      {/* Pattern Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <GitBranch className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{flowPatterns.length}</span>
            </div>
            <p className="text-sm font-medium mt-1">Active Patterns</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+2 new today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Network className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{crossChainFlows.length}</span>
            </div>
            <p className="text-sm font-medium mt-1">Cross-Chain Flows</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Last 24h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shuffle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{arbitrageOps.length}</span>
            </div>
            <p className="text-sm font-medium mt-1">Arbitrage Ops</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-600">$2.8K profit</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">85%</span>
            </div>
            <p className="text-sm font-medium mt-1">Avg Confidence</p>
            <Progress value={85} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patterns">Flow Patterns</TabsTrigger>
          <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
          <TabsTrigger value="arbitrage">Arbitrage</TabsTrigger>
          <TabsTrigger value="analytics">Pattern Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {flowPatterns.map((pattern) => (
              <Card key={pattern.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPatternIcon(pattern.type)}
                      <CardTitle className="text-lg capitalize">{pattern.type.replace('_', ' ')}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPatternColor(pattern.type)}>
                        {pattern.confidence}% confidence
                      </Badge>
                      <Badge variant="outline" className={getRiskColor(pattern.riskLevel)}>
                        {pattern.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{formatCurrency(pattern.volume)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{pattern.duration}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p className="font-semibold">{pattern.participants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profitability</p>
                      <p className={`font-semibold ${pattern.profitability >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pattern.profitability >= 0 ? '+' : ''}{pattern.profitability}%
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Pattern Strength</span>
                      <span>{pattern.strength}%</span>
                    </div>
                    <Progress value={pattern.strength} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Detected {formatTimeAgo(pattern.timestamp)}</span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crosschain" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Recent Cross-Chain Flows
                </CardTitle>
                <CardDescription>Tracking capital movement across blockchains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {crossChainFlows.map((flow) => (
                    <div key={flow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{flow.fromChain}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{flow.toChain}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(flow.amount)} {flow.token}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{flow.bridgeUsed}</span>
                          {flow.isWhale && <Badge variant="secondary" className="text-xs">Whale</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cross-Chain Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">$855K</p>
                      <p className="text-sm text-blue-600">Total Volume 24h</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">$29.40</p>
                      <p className="text-sm text-green-600">Avg Bridge Fees</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Ethereum → SEI</span>
                        <span>52%</span>
                      </div>
                      <Progress value={52} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cosmos → SEI</span>
                        <span>31%</span>
                      </div>
                      <Progress value={31} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SEI → Others</span>
                        <span>17%</span>
                      </div>
                      <Progress value={17} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arbitrage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {arbitrageOps.map((arb) => (
              <Card key={arb.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{arb.tokenPair}</CardTitle>
                    <Badge variant={arb.riskScore < 30 ? "default" : arb.riskScore < 60 ? "secondary" : "destructive"}>
                      Risk: {arb.riskScore}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{arb.exchange1}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span className="text-muted-foreground">{arb.exchange2}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price Diff</p>
                      <p className="font-semibold text-green-600">{arb.priceDiff}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit Potential</p>
                      <p className="font-semibold">{formatCurrency(arb.profitPotential)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{formatCurrency(arb.volume)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time Window</p>
                      <p className="font-semibold">{arb.timeWindow}s</p>
                    </div>
                  </div>

                  <Button className="w-full" size="sm">
                    Execute Arbitrage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pattern Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Accumulation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={35} className="w-20 h-2" />
                      <span className="text-sm font-medium">35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Arbitrage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={28} className="w-20 h-2" />
                      <span className="text-sm font-medium">28%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rotation</span>
                    <div className="flex items-center gap-2">
                      <Progress value={22} className="w-20 h-2" />
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Others</span>
                    <div className="flex items-center gap-2">
                      <Progress value={15} className="w-20 h-2" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">87%</p>
                    <p className="text-sm text-green-600">Pattern Accuracy</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$125K</p>
                    <p className="text-sm text-blue-600">Total Profits Tracked</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">2.3s</p>
                    <p className="text-sm text-purple-600">Avg Detection Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
