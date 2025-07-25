'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Eye, Activity, DollarSign, AlertTriangle, Waves } from 'lucide-react';
import Link from 'next/link';

interface WhaleWallet {
  address: string;
  label?: string;
  balance: number;
  balanceUSD: number;
  change24h: number;
  change7d: number;
  lastActivity: string;
  riskScore: number;
  transactionVolume24h: number;
  classification: 'mega_whale' | 'whale' | 'large_holder';
}

export default function WhaleWatchPage() {
  const [whales, setWhales] = useState<WhaleWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('balance');
  const [classification, setClassification] = useState('all');
  const [summary, setSummary] = useState({
    totalWhales: 0,
    totalValueUSD: 0,
    totalVolume24h: 0,
    averageRiskScore: 0
  });

  useEffect(() => {
    fetchWhales();
  }, [sortBy, classification]);

  const fetchWhales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        sortBy,
        limit: '20',
        ...(classification !== 'all' && { classification })
      });
      
      const response = await fetch(`/api/whales/top?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setWhales(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch whales:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'mega_whale': return 'bg-red-500';
      case 'whale': return 'bg-blue-500';
      case 'large_holder': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Waves className="mr-3 h-8 w-8 text-blue-600" />
            Whale Watch
          </h1>
          <p className="text-muted-foreground">Monitor large holders and their market impact</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Whales</p>
                <p className="text-2xl font-bold">{summary.totalWhales}</p>
              </div>
              <Waves className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalValueUSD)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalVolume24h)}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold">{summary.averageRiskScore}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Top Whales</CardTitle>
              <CardDescription>Large holders ranked by various metrics</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={classification} onValueChange={setClassification}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mega_whale">Mega Whales</SelectItem>
                  <SelectItem value="whale">Whales</SelectItem>
                  <SelectItem value="large_holder">Large Holders</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Balance</SelectItem>
                  <SelectItem value="change24h">24h Change</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="risk">Risk Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading whale data...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Whale</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Balance (USD)</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead>24h Volume</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whales.map((whale) => (
                  <TableRow key={whale.address}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {whale.label || 'Unknown Whale'}
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {whale.address.slice(0, 6)}...{whale.address.slice(-4)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getClassificationColor(whale.classification)} text-white`}>
                        {whale.classification.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      <div>
                        <div className="font-semibold">{formatCurrency(whale.balanceUSD)}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatNumber(whale.balance)} SEI
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${
                        whale.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {whale.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(whale.change24h).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(whale.transactionVolume24h)}
                    </TableCell>
                    <TableCell>
                      <span className={getRiskColor(whale.riskScore)}>
                        {whale.riskScore}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {whale.lastActivity}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/wallets/${whale.address}`}>
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