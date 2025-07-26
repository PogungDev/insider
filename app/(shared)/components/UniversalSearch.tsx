'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Clock, TrendingUp, Wallet, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWallet } from '@/app/(core)/providers/WalletProvider'

interface SearchResult {
  id: string
  type: 'wallet' | 'transaction' | 'token' | 'contract'
  title: string
  subtitle: string
  value?: string
  timestamp?: string
  risk?: 'low' | 'medium' | 'high'
}

interface UniversalSearchProps {
  onResultSelect?: (result: SearchResult) => void
  placeholder?: string
  showFilters?: boolean
  maxResults?: number
}

export function UniversalSearch({
  onResultSelect,
  placeholder = "Search wallets, transactions, tokens...",
  showFilters = true,
  maxResults = 10
}: UniversalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const { connectedWallet } = useWallet()

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'wallet',
      title: '0x742d35Cc6634C0532925a3b8D4C9db4C4C9db4C4',
      subtitle: 'High-volume trader',
      value: '$2.4M',
      timestamp: '2 hours ago',
      risk: 'low'
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Large USDC Transfer',
      subtitle: '0x123...abc → 0x456...def',
      value: '$500K',
      timestamp: '5 minutes ago',
      risk: 'medium'
    },
    {
      id: '3',
      type: 'token',
      title: 'SEI Token',
      subtitle: 'Native token of Sei Network',
      value: '$0.42',
      timestamp: 'Live',
      risk: 'low'
    }
  ]

  useEffect(() => {
    if (query.length > 2) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filtered = mockResults.filter(result => {
          const matchesQuery = result.title.toLowerCase().includes(query.toLowerCase()) ||
                              result.subtitle.toLowerCase().includes(query.toLowerCase())
          const matchesType = selectedType === 'all' || result.type === selectedType
          return matchesQuery && matchesType
        })
        setResults(filtered.slice(0, maxResults))
        setIsLoading(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [query, selectedType, maxResults])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Wallet className="h-4 w-4" />
      case 'transaction': return <TrendingUp className="h-4 w-4" />
      case 'token': return <DollarSign className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Universal Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {showFilters && (
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="wallet">Wallets</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="token">Tokens</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onResultSelect?.(result)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {getTypeIcon(result.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {result.value && (
                    <span className="text-sm font-medium">{result.value}</span>
                  )}
                  {result.risk && (
                    <Badge className={getRiskColor(result.risk)} variant="outline">
                      {result.risk}
                    </Badge>
                  )}
                  {result.timestamp && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {result.timestamp}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length > 2 && results.length === 0 && !isLoading && (
          <div className="text-center py-4 text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </CardContent>
    </Card>
  )
}