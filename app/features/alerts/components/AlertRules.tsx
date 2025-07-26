"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, Plus, Edit, Trash2, Play, Pause, TrendingUp, TrendingDown, DollarSign, Users, Zap, Target, AlertTriangle, CheckCircle, Clock, Settings } from "lucide-react"

const alertRules = [
  {
    id: '1',
    name: 'Large ETH Transfer Alert',
    type: 'whale_movement',
    condition: 'Transfer amount > 1000 ETH',
    status: 'active',
    priority: 'high',
    triggered: 23,
    lastTriggered: '2 hours ago',
    accuracy: 94,
    channels: ['email', 'telegram', 'webhook']
  },
  {
    id: '2',
    name: 'Price Volatility Monitor',
    type: 'price_movement',
    condition: 'Price change > 5% in 15min',
    status: 'active',
    priority: 'medium',
    triggered: 156,
    lastTriggered: '45 minutes ago',
    accuracy: 87,
    channels: ['email', 'discord']
  },
  {
    id: '3',
    name: 'New Whale Wallet Detection',
    type: 'wallet_analysis',
    condition: 'New wallet with >$10M balance',
    status: 'paused',
    priority: 'high',
    triggered: 8,
    lastTriggered: '1 day ago',
    accuracy: 98,
    channels: ['telegram', 'webhook']
  },
  {
    id: '4',
    name: 'DeFi Protocol Anomaly',
    type: 'protocol_monitoring',
    condition: 'TVL change > 20% in 1 hour',
    status: 'active',
    priority: 'critical',
    triggered: 12,
    lastTriggered: '3 hours ago',
    accuracy: 91,
    channels: ['email', 'telegram', 'discord', 'webhook']
  },
  {
    id: '5',
    name: 'Sentiment Shift Alert',
    type: 'sentiment_analysis',
    condition: 'Sentiment drops below 30%',
    status: 'active',
    priority: 'medium',
    triggered: 67,
    lastTriggered: '6 hours ago',
    accuracy: 82,
    channels: ['email']
  }
]

const alertTemplates = [
  {
    name: 'Whale Movement Tracker',
    description: 'Monitor large token transfers from known whale wallets',
    category: 'whale_tracking',
    conditions: ['Transfer amount', 'Wallet balance', 'Transaction frequency'],
    popularity: 95
  },
  {
    name: 'Price Breakout Alert',
    description: 'Detect significant price movements and breakouts',
    category: 'price_analysis',
    conditions: ['Price change %', 'Volume spike', 'Technical indicators'],
    popularity: 89
  },
  {
    name: 'Smart Contract Risk Monitor',
    description: 'Alert on potential smart contract vulnerabilities',
    category: 'security',
    conditions: ['Code changes', 'Admin actions', 'Unusual patterns'],
    popularity: 76
  },
  {
    name: 'Liquidity Pool Monitor',
    description: 'Track liquidity changes in DEX pools',
    category: 'defi',
    conditions: ['Liquidity change', 'Impermanent loss', 'APY changes'],
    popularity: 83
  }
]

const alertChannels = [
  { id: 'email', name: 'Email', icon: '📧', enabled: true, config: { address: 'user@example.com' } },
  { id: 'telegram', name: 'Telegram', icon: '📱', enabled: true, config: { chatId: '@cryptoalerts' } },
  { id: 'discord', name: 'Discord', icon: '🎮', enabled: false, config: { webhook: '' } },
  { id: 'webhook', name: 'Webhook', icon: '🔗', enabled: true, config: { url: 'https://api.example.com/alerts' } },
  { id: 'sms', name: 'SMS', icon: '💬', enabled: false, config: { phone: '' } }
]

