'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Download, Eye, Trash2, Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'wallet_analysis' | 'market_overview' | 'risk_assessment' | 'unlock_calendar' | 'whale_activity' | 'custom';
  status: 'pending' | 'generating' | 'completed' | 'failed' | 'scheduled';
  format: 'pdf' | 'html' | 'json' | 'csv';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  completedAt?: string;
  fileSize?: number;
  downloadUrl?: string;
  recipients: string[];
  generatedBy: string;
  executionTime?: number;
  errorMessage?: string;
  nextScheduled?: string;
  downloadCount: number;
  lastDownloaded?: string;
}

export default function ReportsHistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [summary, setSummary] = useState({
    totalReports: 0,
    completedReports: 0,
    pendingReports: 0,
    failedReports: 0,
    totalDownloads: 0,
    avgExecutionTime: 0,
    statusBreakdown: {} as Record<string, number>,
    typeBreakdown: {} as Record<string, number>
  });

  useEffect(() => {
    fetchReports();
  }, [selectedStatus, selectedType, selectedFormat, sortBy, sortOrder]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedFormat !== 'all') params.append('format', selectedFormat);
      if (searchTerm) params.append('search', searchTerm);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/reports/history?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Refresh reports to update download count
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const retryReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/retry`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to retry report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'generating': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'scheduled': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'generating': return <Clock className="h-4 w-4 animate-spin" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'wallet_analysis': return 'Wallet Analysis';
      case 'market_overview': return 'Market Overview';
      case 'risk_assessment': return 'Risk Assessment';
      case 'unlock_calendar': return 'Unlock Calendar';
      case 'whale_activity': return 'Whale Activity';
      case 'custom': return 'Custom Report';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatExecutionTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-blue-600" />
            Reports History
          </h1>
          <p className="text-muted-foreground">View and manage your generated reports</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/reports/new">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{summary.totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summary.completedReports}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pendingReports}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{summary.failedReports}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold">{summary.totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold">{formatExecutionTime(summary.avgExecutionTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Report History</CardTitle>
              <CardDescription>Manage and download your generated reports</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="generating">Generating</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wallet_analysis">Wallet Analysis</SelectItem>
                  <SelectItem value="market_overview">Market Overview</SelectItem>
                  <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                  <SelectItem value="unlock_calendar">Unlock Calendar</SelectItem>
                  <SelectItem value="whale_activity">Whale Activity</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading reports...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-muted-foreground">{report.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(report.status)} text-white`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(report.status)}
                            <span>{report.status.toUpperCase()}</span>
                          </div>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(report.createdAt)}</div>
                        {report.completedAt && (
                          <div className="text-sm text-muted-foreground">
                            Completed: {formatDate(report.completedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatFileSize(report.fileSize)}</div>
                        {report.executionTime && (
                          <div className="text-sm text-muted-foreground">
                            {formatExecutionTime(report.executionTime)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.downloadCount}</div>
                        {report.lastDownloaded && (
                          <div className="text-sm text-muted-foreground">
                            Last: {formatDate(report.lastDownloaded)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedReport?.title}</DialogTitle>
                              <DialogDescription>{selectedReport?.description}</DialogDescription>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Report Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span>Type:</span>
                                        <span>{getTypeLabel(selectedReport.type)}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Format:</span>
                                        <span>{selectedReport.format.toUpperCase()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Frequency:</span>
                                        <span>{selectedReport.frequency}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Generated by:</span>
                                        <span>{selectedReport.generatedBy}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Recipients</h4>
                                    <div className="space-y-1">
                                      {selectedReport.recipients.map((recipient, index) => (
                                        <div key={index} className="text-sm text-muted-foreground">
                                          {recipient}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {selectedReport.errorMessage && (
                                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                                    <h4 className="font-semibold text-red-800 mb-1">Error Message</h4>
                                    <p className="text-sm text-red-600">{selectedReport.errorMessage}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {report.status === 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => downloadReport(report.id)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {report.status === 'failed' && (
                          <Button variant="outline" size="sm" onClick={() => retryReport(report.id)}>
                            Retry
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm" onClick={() => deleteReport(report.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}