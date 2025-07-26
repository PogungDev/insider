"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, TrendingUp, TrendingDown, AlertTriangle, Eye, DollarSign, Clock, Filter, Settings, Zap, Activity } from "lucide-react"

interface WhaleAlert {
  id: string
  type: 'large_transfer' | 'unusual_activity' | 'new_whale' | 'whale_accumulation' | 'whale_dump'
  whale: {
    address: string
    label?: string
    tier: 'mega' | 'large' | 'medium'
  }
  transaction: {
    hash: string
    amount: string
    token: string
    from: string
    to: string
    timestamp: string
  }
  impact: {
    priceChange: number
    volumeIncrease: number
    marketCap: string
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'monitoring'
}

const mockWhaleAlerts: WhaleAlert[] = [
  {
    id: '1',
    type: 'large_transfer',
    whale: {
      address: '0x742d35Cc6634C0532925a3b8D4C9db4C2b8b5C2f',
      label: 'Binance Hot Wallet',
      tier: 'mega'
    },
    transaction: {
      hash: '0x8f4c2b5e9d1a3f7c6b8e2a4d5f9c1b3e7a6d8f2c4b9e1a5d7f3c6b8e2a4d5f9c',
      amount: '50,000 ETH',
      token: 'ETH',
      from: '0x742d35Cc...5C2f',
      to: '0x8ba1f109...C2f',
      timestamp: '2 minutes ago'
    },
    impact: {
      priceChange: -2.3,
      volumeIncrease: 45,
      marketCap: '$2.1B'
    },
    severity: 'critical',
    status: 'active'
  },
  {
    id: '2',
    type: 'whale_accumulation',
    whale: {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      label: 'DeFi Whale #247',
      tier: 'large'
    },
    transaction: {
      hash: '0x7e3b1c8f5a2d9e6c4b7a1f8e3c5d2a9f6b4e7c1a8d5f2e9c6b3a7f1e4d8c5a2',
      amount: '2.5M USDC',
      token: 'USDC',
      from: 'Multiple Sources',
      to: '0x1f9840a8...F984',
      timestamp: '15 minutes ago'
    },
    impact: {
      priceChange: 1.8,
      volumeIncrease: 23,
      marketCap: '$890M'
    },
    severity: 'high',
    status: 'monitoring'
  },
  {
    id: '3',
    type: 'unusual_activity',
    whale: {
      address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      label: 'Unknown Whale',
      tier: 'medium'
    },
    transaction: {
      hash: '0x9a4f2e7b1c8d5a3f6e9c2b7a4d1f8e5c3a6d9f2e7b4c1a8f5d2e9c6b3a7f1e4',
      amount: '15,000 UNI',
      token: 'UNI',
      from: '0x3fC91A3a...7FAD',
      to: 'Uniswap V3',
      timestamp: '1 hour ago'
    },
    impact: {
      priceChange: 0.5,
      volumeIncrease: 12,
      marketCap: '$456M'
    },
    severity: 'medium',
    status: 'resolved'
  },
  {
    id: '4',
    type: 'new_whale',
    whale: {
      address: '0x50EC05ADe8280758E2077fcBC08D878D4aef79C3',
      label: 'New Whale Detected',
      tier: 'large'
    },
    transaction: {
      hash: '0x6c3a9f2e8d1b5c7a4f9e2d6b3a8f1c5e9d2b7a4f6c3a9f2e8d1b5c7a4f9e2d6',
      amount: '8.2M DAI',
      token: 'DAI',
      from: 'Multiple CEX',
      to: '0x50EC05AD...79C3',
      timestamp: '3 hours ago'
    },
    impact: {
      priceChange: 0.1,
      volumeIncrease: 8,
      marketCap: '$1.2B'
    },
    severity: 'medium',
    status: 'monitoring'
  },
  {
    id: '5',
    type: 'whale_dump',
    whale: {
      address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      label: 'Early Investor',
      tier: 'mega'
    },
    transaction: {
      hash: '0x2d7a4f9e1c6b3a8f5d2e9c6b3a7f1e4d8c5a2f9e6c3b7a1f4e8d5c2a9f6b3e7',
      amount: '120,000 LINK',
      token: 'LINK',
      from: '0x7a250d56...488D',
      to: 'Multiple DEX',
      timestamp: '6 hours ago'
    },
    impact: {
      priceChange: -4.7,
      volumeIncrease: 67,
      marketCap: '$3.4B'
    },
    severity: 'critical',
    status: 'resolved'
  }
]

const alertTypes = {
  large_transfer: { label: 'Large Transfer', icon: TrendingUp, color: 'bg-blue-500' },
  unusual_activity: { label: 'Unusual Activity', icon: AlertTriangle, color: 'bg-yellow-500' },
  new_whale: { label: 'New Whale', icon: Eye, color: 'bg-green-500' },
  whale_accumulation: { label: 'Accumulation', icon: TrendingUp, color: 'bg-purple-500' },
  whale_dump: { label: 'Whale Dump', icon: TrendingDown, color: 'bg-red-500' }
}

const severityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
}

