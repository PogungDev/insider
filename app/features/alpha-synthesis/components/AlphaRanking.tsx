"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Trophy, TrendingUp, TrendingDown, Star, Zap, Target, Brain, Eye, Copy, Filter, Search, Crown, Medal, Award, Flame, BarChart3, Users, Clock, DollarSign } from "lucide-react"

interface AlphaSignal {
  id: string
  rank: number
  title: string
  type: 'trade' | 'investment' | 'arbitrage' | 'yield' | 'nft' | 'defi'
  confidence: number
  expectedReturn: number
  timeframe: string
  riskLevel: 'low' | 'medium' | 'high'
  source: string
  description: string
  tags: string[]
  createdAt: number
  expiresAt: number
  followers: number
  successRate: number
  avgReturn: number
  isHot: boolean
  isPremium: boolean
  author: {
    name: string
    reputation: number
    verified: boolean
    totalSignals: number
  }
}

interface AlphaProvider {
  id: string
  name: string
  rank: number
  reputation: number
  totalSignals: number
  successRate: number
  avgReturn: number
  followers: number
  verified: boolean
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  specialties: string[]
  recentPerformance: number
  joinedAt: number
}

interface TrendingAlpha {
  id: string
  title: string
  category: string
  momentum: number
  volume: number
  mentions: number
  sentiment: number
  timeframe: string
  description: string
}

