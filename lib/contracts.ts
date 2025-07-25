'use server'

import { APP_CONFIG } from './config'

// ============================================================================
// MOCK BLOCKCHAIN DATA (FREE TIER)
// ============================================================================

// Mock contract addresses for different networks
const MOCK_CONTRACTS = {
  sei: {
    mainnet: {
      registry: '0x1234567890123456789012345678901234567890',
      analytics: '0x2345678901234567890123456789012345678901',
      alerts: '0x3456789012345678901234567890123456789012'
    },
    testnet: {
      registry: '0x4567890123456789012345678901234567890123',
      analytics: '0x5678901234567890123456789012345678901234',
      alerts: '0x6789012345678901234567890123456789012345'
    }
  },
  ethereum: {
    mainnet: {
      registry: '0x7890123456789012345678901234567890123456',
      analytics: '0x8901234567890123456789012345678901234567',
      alerts: '0x9012345678901234567890123456789012345678'
    },
    sepolia: {
      registry: '0x0123456789012345678901234567890123456789',
      analytics: '0x1234567890123456789012345678901234567890',
      alerts: '0x2345678901234567890123456789012345678901'
    }
  }
}

// ============================================================================
// CONTRACT INTERFACES
// ============================================================================

export interface ContractInfo {
  address: string
  network: string
  type: 'registry' | 'analytics' | 'alerts'
  abi?: any[]
  isActive: boolean
  lastUpdated: string
}

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  totalSupply: string
  price: number
  marketCap: number
  volume24h: number
  holders: number
  verified: boolean
  riskScore: number
}

