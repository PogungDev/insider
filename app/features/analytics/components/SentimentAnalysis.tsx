"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { TrendingUp, TrendingDown, Smile, Frown, Meh, MessageSquare, Twitter, Hash, Brain, Target, Zap, AlertTriangle, CheckCircle, Eye } from "lucide-react"

const sentimentTrends = [
  { time: '00:00', bullish: 65, bearish: 25, neutral: 10, volume: 1200 },
  { time: '04:00', bullish: 72, bearish: 18, neutral: 10, volume: 890 },
  { time: '08:00', bullish: 58, bearish: 32, neutral: 10, volume: 2100 },
  { time: '12:00', bullish: 45, bearish: 45, neutral: 10, volume: 3400 },
  { time: '16:00', bullish: 38, bearish: 52, neutral: 10, volume: 2800 },
  { time: '20:00', bullish: 42, bearish: 48, neutral: 10, volume: 2200 }
]

const socialMetrics = [
  {
    platform: 'Twitter',
    mentions: 45600,
    sentiment: 68,
    engagement: 2340000,
    influencers: 234,
    trending: true,
    change24h: 12.5
  },
  {
    platform: 'Reddit',
    mentions: 12800,
    sentiment: 72,
    engagement: 890000,
    influencers: 89,
    trending: false,
    change24h: -3.2
  },
  {
    platform: 'Discord',
    mentions: 8900,
    sentiment: 65,
    engagement: 450000,
    influencers: 156,
    trending: true,
    change24h: 8.7
  },
  {
    platform: 'Telegram',
    mentions: 6700,
    sentiment: 58,
    engagement: 320000,
    influencers: 67,
    trending: false,
    change24h: -1.8
  }
]

const keywordAnalysis = [
  { keyword: 'bullish', mentions: 8900, sentiment: 85, trend: 'up', impact: 'high' },
  { keyword: 'moon', mentions: 6700, sentiment: 92, trend: 'up', impact: 'medium' },
  { keyword: 'dump', mentions: 5400, sentiment: 15, trend: 'down', impact: 'high' },
  { keyword: 'hodl', mentions: 4500, sentiment: 78, trend: 'stable', impact: 'medium' },
  { keyword: 'fud', mentions: 3200, sentiment: 12, trend: 'down', impact: 'high' },
  { keyword: 'diamond hands', mentions: 2800, sentiment: 88, trend: 'up', impact: 'low' },
  { keyword: 'paper hands', mentions: 2100, sentiment: 25, trend: 'down', impact: 'medium' },
  { keyword: 'to the moon', mentions: 1900, sentiment: 95, trend: 'up', impact: 'low' }
]

const influencerMetrics = [
  {
    name: 'CryptoWhale',
    platform: 'Twitter',
    followers: 890000,
    engagement: 12.5,
    sentiment: 78,
    influence: 95,
    recentPost: 'Bullish on ETH fundamentals',
    impact: 'Very High'
  },
  {
    name: 'DeFiGuru',
    platform: 'Twitter',
    followers: 560000,
    engagement: 8.9,
    sentiment: 65,
    influence: 82,
    recentPost: 'Market correction incoming?',
    impact: 'High'
  },
  {
    name: 'BlockchainBull',
    platform: 'Reddit',
    followers: 340000,
    engagement: 15.2,
    sentiment: 85,
    influence: 76,
    recentPost: 'Long-term outlook remains positive',
    impact: 'High'
  },
  {
    name: 'CryptoBear',
    platform: 'Twitter',
    followers: 280000,
    engagement: 11.8,
    sentiment: 35,
    influence: 68,
    recentPost: 'Caution advised in current market',
    impact: 'Medium'
  }
]

const sentimentDrivers = [
  { factor: 'Technical Analysis', weight: 25, sentiment: 72, confidence: 85 },
  { factor: 'News & Events', weight: 30, sentiment: 58, confidence: 92 },
  { factor: 'Social Media', weight: 20, sentiment: 65, confidence: 78 },
  { factor: 'Whale Activity', weight: 15, sentiment: 45, confidence: 88 },
  { factor: 'Market Trends', weight: 10, sentiment: 38, confidence: 75 }
]

const emotionalAnalysis = [
  { emotion: 'Fear', intensity: 35, change: -8, color: '#EF4444' },
  { emotion: 'Greed', intensity: 68, change: 12, color: '#10B981' },
  { emotion: 'Hope', intensity: 72, change: 5, color: '#3B82F6' },
  { emotion: 'Anxiety', intensity: 42, change: -3, color: '#F59E0B' },
  { emotion: 'Euphoria', intensity: 28, change: -15, color: '#8B5CF6' },
  { emotion: 'Despair', intensity: 18, change: -12, color: '#6B7280' }
]

