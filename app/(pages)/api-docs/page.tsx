'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Code, 
  Shield, 
  Activity, 
  Copy, 
  ExternalLink,
  Play,
  BookOpen,
  Cpu,
  ChevronDown,
  ChevronRight,
  Download,
  Key
} from 'lucide-react'

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('wallets-search')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())

  const endpoints = [
    {
      id: 'wallets-search',
      name: 'Search Wallets',
      method: 'GET',
      path: '/api/search/wallet',
      description: 'Search for wallets by address, label, or other criteria',
      category: 'Wallets',
      parameters: [
        { name: 'q', type: 'string', required: true, description: 'Search query' },
        { name: 'type', type: 'string', required: false, description: 'Wallet type filter' },
        { name: 'limit', type: 'integer', required: false, description: 'Number of results' }
      ]
    },
    {
      id: 'wallets-profile',
      name: 'Wallet Profile',
      method: 'GET',
      path: '/api/wallets/{address}',
      description: 'Get detailed wallet profile and analytics',
      category: 'Wallets',
      parameters: [
        { name: 'address', type: 'string', required: true, description: 'Wallet address' }
      ]
    },
    {
      id: 'whales-top',
      name: 'Top Whales',
      method: 'GET',
      path: '/api/whales/top',
      description: 'Get list of top whale wallets with filtering and sorting',
      category: 'Whales',
      parameters: [
        { name: 'limit', type: 'integer', required: false, description: 'Number of whales' },
        { name: 'sortBy', type: 'string', required: false, description: 'Sort criteria' }
      ]
    },
    {
      id: 'alerts-rules-list',
      name: 'List Alert Rules',
      method: 'GET',
      path: '/api/alerts/rules',
      description: 'Get all alert rules with filtering and pagination',
      category: 'Alerts',
      parameters: [
        { name: 'status', type: 'string', required: false, description: 'Filter by status' },
        { name: 'type', type: 'string', required: false, description: 'Filter by type' }
      ]
    }
  ]

  const categories = ['all', 'Wallets', 'Whales', 'Alerts', 'Screener', 'Patterns', 'Unlocks', 'Developer']

  const filteredEndpoints = endpoints.filter(endpoint => {
    const matchesCategory = selectedCategory === 'all' || endpoint.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const toggleEndpoint = (endpointId: string) => {
    const newExpanded = new Set(expandedEndpoints)
    if (newExpanded.has(endpointId)) {
      newExpanded.delete(endpointId)
    } else {
      newExpanded.add(endpointId)
    }
    setExpandedEndpoints(newExpanded)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500'
      case 'POST': return 'bg-blue-500'
      case 'PUT': return 'bg-orange-500'
      case 'PATCH': return 'bg-yellow-500'
      case 'DELETE': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getCodeExample = (endpoint: any, language: string) => {
    const baseUrl = 'https://api.insider.dev'

    switch (language) {
      case 'curl':
        if (endpoint.method === 'GET') {
          return `curl -X GET "${baseUrl}${endpoint.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        } else {
          return `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "example": "data"
  }'`
        }
      case 'javascript':
        if (endpoint.method === 'GET') {
          return `const response = await fetch('${baseUrl}${endpoint.path}', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})

const result = await response.json()
console.log('Result:', result)`
        } else {
          return `const response = await fetch('${baseUrl}${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    example: 'data'
  })
})

const result = await response.json()
console.log('Result:', result)`
        }
      case 'python':
        if (endpoint.method === 'GET') {
          return `import requests

url = "${baseUrl}${endpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
result = response.json()
print("Result:", result)`
        } else {
          return `import requests

url = "${baseUrl}${endpoint.path}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "example": "data"
}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=data)
result = response.json()
print("Result:", result)`
        }
      default:
        return 'Code example not available'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
                API Documentation
              </h1>
              <p className="text-muted-foreground mt-2">Comprehensive API for blockchain wallet monitoring and analytics</p>
              <div className="flex items-center space-x-4 mt-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  API Status: Online
                </Badge>
                <Badge variant="outline">Version 1.0.0</Badge>
                <Badge variant="outline">OpenAPI 3.0.0</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Spec
              </Button>
              <Button>
                <Key className="h-4 w-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">API Endpoints</h2>
              <div className="space-y-3">
                {filteredEndpoints.map((endpoint) => (
                  <Card key={endpoint.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <Collapsible 
                      open={expandedEndpoints.has(endpoint.id)}
                      onOpenChange={() => toggleEndpoint(endpoint.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                                {endpoint.method}
                              </Badge>
                              <div>
                                <CardTitle className="text-base">{endpoint.name}</CardTitle>
                                <code className="text-sm text-muted-foreground">{endpoint.path}</code>
                              </div>
                            </div>
                            {expandedEndpoints.has(endpoint.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                          </div>
                          <CardDescription>{endpoint.description}</CardDescription>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          {endpoint.parameters && (
                            <div className="space-y-3">
                              <h4 className="font-medium">Parameters</h4>
                              <div className="space-y-2">
                                {endpoint.parameters.map((param, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <div>
                                      <code className="text-sm font-mono">{param.name}</code>
                                      {param.required && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground">{param.type}</div>
                                      <div className="text-xs text-muted-foreground">{param.description}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedEndpoint(endpoint.id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Try it
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(endpoint.path)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Code Examples</h2>
              {selectedEndpoint && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      {endpoints.find(e => e.id === selectedEndpoint)?.name}
                    </CardTitle>
                    <CardDescription>
                      {endpoints.find(e => e.id === selectedEndpoint)?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="javascript" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>
                      
                      {['javascript', 'python', 'curl'].map((lang) => (
                        <TabsContent key={lang} value={lang}>
                          <div className="relative">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{getCodeExample(endpoints.find(e => e.id === selectedEndpoint), lang)}</code>
                            </pre>
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => copyToClipboard(getCodeExample(endpoints.find(e => e.id === selectedEndpoint), lang))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Getting Started</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Authentication</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Rate Limits</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-purple-600" />
                  SDKs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">JavaScript SDK</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Python SDK</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Go SDK</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">API Status</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Contact Support</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-medium">Community</span>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
