'use server'

import { revalidatePath } from 'next/cache'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface WalletSearchResult {
  address: string
  type: 'whale' | 'dev' | 'user'
  balance: number
  verified: boolean
  riskScore: number
  tags: string[]
  lastActivity: string
  totalTransactions: number
  portfolioValue: number
}

interface DevWallet {
  id: string
  address: string
  projectName: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  devHoldings: {
    percentage: number
    tokens: number
    value: number
  }
  marketCap: number
  security: {
    contractVerified: boolean
    liquidityLocked: boolean
    auditStatus: 'none' | 'pending' | 'completed'
    multisigWallet: boolean
  }
  flags: {
    rugPullRisk: boolean
    unusualActivity: boolean
    largeTransfers: boolean
    newProject: boolean
  }
}

interface WhaleWallet {
  id: string
  address: string
  nickname?: string
  balance: number
  portfolioValue: number
  riskScore: number
  tier: 'mega' | 'large' | 'medium' | 'small'
  verified: boolean
  tags: string[]
  activity: {
    lastTransaction: string
    txCount24h: number
    volumeTransferred24h: number
  }
}

interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: {
    type: string
    operator: string
    value: number
    field: string
  }[]
  actions: {
    type: 'email' | 'telegram' | 'discord' | 'webhook'
    target: string
    enabled: boolean
  }[]
  createdAt: string
  lastTriggered?: string
  triggerCount: number
}

interface UnlockEvent {
  id: string
  tokenName: string
  tokenSymbol: string
  unlockDate: string
  amount: number
  value: number
  percentageOfSupply: number
  category: 'team' | 'investor' | 'advisor' | 'ecosystem' | 'community'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  impactScore: number
  priceChange24h: number
}