export function AlertRules() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'paused': return 'text-yellow-600 bg-yellow-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
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
      case 'wallet_analysis': return <Target className="h-4 w-4" />
      case 'protocol_monitoring': return <Zap className="h-4 w-4" />
      case 'sentiment_analysis': return <Bell className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const filteredRules = alertRules.filter(rule => {
    if (filterStatus !== 'all' && rule.status !== filterStatus) return false
    if (filterPriority !== 'all' && rule.priority !== filterPriority) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
          Alert Rules Management
        </h1>
        <div className="flex items-center gap-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Alert Rule</DialogTitle>
              </DialogHeader>
              <CreateAlertForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <Bell className="h-3 w-3 mr-1" />
            Smart Alerts
          </Badge>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Rules</p>
                <p className="text-2xl font-bold text-green-700">{alertRules.filter(r => r.status === 'active').length}</p>
                <p className="text-xs text-green-500">Running smoothly</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Alerts Today</p>
                <p className="text-2xl font-bold text-blue-700">47</p>
                <p className="text-xs text-blue-500">+12% vs yesterday</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Accuracy</p>
                <p className="text-2xl font-bold text-purple-700">91%</p>
                <p className="text-xs text-purple-500">High precision</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Response Time</p>
                <p className="text-2xl font-bold text-orange-700">1.2s</p>
                <p className="text-xs text-orange-500">Real-time alerts</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

          {/* Alert Rules List */}
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                        {getTypeIcon(rule.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <p className="text-sm text-gray-600">{rule.condition}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {rule.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
                            {rule.status}
                          </Badge>
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Triggered</p>
                        <p className="font-semibold">{rule.triggered} times</p>
                        <p className="text-xs text-gray-500">{rule.lastTriggered}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Accuracy</p>
                        <p className="font-semibold text-green-600">{rule.accuracy}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Channels</p>
                        <div className="flex gap-1">
                          {rule.channels.map((channel, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {rule.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {alertTemplates.map((template, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {template.popularity}% popular
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {template.conditions.map((condition, condIndex) => (
                        <span key={condIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alertChannels.map((channel) => (
              <Card key={channel.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{channel.icon}</span>
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="text-sm text-gray-600">Notification channel</p>
                      </div>
                    </div>
                    <Switch checked={channel.enabled} />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(channel.config).map(([key, value]) => (
                      <div key={key}>
                        <Label className="text-xs text-gray-600 capitalize">{key}</Label>
                        <Input 
                          value={value as string} 
                          placeholder={`Enter ${key}`}
                          className="mt-1"
                          disabled={!channel.enabled}
                        />
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    disabled={!channel.enabled}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreateAlertForm({ onClose }: { onClose: () => void }) {
  const [alertName, setAlertName] = useState('')
  const [alertType, setAlertType] = useState('')
  const [condition, setCondition] = useState('')
  const [priority, setPriority] = useState('medium')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email'])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Alert Name</Label>
          <Input 
            value={alertName}
            onChange={(e) => setAlertName(e.target.value)}
            placeholder="Enter alert name"
          />
        </div>
        <div>
          <Label>Alert Type</Label>
          <Select value={alertType} onValueChange={setAlertType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whale_movement">Whale Movement</SelectItem>
              <SelectItem value="price_movement">Price Movement</SelectItem>
              <SelectItem value="wallet_analysis">Wallet Analysis</SelectItem>
              <SelectItem value="protocol_monitoring">Protocol Monitoring</SelectItem>
              <SelectItem value="sentiment_analysis">Sentiment Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Condition</Label>
        <Input 
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g., Transfer amount > 1000 ETH"
        />
      </div>
      
      <div>
        <Label>Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Notification Channels</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {alertChannels.map((channel) => (
            <div key={channel.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={channel.id}
                checked={selectedChannels.includes(channel.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedChannels([...selectedChannels, channel.id])
                  } else {
                    setSelectedChannels(selectedChannels.filter(c => c !== channel.id))
                  }
                }}
              />
              <label htmlFor={channel.id} className="text-sm">
                {channel.icon} {channel.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
          Create Alert
        </Button>
      </div>
    </div>
  )
}