export function SentimentAnalysis() {
  const [timeframe, setTimeframe] = useState('24h')
  const [selectedAsset, setSelectedAsset] = useState('eth')
  const [analysisType, setAnalysisType] = useState('overview')

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'text-green-600 bg-green-50'
    if (sentiment >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 70) return <Smile className="h-4 w-4" />
    if (sentiment >= 40) return <Meh className="h-4 w-4" />
    return <Frown className="h-4 w-4" />
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const overallSentiment = 62
  const sentimentChange = 8.5

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Sentiment Analysis Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eth">Ethereum</SelectItem>
              <SelectItem value="btc">Bitcoin</SelectItem>
              <SelectItem value="market">Overall Market</SelectItem>
              <SelectItem value="defi">DeFi Sector</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Brain className="h-3 w-3 mr-1" />
            AI Sentiment Engine
          </Badge>
        </div>
      </div>

      {/* Overall Sentiment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Overall Sentiment</p>
                <p className="text-2xl font-bold text-purple-700">{overallSentiment}%</p>
                <p className="text-xs text-purple-500">+{sentimentChange}% vs yesterday</p>
              </div>
              {getSentimentIcon(overallSentiment)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Social Volume</p>
                <p className="text-2xl font-bold text-blue-700">74K</p>
                <p className="text-xs text-blue-500">+15% vs yesterday</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Bullish Signals</p>
                <p className="text-2xl font-bold text-green-700">68%</p>
                <p className="text-xs text-green-500">Strong momentum</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Fear & Greed</p>
                <p className="text-2xl font-bold text-orange-700">Greed</p>
                <p className="text-xs text-orange-500">Index: 68/100</p>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={analysisType} onValueChange={setAnalysisType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Sentiment Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sentimentTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="bullish" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6B7280" fill="#6B7280" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="bearish" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Sentiment Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={sentimentDrivers}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Sentiment" dataKey="sentiment" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Radar name="Confidence" dataKey="confidence" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-green-600" />
                Trending Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keywordAnalysis.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTrendIcon(keyword.trend)}
                      <div>
                        <p className="font-semibold">#{keyword.keyword}</p>
                        <p className="text-sm text-gray-500">{keyword.mentions.toLocaleString()} mentions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getSentimentColor(keyword.sentiment)}>
                        {getSentimentIcon(keyword.sentiment)}
                        {keyword.sentiment}%
                      </Badge>
                      <Badge className={getImpactColor(keyword.impact)}>
                        {keyword.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialMetrics.map((platform, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-600" />
                    {platform.platform} Analytics
                    {platform.trending && (
                      <Badge className="bg-red-100 text-red-800">
                        <Zap className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Mentions</p>
                      <p className="text-xl font-bold">{platform.mentions.toLocaleString()}</p>
                      <p className={`text-sm ${platform.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {platform.change24h >= 0 ? '+' : ''}{platform.change24h}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sentiment Score</p>
                      <p className="text-xl font-bold">{platform.sentiment}%</p>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(platform.sentiment)}
                        <span className="text-sm text-gray-500">Overall mood</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Engagement</p>
                    <p className="text-lg font-semibold">{(platform.engagement / 1e6).toFixed(1)}M interactions</p>
                    <Progress value={(platform.engagement / 3000000) * 100} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Influencers</p>
                    <p className="text-lg font-semibold">{platform.influencers} accounts</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Top Crypto Influencers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencerMetrics.map((influencer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Twitter className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{influencer.name}</p>
                        <p className="text-sm text-gray-500">{influencer.platform} • {(influencer.followers / 1000).toFixed(0)}K followers</p>
                        <p className="text-xs text-gray-400 italic">"${influencer.recentPost}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="font-semibold">{influencer.engagement}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Sentiment</p>
                        <div className={`flex items-center gap-1 ${getSentimentColor(influencer.sentiment)}`}>
                          {getSentimentIcon(influencer.sentiment)}
                          <span className="font-semibold">{influencer.sentiment}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Influence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={influencer.influence} className="w-16" />
                          <span className="text-sm">{influencer.influence}%</span>
                        </div>
                      </div>
                      <Badge className={getImpactColor(influencer.impact)}>
                        {influencer.impact}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-pink-600" />
                  Emotional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={emotionalAnalysis}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="intensity"
                      label={({ emotion, intensity }) => `${emotion}: ${intensity}%`}
                    >
                      {emotionalAnalysis.map((entry, index) => (
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
                  <Target className="h-5 w-5 text-orange-600" />
                  Emotion Intensity Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionalAnalysis.map((emotion, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{emotion.emotion}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{emotion.intensity}%</span>
                          <span className={`text-sm ${emotion.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {emotion.change >= 0 ? '+' : ''}{emotion.change}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={emotion.intensity} 
                        className="h-2" 
                        style={{ 
                          '--progress-background': emotion.color,
                          backgroundColor: `${emotion.color}20`
                        } as React.CSSProperties}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}