interface ApiKey {
  id: string
  name: string
  description: string
  key: string
  keyPreview: string
  permissions: string[]
  status: 'active' | 'inactive' | 'revoked'
  createdAt: string
  usage: {
    totalRequests: number
    requestsToday: number
    requestsThisMonth: number
    lastUsed?: string
  }
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockWallets: WalletSearchResult[] = [
  {
    address: 'sei1abc123def456ghi789jkl012mno345pqr678stu',
    type: 'whale',
    balance: 2500000,
    verified: true,
    riskScore: 25,
    tags: ['DeFi Trader', 'Early Adopter', 'Verified'],
    lastActivity: '2024-01-15T10:30:00Z',
    totalTransactions: 1250,
    portfolioValue: 5000000
  },
  {
    address: 'sei1def456ghi789jkl012mno345pqr678stu901vwx',
    type: 'dev',
    balance: 850000,
    verified: true,
    riskScore: 15,
    tags: ['Developer', 'Project Founder', 'Verified'],
    lastActivity: '2024-01-15T09:15:00Z',
    totalTransactions: 420,
    portfolioValue: 1700000
  }
]

const mockDevWallets: DevWallet[] = [
  {
    id: 'dev-1',
    address: 'sei1abc123def456ghi789jkl012mno345pqr678stu',
    projectName: 'SeiSwap Protocol',
    riskLevel: 'low',
    riskScore: 15,
    devHoldings: {
      percentage: 8.5,
      tokens: 850000,
      value: 425000
    },
    marketCap: 5000000,
    security: {
      contractVerified: true,
      liquidityLocked: true,
      auditStatus: 'completed',
      multisigWallet: true
    },
    flags: {
      rugPullRisk: false,
      unusualActivity: false,
      largeTransfers: false,
      newProject: false
    }
  }
]

const mockWhales: WhaleWallet[] = [
  {
    id: 'whale-1',
    address: 'sei1abc123def456ghi789jkl012mno345pqr678stu',
    nickname: 'Sei Whale #1',
    balance: 5000000,
    portfolioValue: 12500000,
    riskScore: 20,
    tier: 'mega',
    verified: true,
    tags: ['DeFi', 'Long-term Holder', 'Institutional'],
    activity: {
      lastTransaction: '2024-01-15T10:30:00Z',
      txCount24h: 8,
      volumeTransferred24h: 250000
    }
  }
]

const mockAlertRules: AlertRule[] = [
  {
    id: 'alert-1',
    name: 'Large Transfer Alert',
    description: 'Alert when transfer amount exceeds 100,000 SEI',
    enabled: true,
    conditions: [
      {
        type: 'transfer_amount',
        operator: 'greater_than',
        value: 100000,
        field: 'amount'
      }
    ],
    actions: [
      {
        type: 'email',
        target: 'user@example.com',
        enabled: true
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    lastTriggered: '2024-01-15T10:30:00Z',
    triggerCount: 25
  }
]

const mockUnlocks: UnlockEvent[] = [
  {
    id: 'unlock-1',
    tokenName: 'Sei Protocol',
    tokenSymbol: 'SEI',
    unlockDate: '2024-01-20T00:00:00Z',
    amount: 10000000,
    value: 5000000,
    percentageOfSupply: 2.5,
    category: 'team',
    riskLevel: 'medium',
    impactScore: 65,
    priceChange24h: -2.3
  }
]

const mockApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    name: 'Production API',
    description: 'Main production API key',
    key: 'sk_live_1234567890abcdef',
    keyPreview: 'sk_live_1234...cdef',
    permissions: ['wallets:read', 'alerts:read', 'analytics:read'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    usage: {
      totalRequests: 45230,
      requestsToday: 1250,
      requestsThisMonth: 28500,
      lastUsed: '2024-01-15T10:30:00Z'
    }
  }
]

// ============================================================================
// WALLET ACTIONS
// ============================================================================

export async function searchWallets(
  query?: string,
  type?: 'whale' | 'dev' | 'user',
  verified?: boolean,
  minBalance?: number,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ wallets: WalletSearchResult[], total: number }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API delay
    
    let filteredWallets = mockWallets
    
    if (query) {
      filteredWallets = filteredWallets.filter(w => 
        w.address.toLowerCase().includes(query.toLowerCase()) ||
        w.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }
    
    if (type) {
      filteredWallets = filteredWallets.filter(w => w.type === type)
    }
    
    if (verified !== undefined) {
      filteredWallets = filteredWallets.filter(w => w.verified === verified)
    }
    
    if (minBalance) {
      filteredWallets = filteredWallets.filter(w => w.balance >= minBalance)
    }
    
    const startIndex = (page - 1) * limit
    const paginatedWallets = filteredWallets.slice(startIndex, startIndex + limit)
    
    return {
      success: true,
      data: {
        wallets: paginatedWallets,
        total: filteredWallets.length
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to search wallets'
    }
  }
}

export async function getWalletProfile(address: string): Promise<ApiResponse<WalletSearchResult>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const wallet = mockWallets.find(w => w.address === address)
    
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found'
      }
    }
    
    return {
      success: true,
      data: wallet
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get wallet profile'
    }
  }
}

// ============================================================================
// DEV SCREENER ACTIONS
// ============================================================================

export async function getDevWallets(
  riskLevel?: 'low' | 'medium' | 'high' | 'critical',
  verified?: boolean,
  minMarketCap?: number,
  sortBy: string = 'riskScore',
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ devWallets: DevWallet[], total: number, summary: any }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredWallets = mockDevWallets
    
    if (riskLevel) {
      filteredWallets = filteredWallets.filter(w => w.riskLevel === riskLevel)
    }
    
    if (verified !== undefined) {
      filteredWallets = filteredWallets.filter(w => w.security.contractVerified === verified)
    }
    
    if (minMarketCap) {
      filteredWallets = filteredWallets.filter(w => w.marketCap >= minMarketCap)
    }
    
    // Sort
    filteredWallets.sort((a, b) => {
      switch (sortBy) {
        case 'riskScore':
          return b.riskScore - a.riskScore
        case 'devPercentage':
          return b.devHoldings.percentage - a.devHoldings.percentage
        case 'marketCap':
          return b.marketCap - a.marketCap
        default:
          return b.riskScore - a.riskScore
      }
    })
    
    const startIndex = (page - 1) * limit
    const paginatedWallets = filteredWallets.slice(startIndex, startIndex + limit)
    
    const summary = {
      totalProjects: filteredWallets.length,
      criticalRisk: filteredWallets.filter(w => w.riskLevel === 'critical').length,
      averageDevPercentage: filteredWallets.reduce((sum, w) => sum + w.devHoldings.percentage, 0) / filteredWallets.length,
      verifiedContracts: filteredWallets.filter(w => w.security.contractVerified).length,
      lockedLiquidity: filteredWallets.filter(w => w.security.liquidityLocked).length
    }
    
    return {
      success: true,
      data: {
        devWallets: paginatedWallets,
        total: filteredWallets.length,
        summary
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get dev wallets'
    }
  }
}

// ============================================================================
// WHALE ACTIONS
// ============================================================================

export async function getTopWhales(
  tier?: 'mega' | 'large' | 'medium' | 'small',
  verified?: boolean,
  minBalance?: number,
  sortBy: string = 'balance',
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ whales: WhaleWallet[], total: number, summary: any }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredWhales = mockWhales
    
    if (tier) {
      filteredWhales = filteredWhales.filter(w => w.tier === tier)
    }
    
    if (verified !== undefined) {
      filteredWhales = filteredWhales.filter(w => w.verified === verified)
    }
    
    if (minBalance) {
      filteredWhales = filteredWhales.filter(w => w.balance >= minBalance)
    }
    
    // Sort
    filteredWhales.sort((a, b) => {
      switch (sortBy) {
        case 'balance':
          return b.balance - a.balance
        case 'portfolioValue':
          return b.portfolioValue - a.portfolioValue
        case 'riskScore':
          return b.riskScore - a.riskScore
        default:
          return b.balance - a.balance
      }
    })
    
    const startIndex = (page - 1) * limit
    const paginatedWhales = filteredWhales.slice(startIndex, startIndex + limit)
    
    const summary = {
      totalWhales: filteredWhales.length,
      totalValue: filteredWhales.reduce((sum, w) => sum + w.portfolioValue, 0),
      averageBalance: filteredWhales.reduce((sum, w) => sum + w.balance, 0) / filteredWhales.length,
      verifiedWhales: filteredWhales.filter(w => w.verified).length
    }
    
    return {
      success: true,
      data: {
        whales: paginatedWhales,
        total: filteredWhales.length,
        summary
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get top whales'
    }
  }
}

// ============================================================================
// ALERT ACTIONS
// ============================================================================

export async function getAlertRules(
  enabled?: boolean,
  type?: string,
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ rules: AlertRule[], total: number, summary: any }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredRules = mockAlertRules
    
    if (enabled !== undefined) {
      filteredRules = filteredRules.filter(r => r.enabled === enabled)
    }
    
    if (type) {
      filteredRules = filteredRules.filter(r => 
        r.conditions.some(c => c.type === type)
      )
    }
    
    const startIndex = (page - 1) * limit
    const paginatedRules = filteredRules.slice(startIndex, startIndex + limit)
    
    const summary = {
      totalRules: filteredRules.length,
      activeRules: filteredRules.filter(r => r.enabled).length,
      totalTriggers: filteredRules.reduce((sum, r) => sum + r.triggerCount, 0),
      avgTriggersPerRule: filteredRules.reduce((sum, r) => sum + r.triggerCount, 0) / filteredRules.length
    }
    
    return {
      success: true,
      data: {
        rules: paginatedRules,
        total: filteredRules.length,
        summary
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get alert rules'
    }
  }
}

export async function createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'triggerCount'>): Promise<ApiResponse<AlertRule>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newRule: AlertRule = {
      ...rule,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      triggerCount: 0
    }
    
    mockAlertRules.push(newRule)
    revalidatePath('/dashboard/alerts')
    
    return {
      success: true,
      data: newRule,
      message: 'Alert rule created successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create alert rule'
    }
  }
}

