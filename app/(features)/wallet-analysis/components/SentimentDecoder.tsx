"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Frown, Smile, Meh, TrendingUp, TrendingDown, Brain, Zap, MessageSquare, Users, BarChart3, AlertTriangle, ThumbsUp, ThumbsDown } from "lucide-react"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface SentimentData {
  timestamp: number
  sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative'
  score: number
  confidence: number
  volume: number
  source: 'transaction' | 'social' | 'news' | 'onchain'
  trigger: string
}

interface EmotionalState {
  emotion: string
  intensity: number
  duration: number
  triggers: string[]
  impact: 'positive' | 'negative' | 'neutral'
  frequency: number
  description: string
}

interface SocialSignal {
  platform: string
  mentions: number
  sentiment: number
  engagement: number
  influence: number
  trending: boolean
  keywords: string[]
}

interface MarketMood {
  token: string
  sentiment: number
  volume: number
  socialBuzz: number
  fearGreedIndex: number
  momentum: 'bullish' | 'bearish' | 'neutral'
  prediction: string
}

export function SentimentDecoder() {
  const { targetWallet, analysisData } = useWallet()
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [selectedToken, setSelectedToken] = useState("SEI")
  const [sentimentHistory, setSentimentHistory] = useState<SentimentData[]>([])
  const [emotionalStates, setEmotionalStates] = useState<EmotionalState[]>([])
  const [socialSignals, setSocialSignals] = useState<SocialSignal[]>([])
  const [marketMoods, setMarketMoods] = useState<MarketMood[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock data for demo
  const mockSentimentHistory: SentimentData[] = [
    {
      timestamp: Date.now() - 3600000,
      sentiment: 'very_positive',
      score: 92,
      confidence: 88,
      volume: 125000,
      source: 'transaction',
      trigger: 'Large accumulation detected'
    },
    {
      timestamp: Date.now() - 7200000,
      sentiment: 'positive',
      score: 78,
      confidence: 82,
      volume: 89000,
      source: 'social',
      trigger: 'Positive news coverage'
    },
    {
      timestamp: Date.now() - 10800000,
      sentiment: 'neutral',
      score: 52,
      confidence: 75,
      volume: 45000,
      source: 'onchain',
      trigger: 'Normal trading activity'
    },
    {
      timestamp: Date.now() - 14400000,
      sentiment: 'negative',
      score: 28,
      confidence: 85,
      volume: 156000,
      source: 'news',
      trigger: 'Market correction fears'
    },
    {
      timestamp: Date.now() - 18000000,
      sentiment: 'very_negative',
      score: 15,
      confidence: 91,
      volume: 234000,
      source: 'transaction',
      trigger: 'Whale selling pressure'
    }
  ]

  const mockEmotionalStates: EmotionalState[] = [
    {
      emotion: 'FOMO (Fear of Missing Out)',
      intensity: 78,
      duration: 4,
      triggers: ['Price breakout', 'Social media hype', 'Influencer mentions'],
      impact: 'negative',
      frequency: 65,
      description: 'Impulsive buying during price surges'
    },
    {
      emotion: 'Greed',
      intensity: 85,
      duration: 6,
      triggers: ['Consecutive gains', 'Bull market', 'High APY opportunities'],
      impact: 'negative',
      frequency: 42,
      description: 'Overconfidence leading to excessive risk-taking'
    },
    {
      emotion: 'Fear',
      intensity: 72,
      duration: 8,
      triggers: ['Market crash', 'Negative news', 'Portfolio losses'],
      impact: 'negative',
      frequency: 38,
      description: 'Panic selling during market downturns'
    },
    {
      emotion: 'Confidence',
      intensity: 68,
      duration: 12,
      triggers: ['Successful trades', 'Market knowledge', 'Technical analysis'],
      impact: 'positive',
      frequency: 55,
      description: 'Calculated decision-making based on analysis'
    },
    {
      emotion: 'Patience',
      intensity: 82,
      duration: 24,
      triggers: ['Long-term strategy', 'DCA approach', 'Fundamental belief'],
      impact: 'positive',
      frequency: 71,
      description: 'Ability to hold positions through volatility'
    }
  ]

  const mockSocialSignals: SocialSignal[] = [
    {
      platform: 'Twitter',
      mentions: 12500,
      sentiment: 78,
      engagement: 85,
      influence: 72,
      trending: true,
      keywords: ['SEI', 'bullish', 'moon', 'DeFi']
    },
    {
      platform: 'Reddit',
      mentions: 3400,
      sentiment: 65,
      engagement: 68,
      influence: 58,
      trending: false,
      keywords: ['SEI ecosystem', 'analysis', 'hodl']
    },
    {
      platform: 'Discord',
      mentions: 8900,
      sentiment: 82,
      engagement: 91,
      influence: 65,
      trending: true,
      keywords: ['community', 'development', 'partnerships']
    },
    {
      platform: 'Telegram',
      mentions: 5600,
      sentiment: 71,
      engagement: 76,
      influence: 62,
      trending: false,
      keywords: ['price action', 'technical analysis', 'support']
    }
  ]

  const mockMarketMoods: MarketMood[] = [
    {
      token: 'SEI',
      sentiment: 78,
      volume: 2500000,
      socialBuzz: 85,
      fearGreedIndex: 72,
      momentum: 'bullish',
      prediction: 'Strong upward momentum expected'
    },
    {
      token: 'ATOM',
      sentiment: 65,
      volume: 1800000,
      socialBuzz: 58,
      fearGreedIndex: 55,
      momentum: 'neutral',
      prediction: 'Sideways movement likely'
    },
    {
      token: 'USDC',
      sentiment: 52,
      volume: 890000,
      socialBuzz: 32,
      fearGreedIndex: 48,
      momentum: 'neutral',
      prediction: 'Stable with slight volatility'
    }
  ]

  useEffect(() => {
    let sentimentHistory = [...mockSentimentHistory]
    let emotionalStates = [...mockEmotionalStates]
    let socialSignals = [...mockSocialSignals]
    let marketMoods = [...mockMarketMoods]

    if (targetWallet && analysisData) {
      const walletSentiment: SentimentData = {
        timestamp: Date.now() - 30 * 60 * 1000,
        sentiment: analysisData.riskScore > 70 ? 'positive' : analysisData.riskScore > 50 ? 'neutral' : 'negative',
        score: analysisData.behaviorScore || 60,
        confidence: 85,
        volume: analysisData.totalValue || 100000,
        source: 'transaction',
        trigger: `Wallet ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)} analysis`
      }
      sentimentHistory.unshift(walletSentiment)

      const walletEmotion: EmotionalState = {
        emotion: analysisData.riskScore > 70 ? 'Confidence' : 'Caution',
        intensity: analysisData.behaviorScore || 60,
        duration: 12,
        triggers: ['Wallet analysis', 'Risk assessment', 'Behavior patterns'],
        impact: analysisData.riskScore > 70 ? 'positive' : 'neutral',
        frequency: 50,
        description: `Emotional state based on wallet ${targetWallet.slice(0, 6)}...${targetWallet.slice(-4)} analysis`
      }
      emotionalStates.unshift(walletEmotion)
    }

    setSentimentHistory(sentimentHistory)
    setEmotionalStates(emotionalStates)
    setSocialSignals(socialSignals)
    setMarketMoods(marketMoods)
  }, [targetWallet, analysisData])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'very_positive': return <Smile className="h-4 w-4 text-green-600" />
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />
      case 'neutral': return <Meh className="h-4 w-4 text-gray-500" />
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />
      case 'very_negative': return <Frown className="h-4 w-4 text-red-600" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'very_positive': return 'bg-green-600 text-white'
      case 'positive': return 'bg-green-100 text-green-800'
      case 'neutral': return 'bg-gray-100 text-gray-800'
      case 'negative': return 'bg-red-100 text-red-800'
      case 'very_negative': return 'bg-red-600 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEmotionColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-200 bg-green-50'
      case 'negative': return 'border-red-200 bg-red-50'
      case 'neutral': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getMomentumIcon = (momentum: string) => {
    switch (momentum) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'neutral': return <BarChart3 className="h-4 w-4 text-gray-500" />
      default: return <BarChart3 className="h-4 w-4" />
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

  const runSentimentAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const currentSentiment = sentimentHistory[0]
  const avgSentiment = sentimentHistory.reduce((sum, data) => sum + data.score, 0) / sentimentHistory.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sentiment Decoder</h2>
          <p className="text-muted-foreground">AI-powered analysis of market emotions and social sentiment</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SEI">SEI</SelectItem>
              <SelectItem value="ATOM">ATOM</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
            </SelectContent>
          </Select>
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
          <Button onClick={runSentimentAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Heart className="h-4 w-4 text-pink-500" />
              <div className="text-right">
                {getSentimentIcon(currentSentiment?.sentiment || 'neutral')}
                <span className="text-2xl font-bold ml-2">{currentSentiment?.score || 0}%</span>
              </div>
            </div>
            <p className="text-sm font-medium mt-1">Current Sentiment</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Confidence: {currentSentiment?.confidence || 0}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{Math.round(avgSentiment)}%</span>
            </div>
            <p className="text-sm font-medium mt-1">Avg Sentiment</p>
            <Progress value={avgSentiment} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">30.5K</span>
            </div>
            <p className="text-sm font-medium mt-1">Social Mentions</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">+15% 24h</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600">72</span>
            </div>
            <p className="text-sm font-medium mt-1">Fear & Greed</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Greed territory</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sentiment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sentiment">Sentiment History</TabsTrigger>
          <TabsTrigger value="emotions">Emotional States</TabsTrigger>
          <TabsTrigger value="social">Social Signals</TabsTrigger>
          <TabsTrigger value="market">Market Mood</TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="space-y-4">
          <div className="space-y-3">
            {sentimentHistory.map((data, index) => (
              <Card key={index} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSentimentIcon(data.sentiment)}
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSentimentColor(data.sentiment)}>
                            {data.sentiment.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="font-medium">{data.score}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{data.trigger}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{data.source}</Badge>
                        <span className="text-sm text-muted-foreground">{formatTimeAgo(data.timestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Volume: {formatCurrency(data.volume)} • Confidence: {data.confidence}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {emotionalStates.map((emotion, index) => (
              <Card key={index} className={`hover:shadow-md transition-shadow border-2 ${getEmotionColor(emotion.impact)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{emotion.emotion}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{emotion.intensity}%</span>
                      <Badge variant={emotion.impact === 'positive' ? 'default' : 'destructive'}>
                        {emotion.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{emotion.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{emotion.duration}h avg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-semibold">{emotion.frequency}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Emotional Intensity</span>
                      <span>{emotion.intensity}%</span>
                    </div>
                    <Progress value={emotion.intensity} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Common Triggers:</p>
                    <div className="flex flex-wrap gap-1">
                      {emotion.triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialSignals.map((signal, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{signal.platform}</CardTitle>
                    <div className="flex items-center gap-2">
                      {signal.trending && <Badge className="bg-red-500">Trending</Badge>}
                      <span className="text-lg font-bold">{signal.sentiment}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mentions</p>
                      <p className="font-semibold">{signal.mentions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-semibold">{signal.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Influence</p>
                      <p className="font-semibold">{signal.influence}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sentiment</p>
                      <p className="font-semibold">{signal.sentiment}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Overall Influence</span>
                      <span>{signal.influence}%</span>
                    </div>
                    <Progress value={signal.influence} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Trending Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {signal.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {marketMoods.map((mood, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{mood.token}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getMomentumIcon(mood.momentum)}
                      <Badge variant={mood.momentum === 'bullish' ? 'default' : mood.momentum === 'bearish' ? 'destructive' : 'secondary'}>
                        {mood.momentum}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sentiment</p>
                      <p className="font-semibold">{mood.sentiment}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Social Buzz</p>
                      <p className="font-semibold">{mood.socialBuzz}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{formatCurrency(mood.volume)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fear & Greed</p>
                      <p className="font-semibold">{mood.fearGreedIndex}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Market Sentiment</span>
                      <span>{mood.sentiment}%</span>
                    </div>
                    <Progress value={mood.sentiment} className="h-2" />
                  </div>

                  <div className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800">AI Prediction:</p>
                    <p className="text-blue-600">{mood.prediction}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