export interface WalletAnalytics {
  address: string
  balance: string
  tokenCount: number
  transactionCount: number
  firstSeen: string
  lastActive: string
  riskLevel: 'low' | 'medium' | 'high'
  tags: string[]
  isWhale: boolean
  isDev: boolean
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

function generateMockTokenInfo(address: string): TokenInfo {
  const symbols = ['SEI', 'USDC', 'WETH', 'ATOM', 'OSMO', 'JUNO']
  const names = ['Sei Network', 'USD Coin', 'Wrapped Ethereum', 'Cosmos', 'Osmosis', 'Juno']
  
  const index = parseInt(address.slice(-1), 16) % symbols.length
  
  return {
    address,
    symbol: symbols[index],
    name: names[index],
    decimals: 18,
    totalSupply: (Math.random() * 1000000000).toFixed(0),
    price: Math.random() * 100,
    marketCap: Math.random() * 1000000000,
    volume24h: Math.random() * 10000000,
    holders: Math.floor(Math.random() * 50000),
    verified: Math.random() > 0.3,
    riskScore: Math.floor(Math.random() * 100)
  }
}

function generateMockWalletAnalytics(address: string): WalletAnalytics {
  const tags = ['whale', 'dev', 'trader', 'holder', 'bot', 'exchange']
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  
  return {
    address,
    balance: (Math.random() * 1000).toFixed(6),
    tokenCount: Math.floor(Math.random() * 50),
    transactionCount: Math.floor(Math.random() * 10000),
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
    isWhale: Math.random() > 0.8,
    isDev: Math.random() > 0.9
  }
}

// ============================================================================
// CONTRACT FUNCTIONS (MOCK IMPLEMENTATIONS)
// ============================================================================

export async function getContractInfo(network: string, type: string): Promise<ContractInfo | null> {
  await new Promise(resolve => setTimeout(resolve, 100)) // Simulate network delay
  
  const contracts = MOCK_CONTRACTS[network as keyof typeof MOCK_CONTRACTS]
  if (!contracts) return null
  
  const mainnetContracts = contracts.mainnet as any
  const address = mainnetContracts[type]
  
  if (!address) return null
  
  return {
    address,
    network,
    type: type as 'registry' | 'analytics' | 'alerts',
    isActive: true,
    lastUpdated: new Date().toISOString()
  }
}

export async function getTokenInfo(address: string): Promise<TokenInfo> {
  await new Promise(resolve => setTimeout(resolve, 150)) // Simulate network delay
  return generateMockTokenInfo(address)
}

export async function getWalletAnalytics(address: string): Promise<WalletAnalytics> {
  await new Promise(resolve => setTimeout(resolve, 200)) // Simulate network delay
  return generateMockWalletAnalytics(address)
}

export async function getTokenHolders(tokenAddress: string, limit: number = 100): Promise<{
  holders: Array<{
    address: string
    balance: string
    percentage: number
    rank: number
  }>
  totalHolders: number
}> {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
  
  const holders = Array.from({ length: Math.min(limit, 100) }, (_, i) => {
    const address = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    const balance = (Math.random() * 1000000).toFixed(6)
    
    return {
      address,
      balance,
      percentage: Math.random() * 10,
      rank: i + 1
    }
  })
  
  return {
    holders,
    totalHolders: Math.floor(Math.random() * 50000) + 1000
  }
}

export async function getTransactionHistory(address: string, limit: number = 50): Promise<{
  transactions: Array<{
    hash: string
    from: string
    to: string
    value: string
    timestamp: string
    status: 'success' | 'failed'
    gasUsed: string
    type: 'transfer' | 'swap' | 'stake' | 'unstake'
  }>
  totalTransactions: number
}> {
  await new Promise(resolve => setTimeout(resolve, 250)) // Simulate network delay
  
  const types: ('transfer' | 'swap' | 'stake' | 'unstake')[] = ['transfer', 'swap', 'stake', 'unstake']
  
  const transactions = Array.from({ length: Math.min(limit, 50) }, () => {
    const hash = `0x${Math.random().toString(16).slice(2, 66).padStart(64, '0')}`
    const from = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    const to = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    
    return {
      hash,
      from,
      to,
      value: (Math.random() * 100).toFixed(6),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.05 ? 'success' : 'failed' as 'success' | 'failed',
      gasUsed: Math.floor(Math.random() * 100000).toString(),
      type: types[Math.floor(Math.random() * types.length)]
    }
  })
  
  return {
    transactions,
    totalTransactions: Math.floor(Math.random() * 10000) + 100
  }
}

// ============================================================================
// WHALE DETECTION
// ============================================================================

export async function detectWhales(minBalance: number = 1000): Promise<{
  whales: Array<{
    address: string
    balance: string
    rank: number
    firstSeen: string
    tags: string[]
  }>
  totalWhales: number
}> {
  await new Promise(resolve => setTimeout(resolve, 400)) // Simulate network delay
  
  const whales = Array.from({ length: 50 }, (_, i) => {
    const address = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    const balance = (Math.random() * 100000 + minBalance).toFixed(6)
    const tags = ['whale', 'early_investor', 'institutional'].slice(0, Math.floor(Math.random() * 3) + 1)
    
    return {
      address,
      balance,
      rank: i + 1,
      firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      tags
    }
  })
  
  return {
    whales,
    totalWhales: Math.floor(Math.random() * 1000) + 100
  }
}

// ============================================================================
// DEV WALLET DETECTION
// ============================================================================

export async function detectDevWallets(): Promise<{
  devWallets: Array<{
    address: string
    projectName: string
    tokenSymbol: string
    devHolding: number
    riskScore: number
    contractsDeployed: number
    lastActivity: string
  }>
  totalDevWallets: number
}> {
  await new Promise(resolve => setTimeout(resolve, 350)) // Simulate network delay
  
  const projects = ['DeFiSwap', 'YieldFarm', 'NFTMarket', 'GameFi', 'SocialFi', 'MetaVerse']
  const symbols = ['DFS', 'YLD', 'NFT', 'GAME', 'SOCIAL', 'META']
  
  const devWallets = Array.from({ length: 30 }, (_, i) => {
    const address = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    const projectIndex = Math.floor(Math.random() * projects.length)
    
    return {
      address,
      projectName: projects[projectIndex],
      tokenSymbol: symbols[projectIndex],
      devHolding: Math.random() * 50,
      riskScore: Math.floor(Math.random() * 100),
      contractsDeployed: Math.floor(Math.random() * 10) + 1,
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  })
  
  return {
    devWallets,
    totalDevWallets: Math.floor(Math.random() * 500) + 50
  }
}

// ============================================================================
// UNLOCK EVENTS
// ============================================================================

export async function getUnlockEvents(): Promise<{
  unlocks: Array<{
    tokenAddress: string
    tokenSymbol: string
    unlockDate: string
    amount: string
    percentage: number
    category: string
    impact: 'low' | 'medium' | 'high'
  }>
  totalUnlocks: number
}> {
  await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
  
  const symbols = ['SEI', 'ATOM', 'OSMO', 'JUNO', 'STARS', 'HUAHUA']
  const categories = ['Team', 'Investors', 'Community', 'Ecosystem', 'Treasury']
  const impacts: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
  
  const unlocks = Array.from({ length: 20 }, () => {
    const tokenAddress = `0x${Math.random().toString(16).slice(2, 42).padStart(40, '0')}`
    const symbolIndex = Math.floor(Math.random() * symbols.length)
    
    return {
      tokenAddress,
      tokenSymbol: symbols[symbolIndex],
      unlockDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      amount: (Math.random() * 10000000).toFixed(0),
      percentage: Math.random() * 20,
      category: categories[Math.floor(Math.random() * categories.length)],
      impact: impacts[Math.floor(Math.random() * impacts.length)]
    }
  })
  
  return {
    unlocks,
    totalUnlocks: Math.floor(Math.random() * 200) + 50
  }
}

// ============================================================================
// NETWORK STATUS
// ============================================================================

export async function getNetworkStatus(): Promise<{
  networks: Array<{
    name: string
    status: 'online' | 'degraded' | 'offline'
    blockHeight: number
    blockTime: number
    gasPrice: string
    validators: number
    uptime: number
  }>
}> {
  await new Promise(resolve => setTimeout(resolve, 100)) // Simulate network delay
  
  const networks = [
    {
      name: 'Sei Network',
      status: 'online' as const,
      blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
      blockTime: 0.6,
      gasPrice: '0.1',
      validators: 100,
      uptime: 99.9
    },
    {
      name: 'Ethereum',
      status: 'online' as const,
      blockHeight: Math.floor(Math.random() * 100000) + 18000000,
      blockTime: 12,
      gasPrice: '20',
      validators: 500000,
      uptime: 99.95
    },
    {
      name: 'Cosmos Hub',
      status: 'online' as const,
      blockHeight: Math.floor(Math.random() * 100000) + 12000000,
      blockTime: 6.5,
      gasPrice: '0.025',
      validators: 175,
      uptime: 99.8
    }
  ]
  
  return { networks }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function isValidAddress(address: string): boolean {
  // Basic validation for Ethereum-style addresses
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function formatBalance(balance: string, decimals: number = 18): string {
  const num = parseFloat(balance) / Math.pow(10, decimals)
  return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
}

export function calculateRiskScore(factors: {
  age: number // days
  transactionCount: number
  uniqueInteractions: number
  largeTransactions: number
}): number {
  let score = 50 // Base score
  
  // Age factor (older = lower risk)
  if (factors.age > 365) score -= 20
  else if (factors.age > 90) score -= 10
  else if (factors.age < 7) score += 30
  
  // Activity factor
  if (factors.transactionCount > 1000) score -= 15
  else if (factors.transactionCount < 10) score += 20
  
  // Interaction diversity
  if (factors.uniqueInteractions > 50) score -= 10
  else if (factors.uniqueInteractions < 5) score += 15
  
  // Large transaction factor
  if (factors.largeTransactions > 10) score += 25
  
  return Math.max(0, Math.min(100, score))
}

// ============================================================================
// EXPORT ALL FUNCTIONS
// ============================================================================

export const contractFunctions = {
  getContractInfo,
  getTokenInfo,
  getWalletAnalytics,
  getTokenHolders,
  getTransactionHistory,
  detectWhales,
  detectDevWallets,
  getUnlockEvents,
  getNetworkStatus,
  isValidAddress,
  formatBalance,
  calculateRiskScore
}

export default contractFunctions