export async function updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<ApiResponse<AlertRule>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const ruleIndex = mockAlertRules.findIndex(r => r.id === id)
    
    if (ruleIndex === -1) {
      return {
        success: false,
        error: 'Alert rule not found'
      }
    }
    
    mockAlertRules[ruleIndex] = { ...mockAlertRules[ruleIndex], ...updates }
    revalidatePath('/dashboard/alerts')
    
    return {
      success: true,
      data: mockAlertRules[ruleIndex],
      message: 'Alert rule updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update alert rule'
    }
  }
}

export async function deleteAlertRule(id: string): Promise<ApiResponse<void>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const ruleIndex = mockAlertRules.findIndex(r => r.id === id)
    
    if (ruleIndex === -1) {
      return {
        success: false,
        error: 'Alert rule not found'
      }
    }
    
    mockAlertRules.splice(ruleIndex, 1)
    revalidatePath('/dashboard/alerts')
    
    return {
      success: true,
      message: 'Alert rule deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to delete alert rule'
    }
  }
}

// ============================================================================
// UNLOCK ACTIONS
// ============================================================================

export async function getUnlockEvents(
  timeframe?: string,
  category?: string,
  riskLevel?: string,
  search?: string,
  sortBy: string = 'unlockDate',
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ unlocks: UnlockEvent[], total: number, summary: any }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredUnlocks = mockUnlocks
    
    if (category) {
      filteredUnlocks = filteredUnlocks.filter(u => u.category === category)
    }
    
    if (riskLevel) {
      filteredUnlocks = filteredUnlocks.filter(u => u.riskLevel === riskLevel)
    }
    
    if (search) {
      filteredUnlocks = filteredUnlocks.filter(u => 
        u.tokenName.toLowerCase().includes(search.toLowerCase()) ||
        u.tokenSymbol.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Sort
    filteredUnlocks.sort((a, b) => {
      switch (sortBy) {
        case 'unlockDate':
          return new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
        case 'value':
          return b.value - a.value
        case 'impactScore':
          return b.impactScore - a.impactScore
        default:
          return new Date(a.unlockDate).getTime() - new Date(b.unlockDate).getTime()
      }
    })
    
    const startIndex = (page - 1) * limit
    const paginatedUnlocks = filteredUnlocks.slice(startIndex, startIndex + limit)
    
    const summary = {
      totalUnlocks: filteredUnlocks.length,
      totalValue: filteredUnlocks.reduce((sum, u) => sum + u.value, 0),
      highRiskUnlocks: filteredUnlocks.filter(u => u.riskLevel === 'high' || u.riskLevel === 'critical').length,
      averageImpact: filteredUnlocks.reduce((sum, u) => sum + u.impactScore, 0) / filteredUnlocks.length,
      upcoming24h: filteredUnlocks.filter(u => {
        const unlockTime = new Date(u.unlockDate).getTime()
        const now = Date.now()
        return unlockTime >= now && unlockTime <= now + 24 * 60 * 60 * 1000
      }).length,
      upcoming7d: filteredUnlocks.filter(u => {
        const unlockTime = new Date(u.unlockDate).getTime()
        const now = Date.now()
        return unlockTime >= now && unlockTime <= now + 7 * 24 * 60 * 60 * 1000
      }).length
    }
    
    return {
      success: true,
      data: {
        unlocks: paginatedUnlocks,
        total: filteredUnlocks.length,
        summary
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get unlock events'
    }
  }
}

// ============================================================================
// API KEY ACTIONS
// ============================================================================

export async function getApiKeys(
  status?: 'active' | 'inactive' | 'revoked',
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<{ keys: ApiKey[], total: number, summary: any }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredKeys = mockApiKeys
    
    if (status) {
      filteredKeys = filteredKeys.filter(k => k.status === status)
    }
    
    const startIndex = (page - 1) * limit
    const paginatedKeys = filteredKeys.slice(startIndex, startIndex + limit)
    
    const summary = {
      totalKeys: filteredKeys.length,
      activeKeys: filteredKeys.filter(k => k.status === 'active').length,
      totalRequests: filteredKeys.reduce((sum, k) => sum + k.usage.totalRequests, 0),
      requestsToday: filteredKeys.reduce((sum, k) => sum + k.usage.requestsToday, 0),
      avgResponseTime: 85
    }
    
    return {
      success: true,
      data: {
        keys: paginatedKeys,
        total: filteredKeys.length,
        summary
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get API keys'
    }
  }
}

export async function createApiKey(keyData: {
  name: string
  description: string
  permissions: string[]
}): Promise<ApiResponse<ApiKey>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: keyData.name,
      description: keyData.description,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      keyPreview: `sk_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      permissions: keyData.permissions,
      status: 'active',
      createdAt: new Date().toISOString(),
      usage: {
        totalRequests: 0,
        requestsToday: 0,
        requestsThisMonth: 0
      }
    }
    
    mockApiKeys.push(newKey)
    revalidatePath('/dashboard/dev')
    
    return {
      success: true,
      data: newKey,
      message: 'API key created successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create API key'
    }
  }
}

export async function updateApiKey(id: string, updates: Partial<ApiKey>): Promise<ApiResponse<ApiKey>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const keyIndex = mockApiKeys.findIndex(k => k.id === id)
    
    if (keyIndex === -1) {
      return {
        success: false,
        error: 'API key not found'
      }
    }
    
    mockApiKeys[keyIndex] = { ...mockApiKeys[keyIndex], ...updates }
    revalidatePath('/dashboard/dev')
    
    return {
      success: true,
      data: mockApiKeys[keyIndex],
      message: 'API key updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update API key'
    }
  }
}

export async function deleteApiKey(id: string): Promise<ApiResponse<void>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const keyIndex = mockApiKeys.findIndex(k => k.id === id)
    
    if (keyIndex === -1) {
      return {
        success: false,
        error: 'API key not found'
      }
    }
    
    // Mark as revoked instead of deleting
    mockApiKeys[keyIndex].status = 'revoked'
    revalidatePath('/dashboard/dev')
    
    return {
      success: true,
      message: 'API key revoked successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to revoke API key'
    }
  }
}

// ============================================================================
// ANALYTICS ACTIONS
// ============================================================================

export async function getAnalyticsData(
  timeframe: string = '7d',
  metrics: string[] = ['transactions', 'volume', 'users']
): Promise<ApiResponse<any>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Mock analytics data
    const data = {
      transactions: {
        total: 125430,
        change24h: 12.5,
        chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 5000) + 1000
        }))
      },
      volume: {
        total: 45230000,
        change24h: -3.2,
        chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 2000000) + 500000
        }))
      },
      users: {
        total: 8920,
        change24h: 8.7,
        chart: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 500) + 200
        }))
      }
    }
    
    return {
      success: true,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get analytics data'
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export async function getSystemStatus(): Promise<ApiResponse<any>> {
  try {
    const status = {
      api: 'operational',
      database: 'operational',
      blockchain: 'operational',
      alerts: 'operational',
      uptime: '99.9%',
      lastUpdate: new Date().toISOString()
    }
    
    return {
      success: true,
      data: status
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get system status'
    }
  }
}

export async function getTokenData(symbol?: string): Promise<ApiResponse<any>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const tokens = [
      {
        symbol: 'SEI',
        name: 'Sei Protocol',
        price: 0.52,
        change24h: 5.2,
        volume24h: 12500000,
        marketCap: 520000000,
        holders: 45230
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        price: 1.00,
        change24h: 0.1,
        volume24h: 8500000,
        marketCap: 850000000,
        holders: 28500
      }
    ]
    
    if (symbol) {
      const token = tokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase())
      if (!token) {
        return {
          success: false,
          error: 'Token not found'
        }
      }
      return {
        success: true,
        data: token
      }
    }
    
    return {
      success: true,
      data: tokens
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to get token data'
    }
  }
}