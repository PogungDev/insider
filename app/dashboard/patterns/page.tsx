'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Activity, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  transactions: number;
  avgAmount: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface TimePattern {
  hour: number;
  volume: number;
  transactions: number;
}

export default function PatternsPage() {
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern[]>([]);
  const [timePatterns, setTimePatterns] = useState<TimePattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('7d');
  const [walletType, setWalletType] = useState('all');

  useEffect(() => {
    fetchPatterns();
  }, [timeframe, walletType]);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockSpendingPatterns: SpendingPattern[] = [
        {
          category: 'DeFi Trading',
          amount: 2450000,
          percentage: 35.2,
          transactions: 1247,
          avgAmount: 1965,
          trend: 'up',
          color: '#3B82F6'
        },
        {
          category: 'NFT Purchases',
          amount: 1890000,
          percentage: 27.1,
          transactions: 89,
          avgAmount: 21235,
          trend: 'down',
          color: '#8B5CF6'
        },
        {
          category: 'Token Swaps',
          amount: 1234000,
          percentage: 17.7,
          transactions: 2341,
          avgAmount: 527,
          trend: 'up',
          color: '#10B981'
        },
        {
          category: 'Staking/Yield',
          amount: 890000,
          percentage: 12.8,
          transactions: 156,
          avgAmount: 5705,
          trend: 'stable',
          color: '#F59E0B'
        },
        {
          category: 'Bridge Transfers',
          amount: 456000,
          percentage: 6.5,
          transactions: 78,
          avgAmount: 5846,
          trend: 'up',
          color: '#EF4444'
        },
        {
          category: 'Other',
          amount: 80000,
          percentage: 0.7,
          transactions: 234,
          avgAmount: 342,
          trend: 'stable',
          color: '#6B7280'
        }
      ];

      const mockTimePatterns: TimePattern[] = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        volume: Math.random() * 1000000 + 100000,
        transactions: Math.floor(Math.random() * 500) + 50
      }));

      setSpendingPatterns(mockSpendingPatterns);
      setTimePatterns(mockTimePatterns);
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMaxVolume = () => Math.max(...timePatterns.map(p => p.volume));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
            Spending Patterns
          </h1>
          <p className="text-muted-foreground">Analyze transaction patterns and spending behaviors</p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={walletType} onValueChange={setWalletType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Wallet Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wallets</SelectItem>
              <SelectItem value="whale">Whales</SelectItem>
              <SelectItem value="dev">Developers</SelectItem>
              <SelectItem value="user">Regular Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Spending Categories</TabsTrigger>
          <TabsTrigger value="heatmap">Activity Heatmap</TabsTrigger>
          <TabsTrigger value="vendors">Top Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading spending patterns...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Categories Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Distribution of transaction volume across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: pattern.color }}
                          />
                          <div>
                            <div className="font-medium">{pattern.category}</div>
                            <div className="text-sm text-muted-foreground">
                              {pattern.transactions} transactions
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(pattern.amount)}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            {pattern.percentage}% {getTrendIcon(pattern.trend)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Analysis</CardTitle>
                  <CardDescription>Detailed breakdown of spending patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {spendingPatterns.slice(0, 4).map((pattern, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{pattern.category}</h4>
                          <Badge variant={pattern.trend === 'up' ? 'default' : pattern.trend === 'down' ? 'destructive' : 'secondary'}>
                            {pattern.trend}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Volume:</span>
                            <div className="font-semibold">{formatCurrency(pattern.amount)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg per Tx:</span>
                            <div className="font-semibold">{formatCurrency(pattern.avgAmount)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Activity Heatmap</CardTitle>
              <CardDescription>Transaction volume and frequency by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-1">
                  {timePatterns.map((pattern, index) => {
                    const intensity = pattern.volume / getMaxVolume();
                    return (
                      <div
                        key={index}
                        className="aspect-square rounded border flex items-center justify-center text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                          color: intensity > 0.5 ? 'white' : 'black'
                        }}
                        title={`${pattern.hour}:00 - ${formatCurrency(pattern.volume)} (${pattern.transactions} txs)`}
                      >
                        {pattern.hour}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>00:00</span>
                  <span>Peak Activity Hours</span>
                  <span>23:00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendors & Protocols</CardTitle>
              <CardDescription>Most frequently used DeFi protocols and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Vendor analysis coming soon...</p>
                <p className="text-sm">This will show top DeFi protocols, DEXs, and services by usage</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pattern Analysis Tools</CardTitle>
          <CardDescription>Advanced pattern recognition and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dashboard/patterns/heatmap">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Advanced Heatmap</span>
              </Button>
            </Link>
            <Link href="/dashboard/patterns/vendors">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Activity className="h-6 w-6 mb-2" />
                <span>Vendor Analysis</span>
              </Button>
            </Link>
            <Link href="/dashboard/patterns/category">
              <Button variant="outline" className="w-full h-20 flex flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Category Deep Dive</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}