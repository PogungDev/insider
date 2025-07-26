"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart3, PieChart as PieChartIcon, Target, Zap, Brain, Eye } from "lucide-react"

const whaleActivityData = [
  { date: '2024-01-01', transactions: 45, volume: 2400000, whales: 12 },
  { date: '2024-01-02', transactions: 52, volume: 3100000, whales: 15 },
  { date: '2024-01-03', transactions: 38, volume: 1800000, whales: 9 },
  { date: '2024-01-04', transactions: 67, volume: 4200000, whales: 18 },
  { date: '2024-01-05', transactions: 71, volume: 5100000, whales: 22 },
  { date: '2024-01-06', transactions: 59, volume: 3800000, whales: 16 },
  { date: '2024-01-07', transactions: 84, volume: 6200000, whales: 25 }
]

const whaleDistributionData = [
  { tier: 'Mega Whales', count: 8, percentage: 12, value: 45000000, color: '#8B5CF6' },
  { tier: 'Large Whales', count: 23, percentage: 35, value: 28000000, color: '#3B82F6' },
  { tier: 'Medium Whales', count: 45, percentage: 53, value: 15000000, color: '#10B981' }
]

const tokenHoldingsData = [
  { token: 'ETH', amount: 125000, value: 285000000, percentage: 42, whales: 67 },
  { token: 'BTC', amount: 8500, value: 195000000, percentage: 29, whales: 45 },
  { token: 'USDC', amount: 89000000, value: 89000000, percentage: 13, whales: 78 },
  { token: 'USDT', amount: 67000000, value: 67000000, percentage: 10, whales: 56 },
  { token: 'Others', amount: 0, value: 42000000, percentage: 6, whales: 123 }
]

const behaviorPatternsData = [
  { pattern: 'Accumulation', frequency: 45, impact: 'Bullish', confidence: 87 },
  { pattern: 'Distribution', frequency: 23, impact: 'Bearish', confidence: 92 },
  { pattern: 'Rotation', frequency: 67, impact: 'Neutral', confidence: 78 },
  { pattern: 'Arbitrage', frequency: 34, impact: 'Neutral', confidence: 65 },
  { pattern: 'Staking', frequency: 89, impact: 'Bullish', confidence: 95 }
]

const marketImpactData = [
  { time: '00:00', price: 2400, volume: 1200000, whaleActivity: 15 },
  { time: '04:00', price: 2420, volume: 1800000, whaleActivity: 23 },
  { time: '08:00', price: 2380, volume: 2100000, whaleActivity: 45 },
  { time: '12:00', price: 2450, volume: 3200000, whaleActivity: 67 },
  { time: '16:00', price: 2480, volume: 2800000, whaleActivity: 34 },
  { time: '20:00', price: 2460, volume: 2400000, whaleActivity: 28 }
]

const topWhaleProfiles = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db4C2b8b5C2f',
    label: 'Ethereum Foundation',
    tier: 'mega',
    holdings: '$45.2M',
    activity: 'High',
    strategy: 'Long-term Hold',
    riskScore: 15,
    influence: 95
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c22C2C2f',
    label: 'Institutional Whale #1',
    tier: 'large',
    holdings: '$28.7M',
    activity: 'Medium',
    strategy: 'DeFi Yield',
    riskScore: 25,
    influence: 78
  },
  {
    id: '3',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    label: 'Trading Whale',
    tier: 'large',
    holdings: '$19.3M',
    activity: 'Very High',
    strategy: 'Active Trading',
    riskScore: 45,
    influence: 82
  }
]

export function WhaleAnalytics() {
  const [timeframe, setTimeframe] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('volume')
  const [analysisType, setAnalysisType] = useState('overview')

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'mega': return 'bg-purple-500'
      case 'large': return 'bg-blue-500'
      case 'medium': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Bullish': return 'text-green-600 bg-green-50'
      case 'Bearish': return 'text-red-600 bg-red-50'
      case 'Neutral': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50'
    if (score < 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Whale Analytics Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered Analysis
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Whales</p>
                <p className="text-2xl font-bold text-purple-700">76</p>
                <p className="text-xs text-purple-500">+12% this week</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Holdings</p>
                <p className="text-2xl font-bold text-blue-700">$678M</p>
                <p className="text-xs text-blue-500">+8.5% this week</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">24h Volume</p>
                <p className="text-2xl font-bold text-green-700">$124M</p>
                <p className="text-xs text-green-500">+23% vs yesterday</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Market Impact</p>
                <p className="text-2xl font-bold text-orange-700">High</p>
                <p className="text-xs text-orange-500">87% correlation</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={analysisType} onValueChange={setAnalysisType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="impact">Market Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Whale Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={whaleActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="transactions" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="whales" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Volume Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={whaleActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="volume" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Top Whale Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topWhaleProfiles.map((whale) => (
                  <div key={whale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={`${getTierColor(whale.tier)} text-white`}>
                        {whale.tier.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-semibold">{whale.label}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {whale.address.slice(0, 10)}...{whale.address.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{whale.holdings}</p>
                        <p className="text-sm text-gray-500">{whale.strategy}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Activity: {whale.activity}</p>
                        <Badge className={getRiskColor(whale.riskScore)}>
                          Risk: {whale.riskScore}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Influence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={whale.influence} className="w-16" />
                          <span className="text-sm">{whale.influence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                  Whale Distribution by Tier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={whaleDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ tier, percentage }) => `${tier}: ${percentage}%`}
                    >
                      {whaleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Token Holdings Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tokenHoldingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="token" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Behavioral Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {behaviorPatternsData.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{pattern.pattern}</p>
                        <p className="text-sm text-gray-500">Frequency: {pattern.frequency} occurrences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge className={getImpactColor(pattern.impact)}>
                        {pattern.impact}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={pattern.confidence} className="w-20" />
                          <span className="text-sm">{pattern.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Market Impact Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketImpactData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="price" stroke="#10B981" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="whaleActivity" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}