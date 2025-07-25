'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface TrackedWallet {
  address: string;
  label: string;
  balance: number;
  change24h: number;
  lastActivity: string;
  riskScore: number;
  type: 'whale' | 'dev' | 'user';
}

export default function WalletExplorerPage() {
  const [wallets, setWallets] = useState<TrackedWallet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockWallets: TrackedWallet[] = [
      {
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9',
        label: 'Whale #1',
        balance: 1250000,
        change24h: 5.2,
        lastActivity: '2 hours ago',
        riskScore: 25,
        type: 'whale'
      },
      {
        address: '0x8ba1f109551bD432803012645Hac136c22C85B',
        label: 'Dev Wallet',
        balance: 850000,
        change24h: -2.1,
        lastActivity: '1 day ago',
        riskScore: 75,
        type: 'dev'
      },
      {
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        label: 'DeFi Farmer',
        balance: 45000,
        change24h: 12.8,
        lastActivity: '30 minutes ago',
        riskScore: 15,
        type: 'user'
      }
    ];
    
    setTimeout(() => {
      setWallets(mockWallets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredWallets = wallets.filter(wallet => 
    wallet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallet.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskBadgeColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'whale': return 'bg-blue-500';
      case 'dev': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Explorer</h1>
          <p className="text-muted-foreground">Track and analyze wallet behaviors</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Wallet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Tracked Wallets</CardTitle>
          <CardDescription>
            Monitor whale movements, dev activities, and user behaviors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search wallets by address or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading wallets...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Balance (SEI)</TableHead>
                  <TableHead>24h Change</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWallets.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{wallet.label}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTypeBadgeColor(wallet.type)} text-white`}>
                        {wallet.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {wallet.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center ${
                        wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {wallet.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(wallet.change24h)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRiskBadgeColor(wallet.riskScore)} text-white`}>
                        {wallet.riskScore}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {wallet.lastActivity}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/wallets/${wallet.address}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
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