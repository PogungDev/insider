"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Bell, Zap, Shield, TrendingUp, TrendingDown, Eye, EyeOff, Settings, Volume2, VolumeX, Clock, Target, Brain, Flame, CheckCircle, XCircle, Pause, Play } from "lucide-react"

interface Alert {
  id: string
  type: 'critical' | 'high' | 'medium' | 'low' | 'info'
  category: 'security' | 'trading' | 'whale' | 'defi' | 'arbitrage' | 'risk' | 'pattern'
  title: string
  description: string
  severity: number // 1-100
  confidence: number // 1-100
  timestamp: number
  source: string
  metadata: Record<string, any>
  actions: AlertAction[]
  isRead: boolean
  isActive: boolean
  isPinned: boolean
  tags: string[]
  relatedWallet?: string
  relatedToken?: string
  estimatedImpact: number
  timeToExpiry?: number
}

interface AlertAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  action: () => void
}

interface AlertRule {
  id: string
  name: string
  category: string
  conditions: AlertCondition[]
  isEnabled: boolean
  priority: number
  cooldown: number // minutes
  lastTriggered?: number
}

interface AlertCondition {
  field: string
  operator: string
  value: any
  logic?: 'AND' | 'OR'
}

interface MultiLayerAlertsProps {
  onAlertAction?: (alertId: string, actionId: string) => void
  onRuleToggle?: (ruleId: string, enabled: boolean) => void
  showSettings?: boolean
}

export function MultiLayerAlerts({ 
  onAlertAction, 
  onRuleToggle, 
  showSettings = true 
}: MultiLayerAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [activeTab, setActiveTab] = useState("active")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [severityThreshold, setSeverityThreshold] = useState([50])
  const [showOnlyUnread, setShowOnlyUnread] = useState(false)

  // Mock data untuk demo
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      category: 'security',
      title: 'Potential Rug Pull Detected',
      description: 'Suspicious liquidity removal pattern detected in SCAM token. 85% of liquidity removed in last 10 minutes.',
      severity: 95,
      confidence: 92,
      timestamp: Date.now() - 300000,
      source: 'Risk Engine',
      metadata: {
        token: 'SCAM',
        liquidityRemoved: 85,
        timeframe: '10 minutes',
        contractAddress: '0x123...abc'
      },
      actions: [
        { id: 'sell', label: 'Emergency Sell', type: 'danger', action: () => {} },
        { id: 'monitor', label: 'Monitor Closely', type: 'secondary', action: () => {} }
      ],
      isRead: false,
      isActive: true,
      isPinned: true,
      tags: ['rug-pull', 'emergency', 'liquidity'],
      relatedToken: 'SCAM',
      estimatedImpact: 95,
      timeToExpiry: 1800000 // 30 minutes
    },
    {
      id: '2',
      type: 'high',
      category: 'whale',
      title: 'Whale Movement Alert',
      description: 'Large ETH transfer (15,000 ETH) from known whale wallet to Binance. Potential sell pressure incoming.',
      severity: 82,
      confidence: 88,
      timestamp: Date.now() - 600000,
      source: 'Whale Tracker',
      metadata: {
        amount: 15000,
        token: 'ETH',
        destination: 'Binance',
        walletAddress: '0x742...8e9'
      },
      actions: [
        { id: 'hedge', label: 'Hedge Position', type: 'primary', action: () => {} },
        { id: 'track', label: 'Track Wallet', type: 'secondary', action: () => {} }
      ],
      isRead: false,
      isActive: true,
      isPinned: false,
      tags: ['whale', 'large-transfer', 'sell-pressure'],
      relatedWallet: '0x742...8e9',
      estimatedImpact: 75
    },
    {
      id: '3',
      type: 'medium',
      category: 'arbitrage',
      title: 'Arbitrage Opportunity',
      description: 'Price discrepancy detected: ATOM trading 8.5% higher on Coinbase vs Binance. Profit opportunity available.',
      severity: 65,
      confidence: 94,
      timestamp: Date.now() - 900000,
      source: 'Arbitrage Scanner',
      metadata: {
        token: 'ATOM',
        spread: 8.5,
        exchanges: ['Coinbase', 'Binance'],
        estimatedProfit: 12.8
      },
      actions: [
        { id: 'execute', label: 'Execute Trade', type: 'primary', action: () => {} },
        { id: 'calculate', label: 'Calculate Profit', type: 'secondary', action: () => {} }
      ],
      isRead: true,
      isActive: true,
      isPinned: false,
      tags: ['arbitrage', 'opportunity', 'profit'],
      relatedToken: 'ATOM',
      estimatedImpact: 60,
      timeToExpiry: 3600000 // 1 hour
    },
    {
      id: '4',
      type: 'high',
      category: 'trading',
      title: 'Alpha Signal Triggered',
      description: 'SEI breakout signal confirmed. Technical indicators align with 94% confidence. Expected return: +45.2%',
      severity: 78,
      confidence: 94,
      timestamp: Date.now() - 1200000,
      source: 'Alpha Engine',
      metadata: {
        token: 'SEI',
        expectedReturn: 45.2,
        timeframe: '2-4 weeks',
        signalType: 'breakout'
      },
      actions: [
        { id: 'buy', label: 'Execute Buy', type: 'primary', action: () => {} },
        { id: 'backtest', label: 'View Backtest', type: 'secondary', action: () => {} }
      ],
      isRead: false,
      isActive: true,
      isPinned: false,
      tags: ['alpha', 'breakout', 'high-confidence'],
      relatedToken: 'SEI',
      estimatedImpact: 85
    },
    {
      id: '5',
      type: 'low',
      category: 'defi',
      title: 'Yield Farming Opportunity',
      description: 'New liquidity mining program launched with 120% APY. Risk assessment shows sustainable tokenomics.',
      severity: 45,
      confidence: 76,
      timestamp: Date.now() - 1800000,
      source: 'DeFi Scanner',
      metadata: {
        protocol: 'NewDeFi',
        apy: 120,
        riskScore: 35,
        tvl: 2500000
      },
      actions: [
        { id: 'stake', label: 'Stake Tokens', type: 'primary', action: () => {} },
        { id: 'research', label: 'Research Protocol', type: 'secondary', action: () => {} }
      ],
      isRead: true,
      isActive: true,
      isPinned: false,
      tags: ['defi', 'yield-farming', 'high-apy'],
      estimatedImpact: 40
    }
  ]

  const mockAlertRules: AlertRule[] = [
    {
      id: '1',
      name: 'Whale Movement Detector',
      category: 'whale',
      conditions: [
        { field: 'transfer_amount', operator: '>', value: 1000000 },
        { field: 'wallet_type', operator: '=', value: 'whale', logic: 'AND' }
      ],
      isEnabled: true,
      priority: 90,
      cooldown: 15,
      lastTriggered: Date.now() - 3600000
    },
    {
      id: '2',
      name: 'Rug Pull Early Warning',
      category: 'security',
      conditions: [
        { field: 'liquidity_removal', operator: '>', value: 50 },
        { field: 'timeframe', operator: '<', value: 3600, logic: 'AND' }
      ],
      isEnabled: true,
      priority: 100,
      cooldown: 5
    },
    {
      id: '3',
      name: 'Arbitrage Scanner',
      category: 'arbitrage',
      conditions: [
        { field: 'price_spread', operator: '>', value: 5 },
        { field: 'volume', operator: '>', value: 100000, logic: 'AND' }
      ],
      isEnabled: true,
      priority: 70,
      cooldown: 30
    },
    {
      id: '4',
      name: 'Alpha Signal Generator',
      category: 'trading',
      conditions: [
        { field: 'confidence', operator: '>', value: 85 },
        { field: 'expected_return', operator: '>', value: 20, logic: 'AND' }
      ],
      isEnabled: true,
      priority: 80,
      cooldown: 60
    },
    {
      id: '5',
      name: 'High Yield Opportunities',
      category: 'defi',
      conditions: [
        { field: 'apy', operator: '>', value: 50 },
        { field: 'risk_score', operator: '<', value: 60, logic: 'AND' }
      ],
      isEnabled: false,
      priority: 60,
      cooldown: 120
    }
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
    setAlertRules(mockAlertRules)
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate new alerts
        console.log('Auto-refreshing alerts...')
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'high': return <Flame className="h-4 w-4 text-orange-500" />
      case 'medium': return <Bell className="h-4 w-4 text-yellow-500" />
      case 'low': return <Eye className="h-4 w-4 text-blue-500" />
      case 'info': return <Target className="h-4 w-4 text-gray-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'info': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />
      case 'trading': return <TrendingUp className="h-4 w-4" />
      case 'whale': return <Target className="h-4 w-4" />
      case 'defi': return <Zap className="h-4 w-4" />
      case 'arbitrage': return <TrendingDown className="h-4 w-4" />
      case 'risk': return <AlertTriangle className="h-4 w-4" />
      case 'pattern': return <Brain className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatTimeToExpiry = (expiry: number) => {
    const minutes = Math.floor(expiry / 60000)
    if (minutes < 60) return `${minutes}m left`
    const hours = Math.floor(minutes / 60)
    return `${hours}h left`
  }

  const handleAlertAction = (alertId: string, actionId: string) => {
    onAlertAction?.(alertId, actionId)
    // Update alert state
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const toggleAlertRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: !alert.isRead } : alert
    ))
  }

  const toggleAlertPin = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isPinned: !alert.isPinned } : alert
    ))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false } : alert
    ))
  }

  const toggleRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const newEnabled = !rule.isEnabled
        onRuleToggle?.(ruleId, newEnabled)
        return { ...rule, isEnabled: newEnabled }
      }
      return rule
    }))
  }

  const filteredAlerts = alerts.filter(alert => {
    if (!alert.isActive && activeTab === 'active') return false
    if (alert.isActive && activeTab === 'dismissed') return false
    if (filterType !== 'all' && alert.type !== filterType) return false
    if (filterCategory !== 'all' && alert.category !== filterCategory) return false
    if (showOnlyUnread && alert.isRead) return false
    if (alert.severity < severityThreshold[0]) return false
    return true
  })

  const unreadCount = alerts.filter(alert => !alert.isRead && alert.isActive).length
  const criticalCount = alerts.filter(alert => alert.type === 'critical' && alert.isActive).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Multi-Layer Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">Real-time monitoring dan alert system untuk semua aktivitas</p>
        </div>
        
        {showSettings && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant={soundEnabled ? "default" : "outline"} 
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button 
              variant={autoRefresh ? "default" : "outline"} 
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">Unread Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{alertRules.filter(r => r.isEnabled).length}</p>
                <p className="text-xs text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{alerts.filter(a => a.isActive).length}</p>
                <p className="text-xs text-muted-foreground">Total Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Alerts ({alerts.filter(a => a.isActive).length})</TabsTrigger>
            <TabsTrigger value="dismissed">Dismissed ({alerts.filter(a => !a.isActive).length})</TabsTrigger>
            <TabsTrigger value="rules">Alert Rules ({alertRules.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="trading">Trading</SelectItem>
                <SelectItem value="whale">Whale</SelectItem>
                <SelectItem value="defi">DeFi</SelectItem>
                <SelectItem value="arbitrage">Arbitrage</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
                <SelectItem value="pattern">Pattern</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Switch 
                checked={showOnlyUnread} 
                onCheckedChange={setShowOnlyUnread}
              />
              <span className="text-sm">Unread only</span>
            </div>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`transition-all hover:shadow-md ${
                !alert.isRead ? 'border-l-4 border-l-blue-500' : ''
              } ${alert.isPinned ? 'bg-muted/30' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(alert.type)}
                        {getCategoryIcon(alert.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <Badge className={getTypeColor(alert.type)}>
                            {alert.type}
                          </Badge>
                          <Badge variant="outline">
                            {alert.category}
                          </Badge>
                          {alert.isPinned && <Badge variant="secondary">Pinned</Badge>}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                          <div>
                            <p className="text-muted-foreground">Severity</p>
                            <div className="flex items-center gap-1">
                              <Progress value={alert.severity} className="h-1 w-12" />
                              <span className="font-medium">{alert.severity}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="font-medium">{alert.confidence}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Impact</p>
                            <p className="font-medium">{alert.estimatedImpact}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Source</p>
                            <p className="font-medium">{alert.source}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(alert.timestamp)}</span>
                            </div>
                            {alert.timeToExpiry && (
                              <div className="flex items-center gap-1 text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{formatTimeToExpiry(alert.timeToExpiry)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {alert.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleAlertRead(alert.id)}
                        >
                          {alert.isRead ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => toggleAlertPin(alert.id)}
                        >
                          <Target className={`h-3 w-3 ${alert.isPinned ? 'text-blue-500' : ''}`} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => dismissAlert(alert.id)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {alert.actions.map((action) => (
                          <Button
                            key={action.id}
                            size="sm"
                            variant={action.type === 'primary' ? 'default' : action.type === 'danger' ? 'destructive' : 'outline'}
                            onClick={() => handleAlertAction(alert.id, action.id)}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dismissed" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No dismissed alerts</p>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-3">
            {alertRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{rule.name}</CardTitle>
                      <CardDescription>Category: {rule.category} • Priority: {rule.priority}</CardDescription>
                    </div>
                    <Switch 
                      checked={rule.isEnabled} 
                      onCheckedChange={() => toggleRule(rule.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="font-medium mb-1">Conditions:</p>
                      {rule.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          {idx > 0 && <span className="text-blue-600">{condition.logic}</span>}
                          <span>{condition.field} {condition.operator} {condition.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Cooldown: {rule.cooldown}m</span>
                      {rule.lastTriggered && (
                        <span>Last triggered: {formatTimeAgo(rule.lastTriggered)}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sound Notifications</p>
                    <p className="text-sm text-muted-foreground">Play sound for new alerts</p>
                  </div>
                  <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser notifications</p>
                  </div>
                  <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Refresh</p>
                    <p className="text-sm text-muted-foreground">Automatically check for new alerts</p>
                  </div>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alert Filtering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Minimum Severity Threshold</p>
                  <div className="px-2">
                    <Slider
                      value={severityThreshold}
                      onValueChange={setSeverityThreshold}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span className="font-medium">{severityThreshold[0]}%</span>
                      <span>100%</span>
                    </div>
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