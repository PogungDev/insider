"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts"
import { Bell, Clock, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown, Users, DollarSign, Zap, Eye, Filter, Search, Calendar } from "lucide-react"

const alertHistory = [
  {
    id: '1',
    timestamp: '2024-01-07 14:23:15',
    rule: 'Large ETH Transfer Alert',
    type: 'whale_movement',
    priority: 'high',
    status: 'triggered',
    message: 'Whale wallet 0x742d...5C2f transferred 2,500 ETH to Binance',
    value: '$6,250,000',
    accuracy: 96,
    responseTime: '0.8s',
    channels: ['email', 'telegram'],
    acknowledged: true
  },
  {
    id: '2',
    timestamp: '2024-01-07 13:45:32',
    rule: 'Price Volatility Monitor',
    type: 'price_movement',
    priority: 'medium',
    status: 'triggered',
    message: 'ETH price dropped 7.2% in 15 minutes',
    value: '-$168.50',
    accuracy: 89,
    responseTime: '1.2s',
    channels: ['email', 'discord'],
    acknowledged: true
  },
  {
    id: '3',
    timestamp: '2024-01-07 12:18:47',
    rule: 'DeFi Protocol Anomaly',
    type: 'protocol_monitoring',
    priority: 'critical',
    status: 'triggered',
    message: 'Uniswap V3 TVL decreased by 22% in 1 hour',
    value: '-$890M',
    accuracy: 94,
    responseTime: '0.5s',
    channels: ['email', 'telegram', 'webhook'],
    acknowledged: true
  },
  {
    id: '4',
    timestamp: '2024-01-07 11:32:19',
    rule: 'Sentiment Shift Alert',
    type: 'sentiment_analysis',
    priority: 'medium',
    status: 'false_positive',
    message: 'Market sentiment dropped to 28%',
    value: '-42%',
    accuracy: 76,
    responseTime: '2.1s',
    channels: ['email'],
    acknowledged: false
  },
  {
    id: '5',
    timestamp: '2024-01-07 10:15:03',
    rule: 'New Whale Wallet Detection',
    type: 'wallet_analysis',
    priority: 'high',
    status: 'triggered',
    message: 'New wallet 0x8ba1...C2f detected with $15.2M balance',
    value: '$15,200,000',
    accuracy: 98,
    responseTime: '0.3s',
    channels: ['telegram', 'webhook'],
    acknowledged: true
  },
  {
    id: '6',
    timestamp: '2024-01-07 09:47:28',
    rule: 'Flash Loan Attack Monitor',
    type: 'security',
    priority: 'critical',
    status: 'triggered',
    message: 'Potential flash loan attack detected on Compound',
    value: '$2,100,000',
    accuracy: 92,
    responseTime: '0.2s',
    channels: ['email', 'telegram', 'discord', 'webhook'],
    acknowledged: true
  }
]

const alertTrends = [
  { date: '2024-01-01', triggered: 23, falsePositives: 2, accuracy: 91 },
  { date: '2024-01-02', triggered: 31, falsePositives: 4, accuracy: 87 },
  { date: '2024-01-03', triggered: 18, falsePositives: 1, accuracy: 94 },
  { date: '2024-01-04', triggered: 45, falsePositives: 6, accuracy: 87 },
  { date: '2024-01-05', triggered: 38, falsePositives: 3, accuracy: 92 },
  { date: '2024-01-06', triggered: 29, falsePositives: 2, accuracy: 93 },
  { date: '2024-01-07', triggered: 47, falsePositives: 4, accuracy: 91 }
]

const alertsByType = [
  { type: 'whale_movement', count: 89, percentage: 32.1, avgAccuracy: 94 },
  { type: 'price_movement', count: 67, percentage: 24.2, avgAccuracy: 87 },
  { type: 'protocol_monitoring', count: 45, percentage: 16.2, avgAccuracy: 91 },
  { type: 'sentiment_analysis', count: 38, percentage: 13.7, avgAccuracy: 82 },
  { type: 'wallet_analysis', count: 23, percentage: 8.3, avgAccuracy: 96 },
  { type: 'security', count: 15, percentage: 5.4, avgAccuracy: 89 }
]

