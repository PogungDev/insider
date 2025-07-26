"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, TrendingUp, TrendingDown, AlertCircle, DollarSign, Activity, Filter } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'transaction' | 'interaction' | 'anomaly' | 'pattern';
  title: string;
  description: string;
  value?: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  metadata: {
    txHash?: string;
    contractAddress?: string;
    gasUsed?: number;
    confidence?: number;
  };
}

interface WalletActivity {
  date: string;
  transactions: number;
  volume: number;
  gasSpent: number;
  uniqueContracts: number;
}

const AnnotatedTimeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [activities, setActivities] = useState<WalletActivity[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTimelineData();
  }, [selectedTimeframe, selectedCategory]);

  const loadTimelineData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockEvents: TimelineEvent[] = [
        {
          id: 'evt-1',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          type: 'anomaly',
          title: 'Unusual Transaction Pattern Detected',
          description: 'Large volume transaction outside normal behavior pattern',
          value: 125000,
          impact: 'high',
          category: 'Risk Alert',
          metadata: {
            txHash: '0x1234...5678',
            confidence: 94
          }
        },
        {
          id: 'evt-2',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          type: 'interaction',
          title: 'DeFi Protocol Interaction',
          description: 'Provided liquidity to SEI/USDC pool on DragonSwap',
          value: 45000,
          impact: 'medium',
          category: 'DeFi Activity',
          metadata: {
            txHash: '0xabcd...efgh',
            contractAddress: '0x9876...5432',
            gasUsed: 180000
          }
        },
        {
          id: 'evt-3',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          type: 'transaction',
          title: 'Large Token Transfer',
          description: 'Transferred 50,000 SEI tokens to external wallet',
          value: 75000,
          impact: 'medium',
          category: 'Token Transfer',
          metadata: {
            txHash: '0x2468...1357',
            gasUsed: 21000
          }
        },
        {
          id: 'evt-4',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          type: 'pattern',
          title: 'Accumulation Pattern Identified',
          description: 'Consistent small purchases over the past week',
          impact: 'low',
          category: 'Behavior Pattern',
          metadata: {
            confidence: 87
          }
        },
        {
          id: 'evt-5',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          type: 'interaction',
          title: 'NFT Marketplace Activity',
          description: 'Purchased rare NFT collection item',
          value: 12500,
          impact: 'low',
          category: 'NFT Activity',
          metadata: {
            txHash: '0x3691...2580',
            contractAddress: '0x1472...5836',
            gasUsed: 95000
          }
        },
        {
          id: 'evt-6',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          type: 'anomaly',
          title: 'Suspicious Gas Usage Pattern',
          description: 'Unusually high gas fees for simple transactions',
          impact: 'medium',
          category: 'Risk Alert',
          metadata: {
            confidence: 76
          }
        }
      ];

      const mockActivities: WalletActivity[] = [
        { date: '2024-01-15', transactions: 23, volume: 125000, gasSpent: 0.45, uniqueContracts: 8 },
        { date: '2024-01-14', transactions: 15, volume: 87500, gasSpent: 0.32, uniqueContracts: 5 },
        { date: '2024-01-13', transactions: 31, volume: 156000, gasSpent: 0.67, uniqueContracts: 12 },
        { date: '2024-01-12', transactions: 8, volume: 34000, gasSpent: 0.18, uniqueContracts: 3 },
        { date: '2024-01-11', transactions: 19, volume: 98000, gasSpent: 0.41, uniqueContracts: 7 },
        { date: '2024-01-10', transactions: 27, volume: 134000, gasSpent: 0.58, uniqueContracts: 9 },
        { date: '2024-01-09', transactions: 12, volume: 56000, gasSpent: 0.25, uniqueContracts: 4 }
      ];

      setEvents(mockEvents);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'transaction': return <DollarSign className="h-4 w-4" />;
      case 'interaction': return <Activity className="h-4 w-4" />;
      case 'anomaly': return <AlertCircle className="h-4 w-4" />;
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string, impact: string) => {
    if (type === 'anomaly') return 'border-red-200 bg-red-50';
    if (impact === 'high') return 'border-orange-200 bg-orange-50';
    if (impact === 'medium') return 'border-blue-200 bg-blue-50';
    return 'border-green-200 bg-green-50';
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const filteredEvents = events.filter(event => {
    if (selectedCategory === 'all') return true;
    return event.category === selectedCategory;
  });

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Annotated Timeline</h2>
          <p className="text-muted-foreground">
            Comprehensive chronological analysis of wallet activities with AI-powered annotations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadTimelineData} disabled={isLoading}>
            <Filter className="h-4 w-4 mr-2" />
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
          <TabsTrigger value="activity">Activity Summary</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline">
                  {filteredEvents.length} events
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < filteredEvents.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                )}
                
                <Card className={`ml-12 ${getEventColor(event.type, event.impact)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                            <Badge className={getImpactBadge(event.impact)}>
                              {event.impact.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(event.timestamp)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {event.value && (
                        <div className="text-right">
                          <div className="text-lg font-bold">${event.value.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Transaction Value</div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    
                    {/* Metadata */}
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-xs">
                      {event.metadata.txHash && (
                        <div>
                          <span className="font-medium">Tx Hash:</span>
                          <div className="font-mono text-muted-foreground">{event.metadata.txHash}</div>
                        </div>
                      )}
                      {event.metadata.contractAddress && (
                        <div>
                          <span className="font-medium">Contract:</span>
                          <div className="font-mono text-muted-foreground">{event.metadata.contractAddress}</div>
                        </div>
                      )}
                      {event.metadata.gasUsed && (
                        <div>
                          <span className="font-medium">Gas Used:</span>
                          <div className="text-muted-foreground">{event.metadata.gasUsed.toLocaleString()}</div>
                        </div>
                      )}
                      {event.metadata.confidence && (
                        <div>
                          <span className="font-medium">Confidence:</span>
                          <div className="text-muted-foreground">{event.metadata.confidence}%</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activities.reduce((sum, a) => sum + a.transactions, 0)}</div>
                <div className="text-xs text-muted-foreground">Last 7 days</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${activities.reduce((sum, a) => sum + a.volume, 0).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">USD equivalent</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Gas Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activities.reduce((sum, a) => sum + a.gasSpent, 0).toFixed(2)} SEI</div>
                <div className="text-xs text-muted-foreground">Total fees</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unique Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.max(...activities.map(a => a.uniqueContracts))}</div>
                <div className="text-xs text-muted-foreground">Peak daily interactions</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Breakdown</CardTitle>
              <CardDescription>Detailed view of wallet activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{activity.date}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.transactions} transactions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${activity.volume.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.gasSpent.toFixed(3)} SEI gas
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Behavioral Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-medium text-blue-900">Activity Pattern</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Wallet shows consistent DeFi engagement with peak activity during US market hours.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-900">Risk Profile</p>
                    <p className="text-sm text-green-700 mt-1">
                      Low-risk profile with diversified protocol interactions and conservative position sizing.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-900">Strategy Analysis</p>
                    <p className="text-sm text-purple-700 mt-1">
                      Appears to follow a yield farming strategy with regular liquidity provision and harvesting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-medium text-red-900">High-Value Transaction</p>
                    <p className="text-sm text-red-700 mt-1">
                      Recent $125K transaction is 3.2x larger than typical transaction size.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-900">Gas Usage Spike</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Gas fees 40% higher than usual, possibly indicating complex contract interactions.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-medium text-orange-900">New Protocol Interaction</p>
                    <p className="text-sm text-orange-700 mt-1">
                      First-time interaction with new DeFi protocol detected in recent activity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnotatedTimeline;