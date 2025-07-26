"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Share2, Eye, Calendar, BarChart3, TrendingUp, Users, Target, Zap, Brain, Clock, CheckCircle, AlertTriangle, Settings } from "lucide-react"
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface ReportTemplate {
  id: string
  name: string
  type: 'wallet_analysis' | 'market_research' | 'risk_assessment' | 'performance_review' | 'custom'
  description: string
  sections: string[]
  estimatedTime: number
  complexity: 'basic' | 'intermediate' | 'advanced'
  tags: string[]
}

interface GeneratedReport {
  id: string
  templateId: string
  title: string
  status: 'generating' | 'completed' | 'failed' | 'scheduled'
  progress: number
  createdAt: number
  completedAt?: number
  fileSize?: number
  format: 'pdf' | 'html' | 'json' | 'csv'
  sections: ReportSection[]
  metadata: {
    wallets?: string[]
    timeframe?: string
    dataPoints?: number
    insights?: number
  }
}

interface ReportSection {
  id: string
  name: string
  type: 'summary' | 'chart' | 'table' | 'analysis' | 'recommendation'
  status: 'pending' | 'processing' | 'completed' | 'error'
  data?: any
  insights?: string[]
}

interface ReportConfig {
  templateId: string
  title: string
  description: string
  walletAddresses: string[]
  timeframe: string
  includeCharts: boolean
  includeRecommendations: boolean
  format: 'pdf' | 'html' | 'json' | 'csv'
  sections: string[]
  customParameters: Record<string, any>
}

