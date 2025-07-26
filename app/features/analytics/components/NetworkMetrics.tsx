"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Activity, Zap, Globe, TrendingUp, TrendingDown, Users, Clock, Shield, AlertTriangle, CheckCircle, Network, Cpu, Database, Wifi } from "lucide-react"

const networkHealthData = [
  { time: '00:00', tps: 2400, gasPrice: 25, blockTime: 12.5, congestion: 15 },
  { time: '04:00', tps: 2800, gasPrice: 18, blockTime: 12.1, congestion: 8 },
  { time: '08:00', tps: 3200, gasPrice: 45, blockTime: 13.2, congestion: 35 },
  { time: '12:00', tps: 4100, gasPrice: 67, blockTime: 14.8, congestion: 58 },
  { time: '16:00', tps: 3800, gasPrice: 52, blockTime: 13.9, congestion: 42 },
  { time: '20:00', tps: 3400, gasPrice: 38, blockTime: 13.1, congestion: 28 }
]

const validatorMetrics = [
  { name: 'Active Validators', value: 892456, change: '+2.3%', status: 'healthy' },
  { name: 'Staking Ratio', value: 68.7, change: '+0.8%', status: 'healthy' },
  { name: 'Slashing Events', value: 12, change: '-15%', status: 'warning' },
  { name: 'Validator Uptime', value: 99.8, change: '+0.1%', status: 'healthy' }
]

const networkPerformanceData = [
  { metric: 'Throughput', current: 85, optimal: 100, network: 'Ethereum' },
  { metric: 'Latency', current: 92, optimal: 100, network: 'Ethereum' },
  { metric: 'Decentralization', current: 78, optimal: 100, network: 'Ethereum' },
  { metric: 'Security', current: 96, optimal: 100, network: 'Ethereum' },
  { metric: 'Scalability', current: 65, optimal: 100, network: 'Ethereum' },
  { metric: 'Energy Efficiency', current: 88, optimal: 100, network: 'Ethereum' }
]

const nodeDistribution = [
  { region: 'North America', nodes: 3456, percentage: 35.2, latency: 45 },
  { region: 'Europe', nodes: 2890, percentage: 29.4, latency: 38 },
  { region: 'Asia Pacific', nodes: 2234, percentage: 22.7, latency: 52 },
  { region: 'South America', nodes: 678, percentage: 6.9, latency: 67 },
  { region: 'Africa', nodes: 456, percentage: 4.6, latency: 78 },
  { region: 'Others', nodes: 123, percentage: 1.2, latency: 89 }
]

const protocolMetrics = [
  { protocol: 'Ethereum', tvl: 45600000000, transactions: 1200000, fees: 12500000, growth: 8.5 },
  { protocol: 'Polygon', tvl: 8900000000, transactions: 3400000, fees: 450000, growth: 15.2 },
  { protocol: 'Arbitrum', tvl: 6700000000, transactions: 890000, fees: 2100000, growth: 22.8 },
  { protocol: 'Optimism', tvl: 4500000000, transactions: 670000, fees: 1800000, growth: 18.9 },
  { protocol: 'BSC', tvl: 3200000000, transactions: 2100000, fees: 890000, growth: -2.3 }
]

const securityMetrics = [
  { date: '2024-01-01', attacks: 2, vulnerabilities: 5, patches: 8, score: 92 },
  { date: '2024-01-02', attacks: 1, vulnerabilities: 3, patches: 12, score: 94 },
  { date: '2024-01-03', attacks: 0, vulnerabilities: 2, patches: 6, score: 96 },
  { date: '2024-01-04', attacks: 3, vulnerabilities: 7, patches: 15, score: 89 },
  { date: '2024-01-05', attacks: 1, vulnerabilities: 4, patches: 9, score: 93 },
  { date: '2024-01-06', attacks: 0, vulnerabilities: 1, patches: 4, score: 97 },
  { date: '2024-01-07', attacks: 2, vulnerabilities: 6, patches: 11, score: 91 }
]

export function NetworkMetrics() {
  const [timeframe, setTimeframe] = useState('24h')
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum')
  const [metricType, setMetricType] = useState('performance')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600'
    if (value >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Network Metrics Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="arbitrum">Arbitrum</SelectItem>
              <SelectItem value="optimism">Optimism</SelectItem>
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
          <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <Network className="h-3 w-3 mr-1" />
            Real-time Monitoring
          </Badge>
        </div>
      </div>

      {/* Key Network Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Network TPS</p>
                <p className="text-2xl font-bold text-blue-700">3,247</p>
                <p className="text-xs text-blue-500">+12% vs avg</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Gas Price</p>
                <p className="text-2xl font-bold text-green-700">42 Gwei</p>
                <p className="text-xs text-green-500">-8% vs yesterday</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Block Time</p>
                <p className="text-2xl font-bold text-purple-700">13.2s</p>
                <p className="text-xs text-purple-500">Optimal range</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Network Health</p>
                <p className="text-2xl font-bold text-orange-700">96%</p>
                <p className="text-xs text-orange-500">Excellent</p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={metricType} onValueChange={setMetricType} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Network Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={networkHealthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tps" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="gasPrice" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-purple-600" />
                  Performance Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={networkPerformanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Current" dataKey="current" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Radar name="Optimal" dataKey="optimal" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                Protocol Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {protocolMetrics.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{protocol.protocol}</p>
                        <p className="text-sm text-gray-500">TVL: ${(protocol.tvl / 1e9).toFixed(1)}B</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">24h Transactions</p>
                        <p className="font-semibold">{(protocol.transactions / 1e6).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">24h Fees</p>
                        <p className="font-semibold">${(protocol.fees / 1e6).toFixed(1)}M</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Growth</p>
                        <p className={`font-semibold ${getGrowthColor(protocol.growth)}`}>
                          {protocol.growth > 0 ? '+' : ''}{protocol.growth}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {validatorMetrics.map((metric, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status === 'healthy' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {metric.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {metric.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    {typeof metric.value === 'number' && metric.value > 1000 
                      ? metric.value.toLocaleString() 
                      : metric.value}{metric.name.includes('Ratio') || metric.name.includes('Uptime') ? '%' : ''}
                  </p>
                  <p className={`text-sm ${getGrowthColor(parseFloat(metric.change))}`}>
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Validator Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={networkHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="tps" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="blockTime" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Metrics Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={securityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="attacks" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="vulnerabilities" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="patches" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Node Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nodeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="nodes" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-blue-600" />
                  Regional Latency Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nodeDistribution.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{region.region}</p>
                        <p className="text-sm text-gray-500">{region.nodes.toLocaleString()} nodes ({region.percentage}%)</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getPerformanceColor(100 - region.latency)}`}>
                          {region.latency}ms
                        </p>
                        <Progress value={100 - region.latency} className="w-20 mt-1" />
                      </div>
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