export function AlphaRanking() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [searchQuery, setSearchQuery] = useState("")
  const [alphaSignals, setAlphaSignals] = useState<AlphaSignal[]>([])
  const [alphaProviders, setAlphaProviders] = useState<AlphaProvider[]>([])
  const [trendingAlphas, setTrendingAlphas] = useState<TrendingAlpha[]>([])
  const [activeTab, setActiveTab] = useState("signals")

  // Mock data untuk demo
  const mockAlphaSignals: AlphaSignal[] = [
    {
      id: '1',
      rank: 1,
      title: 'SEI Ecosystem Breakout Play',
      type: 'trade',
      confidence: 94,
      expectedReturn: 45.2,
      timeframe: '2-4 weeks',
      riskLevel: 'medium',
      source: 'Technical Analysis + On-chain',
      description: 'Strong accumulation pattern with whale activity surge. Technical breakout above $0.52 resistance.',
      tags: ['SEI', 'breakout', 'whale-activity', 'technical'],
      createdAt: Date.now() - 1800000,
      expiresAt: Date.now() + 86400000 * 7,
      followers: 1247,
      successRate: 87.5,
      avgReturn: 32.8,
      isHot: true,
      isPremium: false,
      author: {
        name: 'CryptoWhaleTracker',
        reputation: 9.2,
        verified: true,
        totalSignals: 156
      }
    },
    {
      id: '2',
      rank: 2,
      title: 'Cross-Chain Arbitrage Opportunity',
      type: 'arbitrage',
      confidence: 91,
      expectedReturn: 12.8,
      timeframe: '1-3 days',
      riskLevel: 'low',
      source: 'Multi-exchange Analysis',
      description: 'Price discrepancy between Binance and Coinbase for ATOM. 8.5% spread detected.',
      tags: ['ATOM', 'arbitrage', 'binance', 'coinbase'],
      createdAt: Date.now() - 3600000,
      expiresAt: Date.now() + 86400000 * 2,
      followers: 892,
      successRate: 94.2,
      avgReturn: 8.7,
      isHot: false,
      isPremium: true,
      author: {
        name: 'ArbitrageBot',
        reputation: 8.8,
        verified: true,
        totalSignals: 342
      }
    },
    {
      id: '3',
      rank: 3,
      title: 'DeFi Yield Farming Strategy',
      type: 'yield',
      confidence: 88,
      expectedReturn: 78.5,
      timeframe: '3-6 months',
      riskLevel: 'high',
      source: 'DeFi Protocol Analysis',
      description: 'New liquidity mining program with 120% APY. Risk assessment shows sustainable tokenomics.',
      tags: ['DeFi', 'yield-farming', 'liquidity-mining', 'high-apy'],
      createdAt: Date.now() - 7200000,
      expiresAt: Date.now() + 86400000 * 14,
      followers: 2156,
      successRate: 76.3,
      avgReturn: 45.2,
      isHot: true,
      isPremium: false,
      author: {
        name: 'DeFiAlphaHunter',
        reputation: 9.5,
        verified: true,
        totalSignals: 89
      }
    },
    {
      id: '4',
      rank: 4,
      title: 'NFT Collection Floor Price Play',
      type: 'nft',
      confidence: 82,
      expectedReturn: 25.6,
      timeframe: '1-2 weeks',
      riskLevel: 'high',
      source: 'NFT Market Analysis',
      description: 'Undervalued blue-chip collection with upcoming utility release. Floor price 40% below fair value.',
      tags: ['NFT', 'blue-chip', 'undervalued', 'utility'],
      createdAt: Date.now() - 10800000,
      expiresAt: Date.now() + 86400000 * 10,
      followers: 567,
      successRate: 68.9,
      avgReturn: 28.4,
      isHot: false,
      isPremium: true,
      author: {
        name: 'NFTFloorTracker',
        reputation: 7.9,
        verified: false,
        totalSignals: 234
      }
    },
    {
      id: '5',
      rank: 5,
      title: 'Layer 2 Token Accumulation',
      type: 'investment',
      confidence: 85,
      expectedReturn: 156.7,
      timeframe: '6-12 months',
      riskLevel: 'medium',
      source: 'Fundamental Analysis',
      description: 'Undervalued L2 token with strong fundamentals. Upcoming mainnet launch and major partnerships.',
      tags: ['layer2', 'fundamentals', 'mainnet', 'partnerships'],
      createdAt: Date.now() - 14400000,
      expiresAt: Date.now() + 86400000 * 30,
      followers: 1834,
      successRate: 81.7,
      avgReturn: 67.3,
      isHot: false,
      isPremium: false,
      author: {
        name: 'L2ResearchLab',
        reputation: 9.1,
        verified: true,
        totalSignals: 67
      }
    }
  ]

  const mockAlphaProviders: AlphaProvider[] = [
    {
      id: '1',
      name: 'DeFiAlphaHunter',
      rank: 1,
      reputation: 9.5,
      totalSignals: 89,
      successRate: 87.2,
      avgReturn: 45.8,
      followers: 12547,
      verified: true,
      tier: 'platinum',
      specialties: ['DeFi', 'Yield Farming', 'Protocol Analysis'],
      recentPerformance: 92.3,
      joinedAt: Date.now() - 86400000 * 365
    },
    {
      id: '2',
      name: 'CryptoWhaleTracker',
      rank: 2,
      reputation: 9.2,
      totalSignals: 156,
      successRate: 84.6,
      avgReturn: 38.7,
      followers: 8934,
      verified: true,
      tier: 'gold',
      specialties: ['Whale Analysis', 'Technical Analysis', 'Market Timing'],
      recentPerformance: 89.1,
      joinedAt: Date.now() - 86400000 * 280
    },
    {
      id: '3',
      name: 'L2ResearchLab',
      rank: 3,
      reputation: 9.1,
      totalSignals: 67,
      successRate: 89.5,
      avgReturn: 52.3,
      followers: 6782,
      verified: true,
      tier: 'gold',
      specialties: ['Layer 2', 'Fundamental Analysis', 'Infrastructure'],
      recentPerformance: 94.7,
      joinedAt: Date.now() - 86400000 * 180
    },
    {
      id: '4',
      name: 'ArbitrageBot',
      rank: 4,
      reputation: 8.8,
      totalSignals: 342,
      successRate: 91.2,
      avgReturn: 12.4,
      followers: 4521,
      verified: true,
      tier: 'silver',
      specialties: ['Arbitrage', 'Cross-Exchange', 'Automated Trading'],
      recentPerformance: 93.8,
      joinedAt: Date.now() - 86400000 * 420
    },
    {
      id: '5',
      name: 'NFTFloorTracker',
      rank: 5,
      reputation: 7.9,
      totalSignals: 234,
      successRate: 72.8,
      avgReturn: 28.9,
      followers: 3156,
      verified: false,
      tier: 'bronze',
      specialties: ['NFT', 'Floor Price Analysis', 'Collection Research'],
      recentPerformance: 76.4,
      joinedAt: Date.now() - 86400000 * 150
    }
  ]

  const mockTrendingAlphas: TrendingAlpha[] = [
    {
      id: '1',
      title: 'AI Token Narrative',
      category: 'Sector Rotation',
      momentum: 94.2,
      volume: 2500000,
      mentions: 15600,
      sentiment: 87.5,
      timeframe: '2-4 weeks',
      description: 'AI tokens gaining massive momentum with institutional adoption'
    },
    {
      id: '2',
      title: 'RWA Tokenization',
      category: 'Emerging Trend',
      momentum: 89.7,
      volume: 1800000,
      mentions: 12300,
      sentiment: 82.1,
      timeframe: '1-3 months',
      description: 'Real World Asset tokenization trend accelerating'
    },
    {
      id: '3',
      title: 'Cosmos Ecosystem',
      category: 'Ecosystem Play',
      momentum: 85.3,
      volume: 3200000,
      mentions: 9800,
      sentiment: 79.6,
      timeframe: '3-6 weeks',
      description: 'Cosmos ecosystem tokens showing coordinated strength'
    },
    {
      id: '4',
      title: 'Memecoin Season',
      category: 'Market Cycle',
      momentum: 78.9,
      volume: 5600000,
      mentions: 28900,
      sentiment: 71.2,
      timeframe: '1-2 weeks',
      description: 'Memecoin rotation showing early signs of momentum'
    }
  ]

  useEffect(() => {
    setAlphaSignals(mockAlphaSignals)
    setAlphaProviders(mockAlphaProviders)
    setTrendingAlphas(mockTrendingAlphas)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trade': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'investment': return <Target className="h-4 w-4 text-blue-500" />
      case 'arbitrage': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'yield': return <DollarSign className="h-4 w-4 text-purple-500" />
      case 'nft': return <Star className="h-4 w-4 text-pink-500" />
      case 'defi': return <Brain className="h-4 w-4 text-orange-500" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return <Crown className="h-4 w-4 text-purple-500" />
      case 'gold': return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'silver': return <Medal className="h-4 w-4 text-gray-400" />
      case 'bronze': return <Award className="h-4 w-4 text-orange-500" />
      default: return <Star className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-800'
      case 'gold': return 'bg-yellow-100 text-yellow-800'
      case 'silver': return 'bg-gray-100 text-gray-800'
      case 'bronze': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-500" />
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
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

  const copySignal = (signalId: string) => {
    // Copy signal logic
    console.log('Copying signal:', signalId)
  }

  const followProvider = (providerId: string) => {
    // Follow provider logic
    console.log('Following provider:', providerId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alpha Ranking</h2>
          <p className="text-muted-foreground">Discover dan rank alpha signals terbaik dari komunitas</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alpha signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="trade">Trade</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="arbitrage">Arbitrage</SelectItem>
              <SelectItem value="yield">Yield</SelectItem>
              <SelectItem value="nft">NFT</SelectItem>
              <SelectItem value="defi">DeFi</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="signals">Alpha Signals</TabsTrigger>
          <TabsTrigger value="providers">Top Providers</TabsTrigger>
          <TabsTrigger value="trending">Trending Alpha</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="signals" className="space-y-4">
          <div className="space-y-3">
            {alphaSignals.map((signal) => (
              <Card key={signal.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(signal.rank)}
                        {signal.isHot && <Flame className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(signal.type)}
                          <h3 className="font-semibold">{signal.title}</h3>
                          {signal.isPremium && <Badge variant="secondary">Premium</Badge>}
                          <Badge className={getRiskColor(signal.riskLevel)}>
                            {signal.riskLevel} risk
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{signal.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Expected Return</p>
                            <p className="font-semibold text-green-600">+{signal.expectedReturn.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="font-semibold">{signal.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Timeframe</p>
                            <p className="font-semibold">{signal.timeframe}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Success Rate</p>
                            <p className="font-semibold">{signal.successRate}%</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{signal.followers} followers</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(signal.createdAt)}</span>
                            </div>
                            <span>by {signal.author.name}</span>
                            {signal.author.verified && <Badge variant="outline" className="text-xs">Verified</Badge>}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {signal.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button size="sm" onClick={() => copySignal(signal.id)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Confidence Level</span>
                      <span>{signal.confidence}%</span>
                    </div>
                    <Progress value={signal.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alphaProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRankIcon(provider.rank)}
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          {provider.verified && <Badge variant="outline">Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          {getTierIcon(provider.tier)}
                          <Badge className={getTierColor(provider.tier)}>
                            {provider.tier}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => followProvider(provider.id)}>
                      Follow
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Reputation</p>
                      <p className="font-semibold">{provider.reputation.toFixed(1)}/10</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold text-green-600">{provider.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Return</p>
                      <p className="font-semibold text-blue-600">+{provider.avgReturn.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-semibold">{provider.followers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Signals</p>
                      <p className="font-semibold">{provider.totalSignals}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recent Performance</p>
                      <p className="font-semibold text-purple-600">{provider.recentPerformance.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Reputation Score</span>
                      <span>{provider.reputation.toFixed(1)}/10</span>
                    </div>
                    <Progress value={provider.reputation * 10} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendingAlphas.map((alpha, index) => (
              <Card key={alpha.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-red-500" />
                      <CardTitle className="text-lg">{alpha.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{alpha.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{alpha.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Momentum</p>
                      <p className="font-semibold text-red-600">{alpha.momentum.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{formatCurrency(alpha.volume)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mentions</p>
                      <p className="font-semibold">{alpha.mentions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sentiment</p>
                      <p className="font-semibold text-green-600">{alpha.sentiment.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Trending Momentum</span>
                      <span>{alpha.momentum.toFixed(1)}%</span>
                    </div>
                    <Progress value={alpha.momentum} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Timeframe: {alpha.timeframe}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Explore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Top Performers (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alphaProviders.slice(0, 5).map((provider, index) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">#{index + 1}</span>
                      <span className="text-sm">{provider.name}</span>
                      {provider.verified && <Badge variant="outline" className="text-xs">✓</Badge>}
                    </div>
                    <span className="text-sm font-semibold text-green-600">+{provider.recentPerformance.toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Highest Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alphaProviders.sort((a, b) => b.successRate - a.successRate).slice(0, 5).map((provider, index) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">#{index + 1}</span>
                      <span className="text-sm">{provider.name}</span>
                      {provider.verified && <Badge variant="outline" className="text-xs">✓</Badge>}
                    </div>
                    <span className="text-sm font-semibold text-blue-600">{provider.successRate.toFixed(1)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Most Followed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alphaProviders.sort((a, b) => b.followers - a.followers).slice(0, 5).map((provider, index) => (
                  <div key={provider.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">#{index + 1}</span>
                      <span className="text-sm">{provider.name}</span>
                      {provider.verified && <Badge variant="outline" className="text-xs">✓</Badge>}
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{provider.followers.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}