export function ReportGenerator() {
  const { targetWallet, analysisData } = useWallet()
  const [selectedTemplate, setSelectedTemplate] = useState("wallet_analysis_1")
  const [reportConfig, setReportConfig] = useState<Partial<ReportConfig>>({})
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("templates")

  useEffect(() => {
    loadReportData()
  }, [targetWallet, analysisData])

  const loadReportData = () => {
    // Mock templates
    const mockTemplates: ReportTemplate[] = [
      {
        id: 'wallet_analysis_1',
        name: 'Comprehensive Wallet Analysis',
        type: 'wallet_analysis',
        description: 'Deep dive analysis of wallet behavior, patterns, and risk assessment',
        sections: ['Executive Summary', 'Wallet Overview', 'Transaction Analysis', 'Risk Assessment', 'Behavioral Patterns', 'Recommendations'],
        estimatedTime: 15,
        complexity: 'advanced',
        tags: ['wallet', 'behavior', 'risk', 'comprehensive']
      },
      {
        id: 'market_research_1',
        name: 'Market Intelligence Report',
        type: 'market_research',
        description: 'Market trends, sentiment analysis, and trading opportunities',
        sections: ['Market Overview', 'Sentiment Analysis', 'Whale Activity', 'Price Predictions', 'Trading Signals'],
        estimatedTime: 20,
        complexity: 'intermediate',
        tags: ['market', 'sentiment', 'trading', 'signals']
      },
      {
        id: 'risk_assessment_1',
        name: 'Portfolio Risk Assessment',
        type: 'risk_assessment',
        description: 'Comprehensive risk analysis and mitigation strategies',
        sections: ['Risk Overview', 'Exposure Analysis', 'Correlation Matrix', 'Stress Testing', 'Mitigation Strategies'],
        estimatedTime: 12,
        complexity: 'advanced',
        tags: ['risk', 'portfolio', 'analysis', 'mitigation']
      },
      {
        id: 'performance_review_1',
        name: 'Performance Review Report',
        type: 'performance_review',
        description: 'Detailed performance analysis with benchmarking',
        sections: ['Performance Summary', 'Benchmark Comparison', 'Attribution Analysis', 'Trade Analysis', 'Improvement Areas'],
        estimatedTime: 10,
        complexity: 'intermediate',
        tags: ['performance', 'benchmark', 'analysis', 'improvement']
      }
    ]

    // Mock generated reports dengan data spesifik wallet jika tersedia
    let mockGeneratedReports: GeneratedReport[] = [
      {
        id: '1',
        templateId: 'wallet_analysis_1',
        title: 'Whale Wallet 0x1a2b... Analysis Report',
        status: 'completed',
        progress: 100,
        createdAt: Date.now() - 3600000,
        completedAt: Date.now() - 3000000,
        fileSize: 2.4,
        format: 'pdf',
        sections: [
          { id: '1', name: 'Executive Summary', type: 'summary', status: 'completed' },
          { id: '2', name: 'Wallet Overview', type: 'analysis', status: 'completed' },
          { id: '3', name: 'Transaction Analysis', type: 'chart', status: 'completed' },
          { id: '4', name: 'Risk Assessment', type: 'table', status: 'completed' },
          { id: '5', name: 'Recommendations', type: 'recommendation', status: 'completed' }
        ],
        metadata: {
          wallets: ['0x1a2b3c4d...'],
          timeframe: '30 days',
          dataPoints: 1247,
          insights: 23
        }
      },
      {
        id: '2',
        templateId: 'market_research_1',
        title: 'SEI Ecosystem Market Intelligence',
        status: 'generating',
        progress: 65,
        createdAt: Date.now() - 1800000,
        format: 'html',
        sections: [
          { id: '1', name: 'Market Overview', type: 'summary', status: 'completed' },
          { id: '2', name: 'Sentiment Analysis', type: 'chart', status: 'completed' },
          { id: '3', name: 'Whale Activity', type: 'analysis', status: 'processing' },
          { id: '4', name: 'Price Predictions', type: 'chart', status: 'pending' },
          { id: '5', name: 'Trading Signals', type: 'recommendation', status: 'pending' }
        ],
        metadata: {
          timeframe: '7 days',
          dataPoints: 5632,
          insights: 18
        }
      },
      {
        id: '3',
        templateId: 'risk_assessment_1',
        title: 'DeFi Portfolio Risk Analysis',
        status: 'completed',
        progress: 100,
        createdAt: Date.now() - 7200000,
        completedAt: Date.now() - 6600000,
        fileSize: 1.8,
        format: 'pdf',
        sections: [
          { id: '1', name: 'Risk Overview', type: 'summary', status: 'completed' },
          { id: '2', name: 'Exposure Analysis', type: 'chart', status: 'completed' },
          { id: '3', name: 'Correlation Matrix', type: 'table', status: 'completed' },
          { id: '4', name: 'Stress Testing', type: 'analysis', status: 'completed' },
          { id: '5', name: 'Mitigation Strategies', type: 'recommendation', status: 'completed' }
        ],
        metadata: {
          wallets: ['0x5e6f7g8h...', '0x9i0j1k2l...'],
          timeframe: '90 days',
          dataPoints: 3421,
          insights: 31
        }
      }
    ]

    // Add target wallet specific report if available
    if (targetWallet && analysisData) {
      const targetReport: GeneratedReport = {
        id: `target-${targetWallet.slice(-8)}`,
        templateId: 'wallet_analysis_1',
        title: `${targetWallet.slice(0, 8)}... Analysis Report`,
        status: analysisData.riskScore > 70 ? 'completed' : 'generating',
        progress: analysisData.riskScore > 70 ? 100 : 75,
        createdAt: Date.now() - 1800000,
        completedAt: analysisData.riskScore > 70 ? Date.now() - 1200000 : undefined,
        fileSize: 1.9,
        format: 'pdf',
        sections: [
          { id: '1', name: 'Executive Summary', type: 'summary', status: 'completed' },
          { id: '2', name: 'Wallet Overview', type: 'analysis', status: 'completed' },
          { id: '3', name: 'Transaction Analysis', type: 'chart', status: 'completed' },
          { id: '4', name: 'Risk Assessment', type: 'table', status: analysisData.riskScore > 70 ? 'completed' : 'processing' },
          { id: '5', name: 'Recommendations', type: 'recommendation', status: analysisData.riskScore > 70 ? 'completed' : 'pending' }
        ],
        metadata: {
          wallets: [targetWallet],
          timeframe: '30 days',
          dataPoints: analysisData.transactionCount || 850,
          insights: Math.floor((analysisData.riskScore || 50) / 3)
        }
      }
      mockGeneratedReports.unshift(targetReport)
    }

    setTemplates(mockTemplates)
    setGeneratedReports(mockGeneratedReports)
  }

  const getTemplateTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet_analysis': return <Users className="h-4 w-4 text-blue-500" />
      case 'market_research': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'risk_assessment': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'performance_review': return <BarChart3 className="h-4 w-4 text-purple-500" />
      case 'custom': return <Settings className="h-4 w-4 text-gray-500" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSectionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'processing': return <Clock className="h-3 w-3 text-blue-500 animate-spin" />
      case 'error': return <AlertTriangle className="h-3 w-3 text-red-500" />
      case 'pending': return <Clock className="h-3 w-3 text-gray-400" />
      default: return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const formatFileSize = (size: number) => {
    return `${size.toFixed(1)} MB`
  }

  const generateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setActiveTab("reports")
    }, 3000)
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Report Generator</h2>
          <p className="text-muted-foreground">Generate comprehensive analysis reports dengan AI insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Template
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="configure">Configure Report</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
          <TabsTrigger value="schedule">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
                setSelectedTemplate(template.id)
                setActiveTab("configure")
              }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTemplateTypeIcon(template.type)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <Badge className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sections</p>
                      <p className="font-semibold">{template.sections.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Est. Time</p>
                      <p className="font-semibold">{template.estimatedTime} min</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Sections:</p>
                    <div className="text-xs text-muted-foreground">
                      {template.sections.slice(0, 3).join(', ')}
                      {template.sections.length > 3 && ` +${template.sections.length - 3} more`}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          {selectedTemplateData && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getTemplateTypeIcon(selectedTemplateData.type)}
                  <div>
                    <CardTitle>{selectedTemplateData.name}</CardTitle>
                    <CardDescription>{selectedTemplateData.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter report title"
                      value={reportConfig.title || ''}
                      onChange={(e) => setReportConfig({...reportConfig, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select value={reportConfig.format || 'pdf'} onValueChange={(value) => setReportConfig({...reportConfig, format: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="html">HTML Report</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                        <SelectItem value="csv">CSV Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the report purpose"
                    value={reportConfig.description || ''}
                    onChange={(e) => setReportConfig({...reportConfig, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallets">Wallet Addresses</Label>
                    <Textarea
                      id="wallets"
                      placeholder="Enter wallet addresses (one per line)"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Analysis Timeframe</Label>
                    <Select defaultValue="30d">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last 1 year</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Report Sections</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTemplateData.sections.map((section, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Checkbox id={`section-${idx}`} defaultChecked />
                        <Label htmlFor={`section-${idx}`} className="text-sm">{section}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Additional Options</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="charts" defaultChecked />
                      <Label htmlFor="charts" className="text-sm">Include Charts & Visualizations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recommendations" defaultChecked />
                      <Label htmlFor="recommendations" className="text-sm">AI Recommendations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="raw-data" />
                      <Label htmlFor="raw-data" className="text-sm">Include Raw Data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="executive-summary" defaultChecked />
                      <Label htmlFor="executive-summary" className="text-sm">Executive Summary</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Estimated generation time: {selectedTemplateData.estimatedTime} minutes
                  </div>
                  <Button onClick={generateReport} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate Report'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <Card key={report.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{report.title}</span>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Created {formatTimeAgo(report.createdAt)}</span>
                          {report.fileSize && <span>{formatFileSize(report.fileSize)}</span>}
                          {report.metadata.dataPoints && <span>{report.metadata.dataPoints.toLocaleString()} data points</span>}
                          {report.metadata.insights && <span>{report.metadata.insights} insights</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'generating' && (
                        <div className="flex items-center gap-2">
                          <Progress value={report.progress} className="w-24 h-2" />
                          <span className="text-sm text-muted-foreground">{report.progress}%</span>
                        </div>
                      )}
                      {report.status === 'completed' && (
                        <>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {report.sections && report.sections.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {report.sections.map((section) => (
                          <div key={section.id} className="flex items-center gap-1 text-xs">
                            {getSectionStatusIcon(section.status)}
                            <span className={section.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}>
                              {section.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Automated Reports</CardTitle>
              <CardDescription>Set up recurring reports to be generated automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-template">Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipients">Email Recipients</Label>
                <Input placeholder="Enter email addresses separated by commas" />
              </div>
              
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No scheduled reports yet</p>
                <p className="text-sm">Create your first automated report above</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
