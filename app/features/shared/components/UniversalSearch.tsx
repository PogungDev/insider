"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, X, Clock, TrendingUp, Wallet, AlertTriangle, Brain, Target, Zap, Star } from "lucide-react"

interface SearchResult {
  id: string
  type: 'wallet' | 'transaction' | 'token' | 'alert' | 'signal' | 'pattern'
  title: string
  subtitle: string
  description: string
  relevance: number
  timestamp: number
  metadata: Record<string, any>
  category: string
  tags: string[]
}

interface UniversalSearchProps {
  onResultSelect?: (result: SearchResult) => void
  onFilterChange?: (filters: SearchFilters) => void
  placeholder?: string
  showFilters?: boolean
}

interface SearchFilters {
  type: string
  timeframe: string
  category: string
  riskLevel: string
  confidence: string
  tags: string[]
}

export function UniversalSearch({ 
  onResultSelect, 
  onFilterChange, 
  placeholder = "Search wallets, transactions, signals, patterns...",
  showFilters = true 
}: UniversalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    timeframe: 'all',
    category: 'all',
    riskLevel: 'all',
    confidence: 'all',
    tags: []
  })
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    "whale movements",
    "high risk wallets",
    "arbitrage opportunities",
    "DeFi yield farming",
    "smart money signals",
    "rug pull patterns",
    "cross-chain flows",
    "MEV opportunities"
  ])

  // Mock search results untuk demo
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'wallet',
      title: '0x742d35Cc6634C0532925a3b8D4C9db...8e9',
      subtitle: 'Whale Wallet - $45.2M Portfolio',
      description: 'High-activity whale wallet with consistent profitable trades. 87% success rate.',
      relevance: 95,
      timestamp: Date.now() - 3600000,
      metadata: { balance: 45200000, txCount: 1247, successRate: 87 },
      category: 'Smart Money',
      tags: ['whale', 'profitable', 'high-volume']
    },
    {
      id: '2',
      type: 'signal',
      title: 'SEI Ecosystem Breakout Signal',
      subtitle: 'Technical Analysis + On-chain Data',
      description: 'Strong accumulation pattern detected with 94% confidence. Expected return: +45.2%',
      relevance: 92,
      timestamp: Date.now() - 1800000,
      metadata: { confidence: 94, expectedReturn: 45.2, timeframe: '2-4 weeks' },
      category: 'Alpha Signal',
      tags: ['breakout', 'technical', 'high-confidence']
    },
    {
      id: '3',
      type: 'pattern',
      title: 'Cross-Chain Arbitrage Pattern',
      subtitle: 'ATOM Price Discrepancy',
      description: '8.5% price spread detected between Binance and Coinbase for ATOM token.',
      relevance: 89,
      timestamp: Date.now() - 900000,
      metadata: { spread: 8.5, exchanges: ['Binance', 'Coinbase'], token: 'ATOM' },
      category: 'Arbitrage',
      tags: ['arbitrage', 'cross-exchange', 'opportunity']
    },
    {
      id: '4',
      type: 'alert',
      title: 'Suspicious Activity Detected',
      subtitle: 'Potential Rug Pull Warning',
      description: 'Unusual token transfer patterns detected. Liquidity removal risk: HIGH',
      relevance: 87,
      timestamp: Date.now() - 600000,
      metadata: { riskLevel: 'HIGH', liquidityRisk: 85, suspiciousScore: 92 },
      category: 'Risk Alert',
      tags: ['suspicious', 'rug-pull', 'high-risk']
    },
    {
      id: '5',
      type: 'transaction',
      title: 'Large ETH Transfer',
      subtitle: '15,000 ETH moved to unknown wallet',
      description: 'Significant ETH transfer from known whale wallet to unidentified address.',
      relevance: 84,
      timestamp: Date.now() - 1200000,
      metadata: { amount: 15000, token: 'ETH', value: 45000000 },
      category: 'Large Transfer',
      tags: ['large-transfer', 'whale', 'unknown-destination']
    },
    {
      id: '6',
      type: 'token',
      title: 'PEPE Token Analysis',
      subtitle: 'Memecoin with unusual activity',
      description: 'PEPE showing 340% volume increase with smart money accumulation.',
      relevance: 81,
      timestamp: Date.now() - 2400000,
      metadata: { volumeIncrease: 340, marketCap: 1200000000, holders: 89000 },
      category: 'Token Analysis',
      tags: ['memecoin', 'volume-spike', 'accumulation']
    }
  ]

  useEffect(() => {
    if (query.length > 2) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        const filteredResults = mockResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                              result.description.toLowerCase().includes(query.toLowerCase()) ||
                              result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          
          const matchesType = filters.type === 'all' || result.type === filters.type
          const matchesCategory = filters.category === 'all' || result.category === filters.category
          
          return matchesQuery && matchesType && matchesCategory
        }).sort((a, b) => b.relevance - a.relevance)
        
        setResults(filteredResults)
        setIsSearching(false)
        setShowResults(true)
      }, 300)
      
      return () => clearTimeout(timer)
    } else {
      setResults([])
      setShowResults(false)
      setIsSearching(false)
    }
  }, [query, filters])

  useEffect(() => {
    onFilterChange?.(filters)
  }, [filters, onFilterChange])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)])
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result)
    setShowResults(false)
    setQuery(result.title)
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      timeframe: 'all',
      category: 'all',
      riskLevel: 'all',
      confidence: 'all',
      tags: []
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Wallet className="h-4 w-4 text-blue-500" />
      case 'transaction': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'token': return <Star className="h-4 w-4 text-yellow-500" />
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'signal': return <Target className="h-4 w-4 text-purple-500" />
      case 'pattern': return <Brain className="h-4 w-4 text-orange-500" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: number) => {
    const hours = Math.floor((Date.now() - timestamp) / 3600000)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 h-12 text-lg"
            onFocus={() => query.length > 2 && setShowResults(true)}
          />
          {isSearching && (
            <div className="absolute right-3 top-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
        
        {showFilters && (
          <Button 
            variant="outline" 
            onClick={() => setShowResults(!showResults)}
            className="h-12 px-4"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-14 left-0 right-0 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="mt-0">
                {showFilters && (
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="wallet">Wallets</SelectItem>
                          <SelectItem value="transaction">Transactions</SelectItem>
                          <SelectItem value="token">Tokens</SelectItem>
                          <SelectItem value="alert">Alerts</SelectItem>
                          <SelectItem value="signal">Signals</SelectItem>
                          <SelectItem value="pattern">Patterns</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.timeframe} onValueChange={(value) => setFilters(prev => ({ ...prev, timeframe: value }))}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24h</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="Smart Money">Smart Money</SelectItem>
                          <SelectItem value="Alpha Signal">Alpha Signal</SelectItem>
                          <SelectItem value="Arbitrage">Arbitrage</SelectItem>
                          <SelectItem value="Risk Alert">Risk Alert</SelectItem>
                          <SelectItem value="Large Transfer">Large Transfer</SelectItem>
                          <SelectItem value="Token Analysis">Token Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          {getTypeIcon(result.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{result.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {result.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {result.relevance}% match
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{result.subtitle}</p>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{result.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-1">
                                {result.tags.slice(0, 3).map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(result.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No results found for "{query}"</p>
                      <p className="text-xs mt-1">Try adjusting your search terms or filters</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-0">
                <div className="p-4">
                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium mb-3">Recent Searches</h4>
                      {recentSearches.map((search, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                          onClick={() => handleSearch(search)}
                        >
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent searches
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="popular" className="mt-0">
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-3">Popular Searches</h4>
                  <div className="space-y-2">
                    {popularSearches.map((search, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                        onClick={() => handleSearch(search)}
                      >
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{search}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}