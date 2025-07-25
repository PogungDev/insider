'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, TrendingDown, TrendingUp, AlertTriangle, Search, Filter, Download, Eye } from 'lucide-react';
import Link from 'next/link';

interface UnlockEvent {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  unlockDate: string;
  unlockAmount: number;
  unlockAmountUsd: number;
  totalSupply: number;
  percentageOfSupply: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  category: 'team' | 'investor' | 'advisor' | 'ecosystem' | 'public' | 'treasury';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number;
  daysUntilUnlock: number;
  vestingSchedule: {
    totalVested: number;
    remainingVested: number;
    nextUnlockDate?: string;
    nextUnlockAmount?: number;
  };
  historicalImpact?: {
    avgPriceDropAfterUnlock: number;
    recoveryTimeInDays: number;
  };
}

export default function UnlockScreenerPage() {
  const [unlocks, setUnlocks] = useState<UnlockEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('unlockDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [summary, setSummary] = useState({
    totalUnlocks: 0,
    totalValueUsd: 0,
    highRiskUnlocks: 0,
    avgImpactScore: 0,
    upcomingIn24h: 0,
    upcomingIn7d: 0,
    categoryBreakdown: {} as Record<string, number>,
    riskBreakdown: {} as Record<string, number>
  });

  useEffect(() => {
    fetchUnlocks();
  }, [selectedTimeframe, selectedCategory, selectedRisk, sortBy, sortOrder]);

  const fetchUnlocks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedTimeframe !== 'all') params.append('timeframe', selectedTimeframe);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedRisk !== 'all') params.append('risk', selectedRisk);
      if (searchTerm) params.append('search', searchTerm);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/unlocks/screener?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setUnlocks(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch unlocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'team': return 'bg-purple-500';
      case 'investor': return 'bg-blue-500';
      case 'advisor': return 'bg-indigo-500';
      case 'ecosystem': return 'bg-green-500';
      case 'public': return 'bg-gray-500';
      case 'treasury': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatTokenAmount = (amount: number) => {
    if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `${(amount / 1e3).toFixed(2)}K`;
    return amount.toLocaleString();
  };

  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredUnlocks = unlocks.filter(unlock => 
    unlock.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unlock.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Calendar className="mr-3 h-8 w-8 text-blue-600" />
            Unlock Screener
          </h1>
          <p className="text-muted-foreground">Monitor upcoming token unlocks and their potential market impact</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Unlocks</p>
                <p className="text-2xl font-bold">{summary.totalUnlocks}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatNumber(summary.totalValueUsd)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">{summary.highRiskUnlocks}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Impact</p>
                <p className="text-2xl font-bold">{summary.avgImpactScore.toFixed(1)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next 24h</p>
                <p className="text-2xl font-bold">{summary.upcomingIn24h}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next 7d</p>
                <p className="text-2xl font-bold">{summary.upcomingIn7d}</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Unlock Events</CardTitle>
          <CardDescription>Track and analyze upcoming token unlock events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="24h">Next 24h</SelectItem>
                <SelectItem value="7d">Next 7 days</SelectItem>
                <SelectItem value="30d">Next 30 days</SelectItem>
                <SelectItem value="90d">Next 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
                <SelectItem value="ecosystem">Ecosystem</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="treasury">Treasury</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="critical">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlockDate">Unlock Date</SelectItem>
                <SelectItem value="unlockAmountUsd">Unlock Value</SelectItem>
                <SelectItem value="impactScore">Impact Score</SelectItem>
                <SelectItem value="percentageOfSupply">% of Supply</SelectItem>
                <SelectItem value="marketCap">Market Cap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading unlock events...</p>
            </div>
          ) : (
            <Tabs defaultValue="table" className="space-y-4">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Unlock Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>% of Supply</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Impact Score</TableHead>
                      <TableHead>Price Change</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnlocks.map((unlock) => (
                      <TableRow key={unlock.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{unlock.tokenName}</div>
                            <div className="text-sm text-muted-foreground">{unlock.tokenSymbol}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatDate(unlock.unlockDate)}</div>
                            <div className="text-sm text-muted-foreground">
                              {unlock.daysUntilUnlock > 0 ? `${unlock.daysUntilUnlock} days` : 'Today'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatTokenAmount(unlock.unlockAmount)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatNumber(unlock.unlockAmountUsd)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{unlock.percentageOfSupply.toFixed(2)}%</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getCategoryColor(unlock.category)} text-white`}>
                            {unlock.category.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRiskColor(unlock.riskLevel)} text-white`}>
                            {unlock.riskLevel.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`font-semibold ${getImpactScoreColor(unlock.impactScore)}`}>
                            {unlock.impactScore}/100
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center ${unlock.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {unlock.priceChange24h >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(unlock.priceChange24h).toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Link href={`/dashboard/wallets/${unlock.tokenAddress}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Timeline view showing unlock events chronologically</p>
                  <div className="grid gap-4">
                    {filteredUnlocks.slice(0, 10).map((unlock) => (
                      <Card key={unlock.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{unlock.tokenName} ({unlock.tokenSymbol})</h3>
                              <Badge className={`${getRiskColor(unlock.riskLevel)} text-white`}>
                                {unlock.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatTokenAmount(unlock.unlockAmount)} tokens ({formatNumber(unlock.unlockAmountUsd)})
                            </p>
                            <p className="text-sm">
                              {unlock.percentageOfSupply.toFixed(2)}% of total supply • Impact Score: {unlock.impactScore}/100
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatDate(unlock.unlockDate)}</p>
                            <p className="text-sm text-muted-foreground">
                              {unlock.daysUntilUnlock > 0 ? `${unlock.daysUntilUnlock} days` : 'Today'}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="impact">
                <div className="space-y-4">
                  <p className="text-muted-foreground">Historical impact analysis of token unlocks</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUnlocks.filter(u => u.historicalImpact).slice(0, 6).map((unlock) => (
                      <Card key={unlock.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{unlock.tokenName}</h3>
                              <p className="text-sm text-muted-foreground">{formatDate(unlock.unlockDate)}</p>
                            </div>
                            <Badge className={`${getRiskColor(unlock.riskLevel)} text-white`}>
                              {unlock.riskLevel}
                            </Badge>
                          </div>
                          
                          {unlock.historicalImpact && (
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Avg Price Drop:</span>
                                <span className="text-sm font-semibold text-red-600">
                                  -{unlock.historicalImpact.avgPriceDropAfterUnlock.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Recovery Time:</span>
                                <span className="text-sm font-semibold">
                                  {unlock.historicalImpact.recoveryTimeInDays} days
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Impact Score:</span>
                                <span className={`text-sm font-semibold ${getImpactScoreColor(unlock.impactScore)}`}>
                                  {unlock.impactScore}/100
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}