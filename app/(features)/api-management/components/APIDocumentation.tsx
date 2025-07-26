"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Code, Play, Copy, Book, Zap, Shield, Globe, Search, Filter, ChevronRight, ChevronDown, ExternalLink } from "lucide-react"

const apiEndpoints = [
  {
    id: '1',
    method: 'GET',
    path: '/api/v1/wallets/{address}',
    category: 'Wallet Explorer',
    title: 'Get Wallet Details',
    description: 'Retrieve comprehensive wallet information including balance, transaction history, and analytics',
    parameters: [
      { name: 'address', type: 'string', required: true, description: 'Wallet address to query' },
      { name: 'include_history', type: 'boolean', required: false, description: 'Include transaction history' },
      { name: 'limit', type: 'integer', required: false, description: 'Number of transactions to return (max 1000)' }
    ],
    response: {
      address: 'string',
      balance: 'number',
      usd_value: 'number',
      transaction_count: 'integer',
      first_seen: 'datetime',
      last_activity: 'datetime',
      risk_score: 'number',
      tags: 'array'
    },
    example: `{
  "address": "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  "balance": "1234.567890123456789",
  "usd_value": 2468135.79,
  "transaction_count": 1847,
  "first_seen": "2021-03-15T10:30:00Z",
  "last_activity": "2024-01-07T14:23:15Z",
  "risk_score": 0.23,
  "tags": ["whale", "defi_user", "early_adopter"]
}`,
    rateLimit: '1000/hour',
    authentication: 'API Key'
  },
  {
    id: '2',
    method: 'GET',
    path: '/api/v1/whales/movements',
    category: 'Whale Tracking',
    title: 'Get Whale Movements',
    description: 'Retrieve recent large transactions and whale wallet activities',
    parameters: [
      { name: 'min_value', type: 'number', required: false, description: 'Minimum transaction value in USD' },
      { name: 'timeframe', type: 'string', required: false, description: 'Time period (1h, 24h, 7d, 30d)' },
      { name: 'token', type: 'string', required: false, description: 'Filter by specific token symbol' }
    ],
    response: {
      movements: 'array',
      total_count: 'integer',
      total_value: 'number',
      timeframe: 'string'
    },
    example: `{
  "movements": [
    {
      "hash": "0xabc123...",
      "from": "0x742d35...",
      "to": "0x8ba1c9...",
      "value": "2500.0",
      "usd_value": 6250000,
      "token": "ETH",
      "timestamp": "2024-01-07T14:23:15Z",
      "whale_score": 0.95
    }
  ],
  "total_count": 47,
  "total_value": 125000000,
  "timeframe": "24h"
}`,
    rateLimit: '500/hour',
    authentication: 'API Key'
  },
  {
    id: '3',
    method: 'POST',
    path: '/api/v1/alerts/create',
    category: 'Smart Alerts',
    title: 'Create Alert Rule',
    description: 'Create a new alert rule for monitoring specific conditions',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Alert rule name' },
      { name: 'conditions', type: 'object', required: true, description: 'Alert conditions and thresholds' },
      { name: 'channels', type: 'array', required: true, description: 'Notification channels' }
    ],
    response: {
      id: 'string',
      name: 'string',
      status: 'string',
      created_at: 'datetime'
    },
    example: `{
  "name": "Large ETH Transfer Alert",
  "conditions": {
    "type": "whale_movement",
    "min_value": 1000000,
    "token": "ETH"
  },
  "channels": ["email", "telegram"]
}`,
    rateLimit: '100/hour',
    authentication: 'API Key'
  },
  {
    id: '4',
    method: 'GET',
    path: '/api/v1/unlocks/calendar',
    category: 'Token Unlocks',
    title: 'Get Unlock Calendar',
    description: 'Retrieve upcoming token unlock events and schedules',
    parameters: [
      { name: 'start_date', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
      { name: 'end_date', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' },
      { name: 'token', type: 'string', required: false, description: 'Filter by token symbol' }
    ],
    response: {
      unlocks: 'array',
      total_value: 'number',
      count: 'integer'
    },
    example: `{
  "unlocks": [
    {
      "date": "2024-01-08",
      "time": "14:00:00Z",
      "token": "ARB",
      "project": "Arbitrum",
      "amount": "1110000000",
      "value": 2220000000,
      "percentage": 11.2,
      "category": "Team & Advisors"
    }
  ],
  "total_value": 2860000000,
  "count": 23
}`,
    rateLimit: '1000/hour',
    authentication: 'API Key'
  },
  {
    id: '5',
    method: 'GET',
    path: '/api/v1/analytics/sentiment',
    category: 'Advanced Analytics',
    title: 'Get Sentiment Analysis',
    description: 'Retrieve market sentiment data and social metrics',
    parameters: [
      { name: 'token', type: 'string', required: false, description: 'Token symbol to analyze' },
      { name: 'timeframe', type: 'string', required: false, description: 'Analysis period (1h, 24h, 7d)' },
      { name: 'sources', type: 'array', required: false, description: 'Data sources to include' }
    ],
    response: {
      sentiment_score: 'number',
      social_volume: 'integer',
      trending_keywords: 'array',
      influencer_sentiment: 'number'
    },
    example: `{
  "sentiment_score": 0.68,
  "social_volume": 15847,
  "trending_keywords": ["bullish", "adoption", "partnership"],
  "influencer_sentiment": 0.72,
  "sources": ["twitter", "reddit", "telegram"],
  "timestamp": "2024-01-07T14:23:15Z"
}`,
    rateLimit: '500/hour',
    authentication: 'API Key'
  },
  {
    id: '6',
    method: 'GET',
    path: '/api/v1/reports/generate',
    category: 'Custom Reports',
    title: 'Generate Custom Report',
    description: 'Generate a custom report based on specified parameters',
    parameters: [
      { name: 'type', type: 'string', required: true, description: 'Report type (whale_analysis, risk_assessment, etc.)' },
      { name: 'parameters', type: 'object', required: true, description: 'Report-specific parameters' },
      { name: 'format', type: 'string', required: false, description: 'Output format (pdf, json, csv)' }
    ],
    response: {
      report_id: 'string',
      status: 'string',
      estimated_completion: 'datetime',
      download_url: 'string'
    },
    example: `{
  "report_id": "rpt_abc123def456",
  "status": "processing",
  "estimated_completion": "2024-01-07T15:30:00Z",
  "download_url": null
}`,
    rateLimit: '50/hour',
    authentication: 'API Key'
  }
]

const codeExamples = {
  javascript: `// JavaScript/Node.js Example
const response = await fetch('https://api.seiinsider.com/api/v1/wallets/0x742d35...', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const walletData = await response.json();
console.log(walletData);`,
  python: `# Python Example
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.seiinsider.com/api/v1/wallets/0x742d35...',
    headers=headers
)

wallet_data = response.json()
print(wallet_data)`,
  curl: `# cURL Example
curl -X GET "https://api.seiinsider.com/api/v1/wallets/0x742d35..." \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"`
}

const apiStats = [
  { label: 'Total Endpoints', value: 47, change: 8.3, period: '30 days' },
  { label: 'Avg Response Time', value: '120ms', change: -12.5, period: '30 days' },
  { label: 'Success Rate', value: '99.8%', change: 0.2, period: '30 days' },
  { label: 'Daily Requests', value: '2.4M', change: 15.7, period: '30 days' }
]

export function APIDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview'])
  const [testEndpoint, setTestEndpoint] = useState('')
  const [testParams, setTestParams] = useState('')

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-50'
      case 'POST': return 'text-blue-600 bg-blue-50'
      case 'PUT': return 'text-yellow-600 bg-yellow-50'
      case 'DELETE': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wallet Explorer': return 'bg-blue-100 text-blue-700'
      case 'Whale Tracking': return 'bg-purple-100 text-purple-700'
      case 'Smart Alerts': return 'bg-red-100 text-red-700'
      case 'Token Unlocks': return 'bg-yellow-100 text-yellow-700'
      case 'Advanced Analytics': return 'bg-green-100 text-green-700'
      case 'Custom Reports': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    if (filterCategory !== 'all' && endpoint.category !== filterCategory) return false
    if (searchQuery && !endpoint.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !endpoint.path.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const categories = [...new Set(apiEndpoints.map(e => e.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          API Documentation
        </h1>
        <div className="flex items-center gap-4">
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get API Key
          </Button>
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <Code className="h-3 w-3 mr-1" />
            API v1.0
          </Badge>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {apiStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-indigo-700">{stat.value}</p>
                  <p className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}% ({stat.period})
                  </p>
                </div>
                <Code className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="testing">API Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            {filteredEndpoints.map((endpoint) => (
              <Card key={endpoint.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.path}</code>
                      <Badge className={getCategoryColor(endpoint.category)}>
                        {endpoint.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{endpoint.rateLimit}</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedEndpoint(selectedEndpoint === endpoint.id ? null : endpoint.id)}
                      >
                        {selectedEndpoint === endpoint.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        Details
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{endpoint.title}</h3>
                    <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  </div>

                  {selectedEndpoint === endpoint.id && (
                    <div className="space-y-6 pt-4 border-t border-gray-200">
                      {/* Parameters */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          Parameters
                        </h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm font-medium">{param.name}</code>
                                  <Badge variant={param.required ? 'default' : 'outline'} className="text-xs">
                                    {param.required ? 'required' : 'optional'}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Response Schema */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Response Schema
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="text-sm">
                            {JSON.stringify(endpoint.response, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Example Response */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Example Response
                        </h4>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg relative">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2"
                            onClick={() => navigator.clipboard.writeText(endpoint.example)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <pre className="text-sm overflow-x-auto">{endpoint.example}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                API Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">API Key Authentication</h3>
                <p className="text-gray-600 mb-4">
                  All API requests require authentication using an API key. Include your API key in the Authorization header:
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg">
                  <code>Authorization: Bearer YOUR_API_KEY</code>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Rate Limiting</h3>
                <p className="text-gray-600 mb-4">
                  API requests are rate limited per endpoint. Rate limits are included in response headers:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm">
                    <li><code>X-RateLimit-Limit</code>: Maximum requests per hour</li>
                    <li><code>X-RateLimit-Remaining</code>: Remaining requests in current window</li>
                    <li><code>X-RateLimit-Reset</code>: Time when rate limit resets</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Error Handling</h3>
                <p className="text-gray-600 mb-4">
                  The API uses standard HTTP status codes and returns error details in JSON format:
                </p>
                <div className="bg-gray-900 text-red-400 p-4 rounded-lg">
                  <pre className="text-sm">{`{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid",
    "details": "Please check your API key and try again"
  }
}`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-indigo-600" />
                Code Examples
              </CardTitle>
              <div className="flex gap-2">
                {Object.keys(codeExamples).map(lang => (
                  <Button 
                    key={lang}
                    variant={selectedLanguage === lang ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg relative">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => navigator.clipboard.writeText(codeExamples[selectedLanguage as keyof typeof codeExamples])}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <pre className="text-sm overflow-x-auto">
                  {codeExamples[selectedLanguage as keyof typeof codeExamples]}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-indigo-600" />
                API Testing Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Endpoint URL</label>
                <Input 
                  placeholder="https://api.seiinsider.com/api/v1/..."
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Request Parameters (JSON)</label>
                <Textarea 
                  placeholder='{"address": "0x742d35...", "include_history": true}'
                  value={testParams}
                  onChange={(e) => setTestParams(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy as cURL
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Response</h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg min-h-[200px]">
                  <p className="text-gray-500">Send a request to see the response here...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
