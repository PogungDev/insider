'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Bell, Shield, TrendingUp, Zap, X, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface Alert {
  id: string
  type: 'security' | 'whale' | 'anomaly' | 'opportunity' | 'risk'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  timestamp: string
  wallet?: string
  value?: string
  action?: string
  resolved: boolean
}

interface MultiLayerAlertsProps {
  maxAlerts?: number
  showFilters?: boolean
  autoRefresh?: boolean
  onAlertClick?: (alert: Alert) => void
}

export function MultiLayerAlerts({
  maxAlerts = 10,
  showFilters = true,
  autoRefresh = true,
  onAlertClick
}: MultiLayerAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [showResolved, setShowResolved] = useState(false)
  const { connectedWallet } = useWallet()

  // Mock alerts data
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'security',
      severity: 'critical',
      title: 'Suspicious Transaction Detected',
      message: 'Large transfer to unknown wallet detected',
      timestamp: '2 minutes ago',
      wallet: '0x742d35Cc6634C0532925a3b8D4C9db4C4C9db4C4',
      value: '$500K',
      action: 'Block',
      resolved: false
    },
    {
      id: '2',
      type: 'whale',
      severity: 'high',
      title: 'Whale Movement Alert',
      message: 'Major holder moved 10M tokens',
      timestamp: '5 minutes ago',
      wallet: '0x123...abc',
      value: '$2.4M',
      action: 'Monitor',
      resolved: false
    },
    {
      id: '3',
      type: 'opportunity',
      severity: 'medium',
      title: 'Arbitrage Opportunity',
      message: 'Price difference detected across DEXs',
      timestamp: '8 minutes ago',
      value: '3.2% profit',
      action: 'Execute',
      resolved: false
    },
    {
      id: '4',
      type: 'anomaly',
      severity: 'high',
      title: 'Unusual Trading Pattern',
      message: 'Abnormal volume spike detected',
      timestamp: '12 minutes ago',
      wallet: '0x456...def',
      value: '$1.2M',
      action: 'Investigate',
      resolved: true
    },
    {
      id: '5',
      type: 'risk',
      severity: 'low',
      title: 'Portfolio Risk Update',
      message: 'Risk score increased to 6.2/10',
      timestamp: '15 minutes ago',
      action: 'Review',
      resolved: false
    }
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
  }, [])

  useEffect(() => {
    let filtered = alerts.filter(alert => {
      const matchesType = selectedType === 'all' || alert.type === selectedType
      const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity
      const matchesResolved = showResolved || !alert.resolved
      return matchesType && matchesSeverity && matchesResolved
    })
    
    filtered = filtered.slice(0, maxAlerts)
    setFilteredAlerts(filtered)
  }, [alerts, selectedType, selectedSeverity, showResolved, maxAlerts])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />
      case 'whale': return <TrendingUp className="h-4 w-4" />
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />
      case 'opportunity': return <Zap className="h-4 w-4" />
      case 'risk': return <Bell className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'text-red-600'
      case 'whale': return 'text-blue-600'
      case 'anomaly': return 'text-orange-600'
      case 'opportunity': return 'text-green-600'
      case 'risk': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Multi-Layer Alerts
            {filteredAlerts.filter(a => !a.resolved).length > 0 && (
              <Badge variant="destructive">
                {filteredAlerts.filter(a => !a.resolved).length}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResolved(!showResolved)}
          >
            {showResolved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showResolved ? 'Hide' : 'Show'} Resolved
          </Button>
        </div>
        {showFilters && (
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="whale">Whale</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts to display
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                  alert.resolved ? 'opacity-60' : ''
                }`}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 ${getTypeColor(alert.type)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)} variant="outline">
                          {alert.severity}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{alert.timestamp}</span>
                        {alert.wallet && (
                          <span className="font-mono">{alert.wallet}</span>
                        )}
                        {alert.value && (
                          <span className="font-medium">{alert.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {!alert.resolved && alert.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          resolveAlert(alert.id)
                        }}
                      >
                        {alert.action}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissAlert(alert.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}