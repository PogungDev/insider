'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Shield, Eye, Search, TrendingDown, Lock, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface DevWallet {
  address: string;
  projectName?: string;
  tokenSymbol?: string;
  totalSupply: number;
  devHolding: number;
  devPercentage: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: string;
  flags: string[];
  marketCap?: number;
  liquidityLocked: boolean;
  contractVerified: boolean;
}

export default function DevScreenerPage() {
  const [devWallets, setDevWallets] = useState<DevWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState('all');
  const [sortBy, setSortBy] = useState('riskScore');
  const [verified, setVerified] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState({
    totalProjects: 0,
    riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
    averageDevPercentage: 0,
    verifiedContracts: 0,
    lockedLiquidity: 0
  });

  useEffect(() => {
    fetchDevWallets();
  }, [riskLevel, sortBy, verified]);

  const fetchDevWallets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        limit: '20',
        ...(riskLevel !== 'all' && { riskLevel }),
        ...(verified !== 'all' && { verified })
      });
      
      const response = await fetch(`/api/screener/dev?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setDevWallets(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch dev wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 50) return 'text-yellow-600';
    if (score < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const filteredWallets = devWallets.filter(wallet => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      wallet.address.toLowerCase().includes(query) ||
      wallet.projectName?.toLowerCase().includes(query) ||
      wallet.tokenSymbol?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="mr-3 h-8 w-8 text-red-600" />
            Dev Wallet Screener
          </h1>
          <p className="text-muted-foreground">Detect potential rugpulls and risky developer behaviors</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{summary.totalProjects}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Risk</p>
                <p className="text-2xl font-bold text-red-600">{summary.riskDistribution.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Dev %</p>
                <p className="text-2xl font-bold">{summary.averageDevPercentage}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{summary.verifiedContracts}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locked Liq</p>
                <p className="text-2xl font-bold">{summary.lockedLiquidity}</p>
              </div>
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Developer Risk Analysis</CardTitle>
              <CardDescription>Identify potentially risky projects and developer behaviors</CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48"
                />
              </div>
              
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={verified} onValueChange={setVerified}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Verified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="true">Verified</SelectItem>
                  <SelectItem value="false">Unverified</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riskScore">Risk Score</SelectItem>
                  <SelectItem value="devPercentage">Dev %</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Analyzing developer wallets...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Dev Holdings</TableHead>
                  <TableHead>Market Cap</TableHead>
                  <TableHead>Security</TableHead>
                  <TableHead>Key Flags</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {wallet.projectName || 'Unknown Project'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {wallet.tokenSymbol && `$${wallet.tokenSymbol} • `}
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRiskLevelColor(wallet.riskLevel)} text-white`}>
                        {wallet.riskLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${getRiskScoreColor(wallet.riskScore)}`}>
                        {wallet.riskScore}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{wallet.devPercentage}%</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(wallet.devHolding)} tokens
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {wallet.marketCap ? formatCurrency(wallet.marketCap) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {wallet.contractVerified ? (
                          <Shield className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        {wallet.liquidityLocked ? (
                          <Lock className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48">
                        {wallet.flags.slice(0, 2).map((flag, index) => (
                          <div key={index} className="text-xs text-muted-foreground truncate">
                            {flag}
                          </div>
                        ))}
                        {wallet.flags.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{wallet.flags.length - 2} more</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/wallets/${wallet.address}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      </Link>
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