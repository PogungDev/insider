"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Clock, TrendingUp, TrendingDown, Target, Zap, Calendar, BarChart3, PieChart, Activity, Repeat, Timer } from "lucide-react"

interface TradingHabit {
  id: string
  pattern: string
  frequency: number
  consistency: number
  profitability: number
  riskLevel: 'low' | 'medium' | 'high'
  timeframe: string
  description: string
  strength: number
  lastOccurrence: number
}

interface TimePattern {
  hour: number
  activity: number
  profitability: number
  volume: number
  type: 'peak' | 'normal' | 'low'
}

interface BehaviorMetric {
  name: string
  value: number
  trend: 'up' | 'down' | 'stable'
  description: string
  category: 'timing' | 'risk' | 'strategy' | 'emotional'
}

interface PersonalityTrait {
  trait: string
  score: number
  description: string
  impact: 'positive' | 'negative' | 'neutral'
  examples: string[]
}

export function HabitAnalyzer() {
  const [selectedWallet, setSelectedWallet] = useState("sei1abc...def")
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [tradingHabits, setTradingHabits] = useState<TradingHabit[]>([])
  const [timePatterns, setTimePatterns] = useState<TimePattern[]>([])
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetric[]>([])
  const [personalityTraits, setPersonalityTraits] = useState<PersonalityTrait[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock data untuk demo
  const mockTradingHabits: TradingHabit[] = [
    {
      id: "1",
      pattern: "Morning Momentum Trading",
      frequency: 85,
      consistency: 92,
      profitability: 67,
      riskLevel: "medium",
      timeframe: "9-11 AM UTC",
      description: "Consistently trades high-volume tokens during Asian market open",
      strength: 89,
      lastOccurrence: Date.now() - 3600000
    },
    {
      id: "2",
      pattern: "Weekend DeFi Farming",
      frequency: 78,
      consistency: 88,
      profitability: 82,
      riskLevel: "low",
      timeframe: "Saturday-Sunday",
      description: "Adds liquidity to high-APY pools during weekends",
      strength: 85,
      lastOccurrence: Date.now() - 86400000
    },
    {
      id: "3",
      pattern: "Panic Selling Pattern",
      frequency: 45,
      consistency: 72,
      profitability: -23,
      riskLevel: "high",
      timeframe: "Market crashes",
      description: "Tends to sell positions during major market downturns",
      strength: 68,
      lastOccurrence: Date.now() - 604800000
    },
    {
      id: "4",
      pattern: "Arbitrage Hunter",
      frequency: 92,
      consistency: 95,
      profitability: 45,
      riskLevel: "low",
      timeframe: "Cross-DEX opportunities",
      description: "Quickly exploits price differences between exchanges",
      strength: 94,
      lastOccurrence: Date.now() - 1800000
    }
  ]

  const mockTimePatterns: TimePattern[] = [
    { hour: 0, activity: 15, profitability: 45, volume: 12000, type: 'low' },
    { hour: 1, activity: 12, profitability: 38, volume: 8500, type: 'low' },
    { hour: 2, activity: 8, profitability: 42, volume: 6200, type: 'low' },
    { hour: 3, activity: 5, profitability: 35, volume: 3800, type: 'low' },
    { hour: 4, activity: 18, profitability: 52, volume: 15000, type: 'normal' },
    { hour: 5, activity: 25, profitability: 58, volume: 22000, type: 'normal' },
    { hour: 6, activity: 35, profitability: 65, volume: 32000, type: 'normal' },
    { hour: 7, activity: 45, profitability: 72, volume: 45000, type: 'normal' },
    { hour: 8, activity: 68, profitability: 78, volume: 68000, type: 'peak' },
    { hour: 9, activity: 85, profitability: 82, volume: 85000, type: 'peak' },
    { hour: 10, activity: 92, profitability: 85, volume: 95000, type: 'peak' },
    { hour: 11, activity: 88, profitability: 80, volume: 88000, type: 'peak' },
    { hour: 12, activity: 75, profitability: 75, volume: 72000, type: 'peak' },
    { hour: 13, activity: 65, profitability: 70, volume: 62000, type: 'normal' },
    { hour: 14, activity: 58, profitability: 68, volume: 55000, type: 'normal' },
    { hour: 15, activity: 72, profitability: 76, volume: 70000, type: 'peak' },
    { hour: 16, activity: 78, profitability: 79, volume: 75000, type: 'peak' },
    { hour: 17, activity: 65, profitability: 72, volume: 62000, type: 'normal' },
    { hour: 18, activity: 52, profitability: 65, volume: 48000, type: 'normal' },
    { hour: 19, activity: 45, profitability: 62, volume: 42000, type: 'normal' },
    { hour: 20, activity: 38, profitability: 58, volume: 35000, type: 'normal' },
    { hour: 21, activity: 32, profitability: 55, volume: 28000, type: 'normal' },
    { hour: 22, activity: 25, profitability: 50, volume: 22000, type: 'low' },
    { hour: 23, activity: 18, profitability: 48, volume: 16000, type: 'low' }
  ]

  const mockBehaviorMetrics: BehaviorMetric[] = [
    {
      name: "Risk Tolerance",
      value: 72,
      trend: "up",
      description: "Willingness to take calculated risks",
      category: "risk"
    },
    {
      name: "Patience Level",
      value: 85,
      trend: "stable",
      description: "Ability to hold positions long-term",
      category: "emotional"
    },
    {
      name: "Market Timing",
      value: 68,
      trend: "up",
      description: "Skill in entering/exiting at optimal times",
      category: "timing"
    },
    {
      name: "Strategy Consistency",
      value: 91,
      trend: "stable",
      description: "Adherence to trading strategy",
      category: "strategy"
    },
    {
      name: "FOMO Resistance",
      value: 45,
      trend: "down",
      description: "Ability to resist fear of missing out",
      category: "emotional"
    },
    {
      name: "Loss Management",
      value: 78,
      trend: "up",
      description: "Effectiveness in cutting losses",
      category: "risk"
    }
  ]

  const mockPersonalityTraits: PersonalityTrait[] = [
    {
      trait: "Analytical Trader",
      score: 88,
      description: "Makes decisions based on data and technical analysis",
      impact: "positive",
      examples: ["Uses multiple indicators", "Backtests strategies", "Risk-reward calculations"]
    },
    {
      trait: "Momentum Chaser",
      score: 65,
      description: "Tends to follow trending markets and popular tokens",
      impact: "neutral",
      examples: ["Buys during pumps", "Follows social sentiment", "Late entries"]
    },
    {
      trait: "Contrarian Mindset",
      score: 42,
      description: "Sometimes goes against market consensus",
      impact: "positive",
      examples: ["Buys dips", "Sells peaks", "Independent thinking"]
    },
    {
      trait: "Emotional Trader",
      score: 38,
      description: "Trading decisions influenced by emotions",
      impact: "negative",
      examples: ["Panic selling", "FOMO buying", "Revenge trading"]
    }
  ]

  useEffect(() => {
    setTradingHabits(mockTradingHabits)
    setTimePatterns(mockTimePatterns)
    setBehaviorMetrics(mockBehaviorMetrics)
    setPersonalityTraits(mockPersonalityTraits)
  }, [])

  const getHabitIcon = (pattern: string) => {
    if (pattern.includes('Morning')) return <Clock className="h-4 w-4 text-blue-500" />
    if (pattern.includes('Weekend')) return <Calendar className="h-4 w-4 text-green-500" />
    if (pattern.includes('Panic')) return <TrendingDown className="h-4 w-4 text-red-500" />
    if (pattern.includes('Arbitrage')) return <Zap className="h-4 w-4 text-purple-500" />
    return <Activity className="h-4 w-4" />
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />
      case 'stable': return <Target className="h-3 w-3 text-blue-500" />
      default: return null
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getTimePatternColor = (type: string) => {
    switch (type) {
      case 'peak': return 'bg-green-500'
      case 'normal': return 'bg-blue-500'
      case 'low': return 'bg-gray-400'
      default: return 'bg-gray-300'
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const runBehaviorAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Habit Analyzer</h2>
          <p className="text-muted-foreground">Deep analysis pola trading dan behavioral patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedWallet} onValueChange={setSelectedWallet}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sei1abc...def">sei1abc...def</SelectItem>
              <SelectItem value="sei1xyz...789">sei1xyz...789</SelectItem>
              <SelectItem value="sei1mno...pqr">sei1mno...pqr</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
              <SelectItem value="90d">90D</SelectItem>
              <SelectItem value="1y">1Y</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={runBehaviorAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Behavior'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <Repeat className="h-4 w-4 text-blue-500" />
              <span className="text-xl sm:text-2xl font-bold text-blue-600">{tradingHabits.length}</span>
            </div>
            <p className="text-xs sm:text-sm font-medium mt-1">Trading Habits</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-muted-foreground">Identified patterns</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-xl sm:text-2xl font-bold text-purple-600">78%</span>
            </div>
            <p className="text-xs sm:text-sm font-medium mt-1">Behavior Score</p>
            <Progress value={78} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <Timer className="h-4 w-4 text-green-500" />
              <span className="text-lg sm:text-2xl font-bold text-green-600">9-11 AM</span>
            </div>
            <p className="text-xs sm:text-sm font-medium mt-1">Peak Hours</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-600">Most profitable</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <Target className="h-4 w-4 text-orange-500" />
              <span className="text-xl sm:text-2xl font-bold text-orange-600">85%</span>
            </div>
            <p className="text-xs sm:text-sm font-medium mt-1">Consistency</p>
            <Progress value={85} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="habits" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="habits" className="text-xs sm:text-sm">Trading Habits</TabsTrigger>
            <TabsTrigger value="timing" className="text-xs sm:text-sm">Time Patterns</TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs sm:text-sm">Behavior Metrics</TabsTrigger>
            <TabsTrigger value="personality" className="text-xs sm:text-sm">Personality</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="habits" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tradingHabits.map((habit) => (
              <Card key={habit.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getHabitIcon(habit.pattern)}
                      <CardTitle className="text-lg">{habit.pattern}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRiskColor(habit.riskLevel)}>
                        {habit.riskLevel} risk
                      </Badge>
                      <Badge variant={habit.profitability >= 0 ? "default" : "destructive"}>
                        {habit.profitability >= 0 ? '+' : ''}{habit.profitability}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Frequency</p>
                      <p className="font-semibold">{habit.frequency}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Consistency</p>
                      <p className="font-semibold">{habit.consistency}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timeframe</p>
                      <p className="font-semibold">{habit.timeframe}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Seen</p>
                      <p className="font-semibold">{formatTimeAgo(habit.lastOccurrence)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Pattern Strength</span>
                      <span>{habit.strength}%</span>
                    </div>
                    <Progress value={habit.strength} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  24-Hour Activity Pattern
                </CardTitle>
                <CardDescription>Trading activity dan profitability by hour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timePatterns.map((pattern) => (
                    <div key={pattern.hour} className="flex items-center gap-2">
                      <span className="text-xs w-12">{pattern.hour.toString().padStart(2, '0')}:00</span>
                      <div className="flex-1 flex items-center gap-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getTimePatternColor(pattern.type)}`}
                            style={{ width: `${pattern.activity}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{pattern.activity}%</span>
                      </div>
                      <div className="text-xs w-16 text-right">
                        <span className={pattern.profitability >= 50 ? 'text-green-600' : 'text-red-600'}>
                          {pattern.profitability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time-based Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-800">Peak Performance</p>
                    <p className="text-sm text-green-600">9-11 AM UTC (85% profitability)</p>
                    <p className="text-xs text-green-500 mt-1">Asian market open overlap</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-800">Secondary Peak</p>
                    <p className="text-sm text-blue-600">3-4 PM UTC (76% profitability)</p>
                    <p className="text-xs text-blue-500 mt-1">US market open</p>
                  </div>
                  
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="font-medium text-red-800">Avoid Trading</p>
                    <p className="text-sm text-red-600">2-4 AM UTC (35% profitability)</p>
                    <p className="text-xs text-red-500 mt-1">Low liquidity period</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Weekly Patterns</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Best Day:</span>
                        <span className="ml-1 font-medium">Tuesday</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Worst Day:</span>
                        <span className="ml-1 font-medium">Friday</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weekend:</span>
                        <span className="ml-1 font-medium">DeFi Focus</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="ml-1 font-medium">Mon-Wed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {behaviorMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-2xl font-bold">{metric.value}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  
                  <div className="space-y-2">
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{metric.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.trend}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {personalityTraits.map((trait, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trait.trait}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{trait.score}%</span>
                      <Badge variant="outline" className={getImpactColor(trait.impact)}>
                        {trait.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{trait.description}</p>
                  
                  <div className="space-y-2">
                    <Progress value={trait.score} className="h-2" />
                  </div>

                  <div>
                    <p className="text-xs font-medium mb-2">Behavioral Examples:</p>
                    <div className="space-y-1">
                      {trait.examples.map((example, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full" />
                          <span className="text-xs text-muted-foreground">{example}</span>
                        </div>
                      ))}
                    </div>
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