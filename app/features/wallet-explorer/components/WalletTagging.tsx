"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tag, Plus, X, Search, Filter, Star, Shield, AlertTriangle, TrendingUp, Users, Bot } from "lucide-react"

interface WalletTag {
  id: string
  address: string
  tags: string[]
  category: 'whale' | 'dev' | 'exchange' | 'defi' | 'nft' | 'suspicious' | 'vip'
  riskScore: number
  lastActivity: string
  balance: string
  notes: string
  confidence: number
}

const mockTaggedWallets: WalletTag[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4C9db4C2b8b5C2f',
    tags: ['Whale', 'DeFi Power User', 'Yield Farmer'],
    category: 'whale',
    riskScore: 15,
    lastActivity: '2 hours ago',
    balance: '$2.4M',
    notes: 'Consistent large volume trades, sophisticated DeFi strategies',
    confidence: 95
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c22C2C2f',
    tags: ['Dev Wallet', 'Project Founder', 'Token Creator'],
    category: 'dev',
    riskScore: 75,
    lastActivity: '1 day ago',
    balance: '$890K',
    notes: 'Deployed multiple contracts, high token concentration',
    confidence: 88
  },
  {
    id: '3',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    tags: ['Exchange Hot Wallet', 'Binance', 'High Volume'],
    category: 'exchange',
    riskScore: 5,
    lastActivity: '5 minutes ago',
    balance: '$45.2M',
    notes: 'Verified exchange wallet with consistent high volume',
    confidence: 99
  },
  {
    id: '4',
    address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    tags: ['Suspicious Activity', 'MEV Bot', 'Flash Loan'],
    category: 'suspicious',
    riskScore: 92,
    lastActivity: '30 minutes ago',
    balance: '$156K',
    notes: 'Unusual transaction patterns, potential MEV exploitation',
    confidence: 76
  },
  {
    id: '5',
    address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    tags: ['Uniswap Router', 'DeFi Protocol', 'Smart Contract'],
    category: 'defi',
    riskScore: 8,
    lastActivity: '1 minute ago',
    balance: '$12.8M',
    notes: 'Official Uniswap V2 Router contract',
    confidence: 100
  },
  {
    id: '6',
    address: '0x50EC05ADe8280758E2077fcBC08D878D4aef79C3',
    tags: ['NFT Collector', 'Art Enthusiast', 'Blue Chip Holder'],
    category: 'nft',
    riskScore: 25,
    lastActivity: '4 hours ago',
    balance: '$678K',
    notes: 'Large collection of premium NFTs, active in art community',
    confidence: 82
  }
]

const tagCategories = {
  whale: { color: 'bg-purple-500', icon: TrendingUp },
  dev: { color: 'bg-blue-500', icon: Bot },
  exchange: { color: 'bg-green-500', icon: Users },
  defi: { color: 'bg-orange-500', icon: Star },
  nft: { color: 'bg-pink-500', icon: Star },
  suspicious: { color: 'bg-red-500', icon: AlertTriangle },
  vip: { color: 'bg-yellow-500', icon: Shield }
}

export function WalletTagging() {
  const [taggedWallets, setTaggedWallets] = useState<WalletTag[]>(mockTaggedWallets)
  const [newAddress, setNewAddress] = useState('')
  const [newTags, setNewTags] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const handleAddTag = () => {
    if (newAddress && newTags && selectedCategory) {
      const newWallet: WalletTag = {
        id: Date.now().toString(),
        address: newAddress,
        tags: newTags.split(',').map(tag => tag.trim()),
        category: selectedCategory as any,
        riskScore: Math.floor(Math.random() * 100),
        lastActivity: 'Just now',
        balance: '$' + (Math.random() * 1000000).toFixed(0),
        notes: notes || 'No notes provided',
        confidence: Math.floor(Math.random() * 30) + 70
      }
      setTaggedWallets([newWallet, ...taggedWallets])
      setNewAddress('')
      setNewTags('')
      setSelectedCategory('')
      setNotes('')
    }
  }

  const removeTag = (walletId: string, tagToRemove: string) => {
    setTaggedWallets(taggedWallets.map(wallet => 
      wallet.id === walletId 
        ? { ...wallet, tags: wallet.tags.filter(tag => tag !== tagToRemove) }
        : wallet
    ))
  }

  const filteredWallets = taggedWallets.filter(wallet => {
    const matchesSearch = wallet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wallet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || wallet.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-50'
    if (score < 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Wallet Tagging System
        </h1>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <Tag className="h-3 w-3 mr-1" />
          {taggedWallets.length} Tagged Wallets
        </Badge>
      </div>

      {/* Add New Tag Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-purple-600" />
            Tag New Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Wallet Address</label>
              <Input 
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db4C2b8b5C2f" 
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whale">🐋 Whale</SelectItem>
                  <SelectItem value="dev">👨‍💻 Developer</SelectItem>
                  <SelectItem value="exchange">🏦 Exchange</SelectItem>
                  <SelectItem value="defi">⚡ DeFi Protocol</SelectItem>
                  <SelectItem value="nft">🎨 NFT Collector</SelectItem>
                  <SelectItem value="suspicious">⚠️ Suspicious</SelectItem>
                  <SelectItem value="vip">⭐ VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
            <Input 
              placeholder="Whale, DeFi Power User, Yield Farmer" 
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Notes</label>
            <Textarea 
              placeholder="Additional notes about this wallet..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-purple-200 focus:border-purple-400"
            />
          </div>
          <Button onClick={handleAddTag} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search by address or tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-purple-400"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="whale">🐋 Whales</SelectItem>
            <SelectItem value="dev">👨‍💻 Developers</SelectItem>
            <SelectItem value="exchange">🏦 Exchanges</SelectItem>
            <SelectItem value="defi">⚡ DeFi</SelectItem>
            <SelectItem value="nft">🎨 NFT</SelectItem>
            <SelectItem value="suspicious">⚠️ Suspicious</SelectItem>
            <SelectItem value="vip">⭐ VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tagged Wallets Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Tagged Wallets ({filteredWallets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWallets.map((wallet) => {
                const categoryInfo = tagCategories[wallet.category]
                const CategoryIcon = categoryInfo.icon
                return (
                  <TableRow key={wallet.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${categoryInfo.color} text-white`}>
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {wallet.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {wallet.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                          >
                            {tag}
                            <X 
                              className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                              onClick={() => removeTag(wallet.id, tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(wallet.riskScore)}>
                        {wallet.riskScore}/100
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {wallet.balance}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {wallet.lastActivity}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                            style={{ width: `${wallet.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{wallet.confidence}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}