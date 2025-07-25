'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bot, 
  Code, 
  Database, 
  Zap, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Copy, 
  ExternalLink,
  Play,
  BookOpen,
  Cpu,
  Globe
} from 'lucide-react'

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('detection')
  const [apiKey, setApiKey] = useState('')

  const endpoints = [
    {
      id: 'detection',
      name: 'AI Detection',
      method: 'POST',
      path: '/api/v1/ai/detect',
      description: 'Real-time AI-powered anomaly detection for transactions',
      category: 'AI Core'
    },
    {
      id: 'prediction',
      name: 'Price Prediction',
      method: 'GET',
      path: '/api/v1/ai/predict/{token}',
      description: 'ML-based price prediction and trend analysis',
      category: 'AI Core'
    },
    {
      id: 'risk',
      name: 'Risk Assessment',
      method: 'POST',
      path: '/api/v1/ai/risk/assess',
      description: 'Comprehensive risk scoring using multiple AI models',
      category: 'AI Core'
    },
    {
      id: 'agent',
      name: 'Agent Builder',
      method: 'POST',
      path: '/api/v1/agents/create',
      description: 'Create and deploy custom AI trading agents',
      category: 'Agent Platform'
    },
    {
      id: 'webhook',
      name: 'Webhooks',
      method: 'POST',
      path: '/api/v1/webhooks/register',
      description: 'Real-time notifications for AI events and alerts',
      category: 'Integration'
    },
    {
      id: 'stream',
      name: 'Data Stream',
      method: 'WebSocket',
      path: 'wss://api.insider.ai/v1/stream',
      description: 'Live blockchain data with AI annotations',
      category: 'Data'
    }
  ]

  const codeExamples = {
    detection: {
      curl: `curl -X POST "https://api.insider.ai/v1/ai/detect" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "transaction_hash": "0x123...",
    "wallet_address": "sei1abc...",
    "models": ["rugpull", "whale", "arbitrage"]
  }'`,
      javascript: `const response = await fetch('https://api.insider.ai/v1/ai/detect', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    transaction_hash: '0x123...',
    wallet_address: 'sei1abc...',
    models: ['rugpull', 'whale', 'arbitrage']
  })
})

const result = await response.json()
console.log('AI Detection Result:', result)`,
      python: `import requests

url = "https://api.insider.ai/v1/ai/detect"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "transaction_hash": "0x123...",
    "wallet_address": "sei1abc...",
    "models": ["rugpull", "whale", "arbitrage"]
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("AI Detection Result:", result)`
    },
    agent: {
      curl: `curl -X POST "https://api.insider.ai/v1/agents/create" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Trading Bot",
    "strategy": "dca_with_ai_signals",
    "config": {
      "risk_threshold": 0.3,
      "max_position_size": 1000,
      "ai_models": ["price_prediction", "sentiment"]
    }
  }'`,
      javascript: `const agent = await fetch('https://api.insider.ai/v1/agents/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Trading Bot',
    strategy: 'dca_with_ai_signals',
    config: {
      risk_threshold: 0.3,
      max_position_size: 1000,
      ai_models: ['price_prediction', 'sentiment']
    }
  })
})

const result = await agent.json()
console.log('Agent Created:', result.agent_id)`,
      python: `import requests

url = "https://api.insider.ai/v1/agents/create"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "name": "My Trading Bot",
    "strategy": "dca_with_ai_signals",
    "config": {
        "risk_threshold": 0.3,
        "max_position_size": 1000,
        "ai_models": ["price_prediction", "sentiment"]
    }
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print("Agent Created:", result["agent_id"])`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                <Code className="h-8 w-8 mr-3 text-purple-600" />
                API Documentation
              </h1>
              <p className="text-slate-600 mt-2">Build powerful AI agents with our comprehensive API</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                API Status: Online
              </Badge>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get API Key
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-slate-200 shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-900">Categories</h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-slate-600">
                      <Bot className="h-4 w-4 mr-2 text-purple-600" />
                      AI Core (3)
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Cpu className="h-4 w-4 mr-2 text-blue-600" />
                      Agent Platform (1)
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Zap className="h-4 w-4 mr-2 text-orange-600" />
                      Integration (1)
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Database className="h-4 w-4 mr-2 text-green-600" />
                      Data (1)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
                  <Globe className="h-6 w-6 mr-2 text-blue-600" />
                  Insider AI API Overview
                </CardTitle>
                <CardDescription>
                  The most advanced AI-powered blockchain intelligence API. Build trading bots, risk management systems, and analytics tools with our ML models.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Bot className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <p className="text-sm text-slate-600">AI Models</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-blue-600">50ms</div>
                    <p className="text-sm text-slate-600">Avg Response</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <p className="text-sm text-slate-600">Uptime</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">API Endpoints</CardTitle>
                <CardDescription>
                  Explore our comprehensive set of AI-powered endpoints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {endpoints.map((endpoint) => (
                    <div
                      key={endpoint.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedEndpoint === endpoint.id
                          ? 'border-purple-200 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{endpoint.name}</h3>
                        <Badge 
                          variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{endpoint.description}</p>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">{endpoint.path}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            {selectedEndpoint && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
                    <Play className="h-5 w-5 mr-2 text-green-600" />
                    Code Examples
                  </CardTitle>
                  <CardDescription>
                    Ready-to-use code snippets for {endpoints.find(e => e.id === selectedEndpoint)?.name}
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
                            <code>{codeExamples[selectedEndpoint as keyof typeof codeExamples]?.[lang as keyof typeof codeExamples.detection] || 'Code example not available'}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                            onClick={() => navigator.clipboard.writeText(codeExamples[selectedEndpoint as keyof typeof codeExamples]?.[lang as keyof typeof codeExamples.detection] || '')}
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

            {/* Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">Getting Started Guide</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">AI Model Documentation</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">Agent Builder Tutorial</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                    <Cpu className="h-5 w-5 mr-2 text-purple-600" />
                    SDKs & Libraries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">JavaScript SDK</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">Python SDK</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <span className="text-sm font-medium text-slate-900">Go SDK</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}