const tierColors = {
  mega: 'bg-purple-500',
  large: 'bg-blue-500',
  medium: 'bg-green-500'
}

export function WhaleAlerts() {
  const [alerts, setAlerts] = useState<WhaleAlert[]>(mockWhaleAlerts)
  const [filterType, setFilterType] = useState('all')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [realTimeEnabled, setRealTimeEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === 'all' || alert.type === filterType
    const severityMatch = filterSeverity === 'all' || alert.severity === severityMatch
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus
    return typeMatch && severityMatch && statusMatch
  })

  const getImpactColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeEnabled) return
    
    const interval = setInterval(() => {
      // Simulate new alert
      if (Math.random() > 0.8) {
        const newAlert: WhaleAlert = {
          id: Date.now().toString(),
          type: ['large_transfer', 'whale_accumulation', 'unusual_activity'][Math.floor(Math.random() * 3)] as any,
          whale: {
            address: '0x' + Math.random().toString(16).substr(2, 40),
            label: 'Live Whale #' + Math.floor(Math.random() * 1000),
            tier: ['mega', 'large', 'medium'][Math.floor(Math.random() * 3)] as any
          },
          transaction: {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            amount: Math.floor(Math.random() * 100000) + ' ETH',
            token: ['ETH', 'USDC', 'USDT', 'DAI'][Math.floor(Math.random() * 4)],
            from: '0x' + Math.random().toString(16).substr(2, 8) + '...',
            to: '0x' + Math.random().toString(16).substr(2, 8) + '...',
            timestamp: 'Just now'
          },
          impact: {
            priceChange: (Math.random() - 0.5) * 10,
            volumeIncrease: Math.floor(Math.random() * 100),
            marketCap: '$' + Math.floor(Math.random() * 1000) + 'M'
          },
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          status: 'active'
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [realTimeEnabled])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Whale Alert System
        </h1>
        <div className="flex items-center gap-4">
          <Badge className={`${realTimeEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
            <Activity className="h-3 w-3 mr-1" />
            {realTimeEnabled ? 'Live' : 'Paused'}
          </Badge>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Bell className="h-3 w-3 mr-1" />
            {filteredAlerts.length} Active Alerts
          </Badge>
        </div>
      </div>

      {/* Alert Settings */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Alert Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Real-time Monitoring</label>
              <Switch 
                checked={realTimeEnabled} 
                onCheckedChange={setRealTimeEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sound Alerts</label>
              <Switch 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled}
              />
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">🔴 Critical</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="large_transfer">📈 Large Transfer</SelectItem>
                <SelectItem value="whale_accumulation">📊 Accumulation</SelectItem>
                <SelectItem value="whale_dump">📉 Whale Dump</SelectItem>
                <SelectItem value="unusual_activity">⚠️ Unusual Activity</SelectItem>
                <SelectItem value="new_whale">👁️ New Whale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-700">
                  {alerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-700">
                  {alerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Monitoring</p>
                <p className="text-2xl font-bold text-blue-700">
                  {alerts.filter(a => a.status === 'monitoring').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Volume</p>
                <p className="text-2xl font-bold text-green-700">$2.4B</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Live Whale Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Whale</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => {
                const alertType = alertTypes[alert.type]
                const AlertIcon = alertType.icon
                return (
                  <TableRow key={alert.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Badge className={`${alertType.color} text-white`}>
                        <AlertIcon className="h-3 w-3 mr-1" />
                        {alertType.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${tierColors[alert.whale.tier]} text-white text-xs`}>
                            {alert.whale.tier}
                          </Badge>
                          <span className="font-mono text-sm">
                            {formatAddress(alert.whale.address)}
                          </span>
                        </div>
                        {alert.whale.label && (
                          <p className="text-xs text-gray-500 mt-1">{alert.whale.label}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm">{alert.transaction.amount}</p>
                        <p className="text-xs text-gray-500">
                          {formatAddress(alert.transaction.from)} → {formatAddress(alert.transaction.to)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={`font-semibold text-sm ${getImpactColor(alert.impact.priceChange)}`}>
                          {alert.impact.priceChange > 0 ? '+' : ''}{alert.impact.priceChange.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Vol: +{alert.impact.volumeIncrease}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={severityColors[alert.severity]}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        {alert.transaction.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={alert.status === 'active' ? 'default' : 'secondary'}
                        className={alert.status === 'active' ? 'bg-green-500 text-white' : ''}
                      >
                        {alert.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}