'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Calendar as CalendarIcon, Clock, Users, TrendingUp, AlertTriangle, Download, Send, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportConfig {
  title: string;
  description: string;
  type: 'wallet_analysis' | 'market_overview' | 'risk_assessment' | 'unlock_calendar' | 'whale_activity' | 'custom';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'html' | 'json' | 'csv';
  recipients: string[];
  scheduledDate?: Date;
  includeCharts: boolean;
  includeRawData: boolean;
  sections: {
    summary: boolean;
    walletAnalysis: boolean;
    marketData: boolean;
    riskMetrics: boolean;
    unlockEvents: boolean;
    whaleActivity: boolean;
    anomalies: boolean;
    recommendations: boolean;
  };
  filters: {
    walletAddresses: string[];
    timeRange: string;
    minTransactionValue: number;
    riskLevels: string[];
    categories: string[];
  };
}

export default function NewReportPage() {
  const [config, setConfig] = useState<ReportConfig>({
    title: '',
    description: '',
    type: 'wallet_analysis',
    frequency: 'once',
    format: 'pdf',
    recipients: [''],
    includeCharts: true,
    includeRawData: false,
    sections: {
      summary: true,
      walletAnalysis: true,
      marketData: false,
      riskMetrics: true,
      unlockEvents: false,
      whaleActivity: false,
      anomalies: false,
      recommendations: true
    },
    filters: {
      walletAddresses: [''],
      timeRange: '30d',
      minTransactionValue: 1000,
      riskLevels: ['medium', 'high', 'critical'],
      categories: ['whale', 'dev']
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const reportTypes = [
    { value: 'wallet_analysis', label: 'Wallet Analysis', description: 'Detailed analysis of specific wallets' },
    { value: 'market_overview', label: 'Market Overview', description: 'General market trends and insights' },
    { value: 'risk_assessment', label: 'Risk Assessment', description: 'Risk analysis and threat detection' },
    { value: 'unlock_calendar', label: 'Unlock Calendar', description: 'Upcoming token unlock events' },
    { value: 'whale_activity', label: 'Whale Activity', description: 'Large wallet movements and patterns' },
    { value: 'custom', label: 'Custom Report', description: 'Build your own custom report' }
  ];

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      if (data.success) {
        // Handle successful report generation
        console.log('Report generated:', data.reportId);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviewReport = async () => {
    try {
      const response = await fetch('/api/reports/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      if (data.success) {
        setPreviewData(data.preview);
      }
    } catch (error) {
      console.error('Failed to preview report:', error);
    }
  };

  const addRecipient = () => {
    setConfig({
      ...config,
      recipients: [...config.recipients, '']
    });
  };

  const removeRecipient = (index: number) => {
    setConfig({
      ...config,
      recipients: config.recipients.filter((_, i) => i !== index)
    });
  };

  const updateRecipient = (index: number, value: string) => {
    const newRecipients = [...config.recipients];
    newRecipients[index] = value;
    setConfig({ ...config, recipients: newRecipients });
  };

  const addWalletAddress = () => {
    setConfig({
      ...config,
      filters: {
        ...config.filters,
        walletAddresses: [...config.filters.walletAddresses, '']
      }
    });
  };

  const removeWalletAddress = (index: number) => {
    setConfig({
      ...config,
      filters: {
        ...config.filters,
        walletAddresses: config.filters.walletAddresses.filter((_, i) => i !== index)
      }
    });
  };

  const updateWalletAddress = (index: number, value: string) => {
    const newAddresses = [...config.filters.walletAddresses];
    newAddresses[index] = value;
    setConfig({
      ...config,
      filters: { ...config.filters, walletAddresses: newAddresses }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-blue-600" />
            Create New Report
          </h1>
          <p className="text-muted-foreground">Generate custom reports and analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreviewReport}>
            <Download className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                  <CardDescription>Basic information about your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Report Title</Label>
                    <Input
                      id="title"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      placeholder="Enter report title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      placeholder="Describe the purpose of this report"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Report Type</Label>
                      <Select value={config.type} onValueChange={(value: ReportConfig['type']) => setConfig({ ...config, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <Select value={config.format} onValueChange={(value: ReportConfig['format']) => setConfig({ ...config, format: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="html">HTML Page</SelectItem>
                          <SelectItem value="json">JSON Data</SelectItem>
                          <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={config.frequency} onValueChange={(value: ReportConfig['frequency']) => setConfig({ ...config, frequency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One-time Report</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Sections</CardTitle>
                  <CardDescription>Choose what to include in your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(config.sections).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => 
                            setConfig({
                              ...config,
                              sections: { ...config.sections, [key]: checked as boolean }
                            })
                          }
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeCharts">Include Charts</Label>
                      <Switch
                        id="includeCharts"
                        checked={config.includeCharts}
                        onCheckedChange={(checked) => setConfig({ ...config, includeCharts: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeRawData">Include Raw Data</Label>
                      <Switch
                        id="includeRawData"
                        checked={config.includeRawData}
                        onCheckedChange={(checked) => setConfig({ ...config, includeRawData: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="filters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Filters</CardTitle>
                  <CardDescription>Configure what data to include</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wallet Addresses</Label>
                    {config.filters.walletAddresses.map((address, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={address}
                          onChange={(e) => updateWalletAddress(index, e.target.value)}
                          placeholder="Enter wallet address"
                        />
                        {config.filters.walletAddresses.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeWalletAddress(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addWalletAddress}>
                      Add Wallet
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time Range</Label>
                      <Select 
                        value={config.filters.timeRange} 
                        onValueChange={(value) => setConfig({
                          ...config,
                          filters: { ...config.filters, timeRange: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Min Transaction Value (USD)</Label>
                      <Input
                        type="number"
                        value={config.filters.minTransactionValue}
                        onChange={(e) => setConfig({
                          ...config,
                          filters: { ...config.filters, minTransactionValue: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delivery" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>Configure how and when to deliver the report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    {config.recipients.map((recipient, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          type="email"
                          value={recipient}
                          onChange={(e) => updateRecipient(index, e.target.value)}
                          placeholder="Enter email address"
                        />
                        {config.recipients.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeRecipient(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addRecipient}>
                      Add Recipient
                    </Button>
                  </div>
                  
                  {config.frequency !== 'once' && (
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !config.scheduledDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {config.scheduledDate ? format(config.scheduledDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={config.scheduledDate}
                            onSelect={(date) => setConfig({ ...config, scheduledDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview of your report configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <Badge variant="outline">
                    {reportTypes.find(t => t.value === config.type)?.label}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Format:</span>
                  <Badge variant="outline">{config.format.toUpperCase()}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Frequency:</span>
                  <Badge variant="outline">{config.frequency}</Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Recipients:</span>
                  <Badge variant="outline">{config.recipients.filter(r => r).length}</Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Included Sections:</h4>
                <div className="space-y-1">
                  {Object.entries(config.sections)
                    .filter(([_, included]) => included)
                    .map(([section, _]) => (
                      <div key={section} className="text-sm text-muted-foreground">
                        • {section.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Load Template
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}