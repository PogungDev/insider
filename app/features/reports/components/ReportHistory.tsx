"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { FileText, Download, Eye, Share2, Calendar, Clock, TrendingUp, Users, DollarSign, Filter, Search, MoreHorizontal, Star, Bookmark } from "lucide-react"

const reportHistory = [
  {
    id: '1',
    title: 'Q4 2023 Whale Activity Analysis',
    type: 'whale_analysis',
    status: 'completed',
    createdAt: '2024-01-07 09:30:00',
    completedAt: '2024-01-07 09:45:00',
    author: 'Sarah Chen',
    size: '2.4 MB',
    pages: 47,
    downloads: 234,
    views: 1847,
    shared: 12,
    rating: 4.8,
    tags: ['whale-tracking', 'quarterly', 'analysis'],
    description: 'Comprehensive analysis of whale wallet movements and their market impact during Q4 2023',
    keyMetrics: {
      whalesTracked: 1247,
      totalVolume: '$12.4B',
      avgTransactionSize: '$2.1M',
      marketImpact: '3.2%'
    }
  },
  {
    id: '2',
    title: 'DeFi Protocol Risk Assessment',
    type: 'risk_analysis',
    status: 'completed',
    createdAt: '2024-01-06 14:20:00',
    completedAt: '2024-01-06 16:35:00',
    author: 'Michael Rodriguez',
    size: '3.1 MB',
    pages: 62,
    downloads: 189,
    views: 1234,
    shared: 8,
    rating: 4.6,
    tags: ['defi', 'risk-assessment', 'protocols'],
    description: 'In-depth risk analysis of top 50 DeFi protocols including TVL analysis and smart contract audits',
    keyMetrics: {
      protocolsAnalyzed: 50,
      totalTVL: '$45.2B',
      riskScore: '7.2/10',
      vulnerabilities: 23
    }
  },
  {
    id: '3',
    title: 'Token Unlock Impact Study',
    type: 'unlock_analysis',
    status: 'completed',
    createdAt: '2024-01-05 11:15:00',
    completedAt: '2024-01-05 13:22:00',
    author: 'Emily Watson',
    size: '1.8 MB',
    pages: 34,
    downloads: 156,
    views: 892,
    shared: 15,
    rating: 4.9,
    tags: ['token-unlocks', 'market-impact', 'analysis'],
    description: 'Analysis of token unlock events and their correlation with price movements across major tokens',
    keyMetrics: {
      tokensAnalyzed: 127,
      unlockEvents: 89,
      avgPriceImpact: '-4.2%',
      recoveryTime: '3.2 days'
    }
  },
  {
    id: '4',
    title: 'Cross-Chain Bridge Security Report',
    type: 'security_analysis',
    status: 'processing',
    createdAt: '2024-01-07 16:45:00',
    completedAt: null,
    author: 'David Kim',
    size: null,
    pages: null,
    downloads: 0,
    views: 0,
    shared: 0,
    rating: null,
    tags: ['cross-chain', 'security', 'bridges'],
    description: 'Comprehensive security assessment of major cross-chain bridge protocols',
    keyMetrics: {
      bridgesAnalyzed: 15,
      totalTVL: '$8.9B',
      securityScore: 'TBD',
      incidents: 7
    }
  },
  {
    id: '5',
    title: 'NFT Market Sentiment Analysis',
    type: 'sentiment_analysis',
    status: 'completed',
    createdAt: '2024-01-04 08:30:00',
    completedAt: '2024-01-04 10:15:00',
    author: 'Lisa Park',
    size: '2.7 MB',
    pages: 41,
    downloads: 298,
    views: 2156,
    shared: 23,
    rating: 4.7,
    tags: ['nft', 'sentiment', 'market-analysis'],
    description: 'Social sentiment analysis and market trends in the NFT space during December 2023',
    keyMetrics: {
      collectionsTracked: 500,
      sentimentScore: '6.8/10',
      volumeChange: '-23.4%',
      activeTraders: '45.2K'
    }
  },
  {
    id: '6',
    title: 'Stablecoin Depeg Risk Analysis',
    type: 'risk_analysis',
    status: 'failed',
    createdAt: '2024-01-03 13:20:00',
    completedAt: '2024-01-03 13:25:00',
    author: 'Alex Thompson',
    size: null,
    pages: null,
    downloads: 0,
    views: 0,
    shared: 0,
    rating: null,
    tags: ['stablecoin', 'risk', 'depeg'],
    description: 'Analysis of stablecoin stability mechanisms and depeg risk factors',
    keyMetrics: {
      stablecoinsAnalyzed: 12,
      totalSupply: '$120B',
      riskLevel: 'Medium',
      depegEvents: 3
    }
  }
]

const reportStats = [
  { label: 'Total Reports', value: 247, change: 12.5, period: '30 days' },
  { label: 'Avg Rating', value: 4.7, change: 3.2, period: '30 days' },
  { label: 'Total Downloads', value: 15847, change: 18.9, period: '30 days' },
  { label: 'Active Authors', value: 23, change: 8.7, period: '30 days' }
]

const reportsByType = [
  { type: 'whale_analysis', count: 45, percentage: 32.1, color: '#3B82F6' },
  { type: 'risk_analysis', count: 38, percentage: 27.1, color: '#EF4444' },
  { type: 'sentiment_analysis', count: 29, percentage: 20.7, color: '#10B981' },
  { type: 'unlock_analysis', count: 18, percentage: 12.9, color: '#F59E0B' },
  { type: 'security_analysis', count: 10, percentage: 7.1, color: '#8B5CF6' }
]

const downloadTrends = [
  { date: '2024-01-01', downloads: 234, views: 1847, reports: 8 },
  { date: '2024-01-02', downloads: 189, views: 1456, reports: 6 },
  { date: '2024-01-03', downloads: 298, views: 2156, reports: 9 },
  { date: '2024-01-04', downloads: 156, views: 1234, reports: 5 },
  { date: '2024-01-05', downloads: 267, views: 1789, reports: 7 },
  { date: '2024-01-06', downloads: 345, views: 2345, reports: 11 },
  { date: '2024-01-07', downloads: 423, views: 2987, reports: 13 }
]

export function ReportHistory() {
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterAuthor, setFilterAuthor] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('created_desc')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50'
      case 'processing': return 'text-blue-600 bg-blue-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'draft': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'whale_analysis': return 'bg-blue-100 text-blue-700'
      case 'risk_analysis': return 'bg-red-100 text-red-700'
      case 'sentiment_analysis': return 'bg-green-100 text-green-700'
      case 'unlock_analysis': return 'bg-yellow-100 text-yellow-700'
      case 'security_analysis': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whale_analysis': return <Users className="h-4 w-4" />
      case 'risk_analysis': return <TrendingUp className="h-4 w-4" />
      case 'sentiment_analysis': return <Star className="h-4 w-4" />
      case 'unlock_analysis': return <Calendar className="h-4 w-4" />
      case 'security_analysis': return <Eye className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredReports = reportHistory.filter(report => {
    if (filterType !== 'all' && report.type !== filterType) return false
    if (filterStatus !== 'all' && report.status !== filterStatus) return false
    if (filterAuthor !== 'all' && report.author !== filterAuthor) return false
    if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !report.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'created_desc': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'created_asc': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'downloads_desc': return b.downloads - a.downloads
      case 'rating_desc': return (b.rating || 0) - (a.rating || 0)
      default: return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Report History & Analytics
        </h1>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <FileText className="h-3 w-3 mr-1" />
            Report Center
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-green-700">{stat.value.toLocaleString()}</p>
                  <p className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}% ({stat.period})
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whale_analysis">Whale Analysis</SelectItem>
                <SelectItem value="risk_analysis">Risk Analysis</SelectItem>
                <SelectItem value="sentiment_analysis">Sentiment Analysis</SelectItem>
                <SelectItem value="unlock_analysis">Unlock Analysis</SelectItem>
                <SelectItem value="security_analysis">Security Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_desc">Newest First</SelectItem>
                <SelectItem value="created_asc">Oldest First</SelectItem>
                <SelectItem value="downloads_desc">Most Downloaded</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report List */}
          <div className="space-y-4">
            {sortedReports.map((report) => (
              <Card key={report.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedReport(selectedReport === report.id ? null : report.id)}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>By {report.author}</span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          {report.size && <span>{report.size}</span>}
                          {report.pages && <span>{report.pages} pages</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {report.status === 'completed' && (
                        <>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Downloads</p>
                            <p className="font-semibold">{report.downloads}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600">Views</p>
                            <p className="font-semibold">{report.views}</p>
                          </div>
                          {report.rating && (
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Rating</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold">{report.rating}</span>
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                      {report.status === 'processing' && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600">Processing...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedReport === report.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(report.keyMetrics).map(([key, value]) => (
                          <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                      {report.tags.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Tags:</p>
                          <div className="flex gap-2 flex-wrap">
                            {report.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Reports by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type.replace('_', ' ')} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {reportsByType.map((entry, index) => (
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
                  <BarChart className="h-5 w-5 text-blue-600" />
                  Report Type Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                          {getTypeIcon(type.type)}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{type.type.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-500">{type.count} reports ({type.percentage}%)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                            style={{ width: `${type.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Download & View Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={downloadTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={2} name="Downloads" />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} name="Views" />
                  <Line type="monotone" dataKey="reports" stroke="#8B5CF6" strokeWidth={2} name="New Reports" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}