const performanceMetrics = [
  { metric: 'Total Alerts', value: 1247, change: 12.5, period: '7 days' },
  { metric: 'Accuracy Rate', value: 91.2, change: 2.3, period: '7 days' },
  { metric: 'Avg Response Time', value: 1.1, change: -8.2, period: '7 days' },
  { metric: 'False Positives', value: 22, change: -15.4, period: '7 days' }
]

export function AlertHistory() {
  const [timeframe, setTimeframe] = useState('7d')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'text-green-600 bg-green-50'
      case 'false_positive': return 'text-red-600 bg-red-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whale_movement': return <Users className="h-4 w-4" />
      case 'price_movement': return <TrendingUp className="h-4 w-4" />
      case 'wallet_analysis': return <Eye className="h-4 w-4" />
      case 'protocol_monitoring': return <Zap className="h-4 w-4" />
      case 'sentiment_analysis': return <Bell className="h-4 w-4" />
      case 'security': return <AlertTriangle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered': return <CheckCircle className="h-4 w-4" />
      case 'false_positive': return <XCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const filteredAlerts = alertHistory.filter(alert => {
    if (filterType !== 'all' && alert.type !== filterType) return false
    if (filterStatus !== 'all' && alert.status !== filterStatus) return false
    if (filterPriority !== 'all' && alert.priority !== filterPriority) return false
    if (searchQuery && !alert.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Alert History & Analytics
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
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Historical Analysis
          </Badge>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {metric.metric.includes('Time') ? `${metric.value}s` : 
                     metric.metric.includes('Rate') ? `${metric.value}%` : 
                     metric.value}
                  </p>
                  <p className={`text-xs ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change >= 0 ? '+' : ''}{metric.change}% ({metric.period})
                  </p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whale_movement">Whale Movement</SelectItem>
                <SelectItem value="price_movement">Price Movement</SelectItem>
                <SelectItem value="protocol_monitoring">Protocol</SelectItem>
                <SelectItem value="sentiment_analysis">Sentiment</SelectItem>
                <SelectItem value="wallet_analysis">Wallet</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="triggered">Triggered</SelectItem>
                <SelectItem value="false_positive">False Positive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert History List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedAlert(selectedAlert === alert.id ? null : alert.id)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.rule}</h3>
                          <Badge className={getStatusColor(alert.status)}>
                            {getStatusIcon(alert.status)}
                            {alert.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Value</p>
                        <p className={`font-semibold ${alert.value.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                          {alert.value}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="font-semibold">{alert.accuracy}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Response</p>
                        <p className="font-semibold">{alert.responseTime}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Channels</p>
                        <div className="flex gap-1">
                          {alert.channels.map((channel, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                      {alert.acknowledged && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  {selectedAlert === alert.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Alert Details:</p>
                          <p className="text-gray-600">Type: {alert.type.replace('_', ' ')}</p>
                          <p className="text-gray-600">Priority: {alert.priority}</p>
                          <p className="text-gray-600">Response Time: {alert.responseTime}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Performance:</p>
                          <p className="text-gray-600">Accuracy: {alert.accuracy}%</p>
                          <p className="text-gray-600">Status: {alert.status.replace('_', ' ')}</p>
                          <p className="text-gray-600">Acknowledged: {alert.acknowledged ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Alert Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={alertTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="triggered" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="falsePositives" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-600" />
                  Alerts by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={alertsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Alert Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertsByType.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {getTypeIcon(type.type)}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{type.type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">{type.count} alerts ({type.percentage}%)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Avg Accuracy</p>
                      <p className="font-semibold text-green-600">{type.avgAccuracy}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                Accuracy Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={alertTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="accuracy" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}