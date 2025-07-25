import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'volume'

    // Simulate token data
    const tokens = [
      { symbol: 'SEI', name: 'Sei Network', price: 0.45, change24h: 5.2, volume: 12500000, marketCap: 450000000 },
      { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.1, volume: 8900000, marketCap: 32000000000 },
      { symbol: 'WETH', name: 'Wrapped Ethereum', price: 2340.50, change24h: -2.1, volume: 6700000, marketCap: 280000000000 },
      { symbol: 'ATOM', name: 'Cosmos Hub', price: 8.75, change24h: 3.8, volume: 4200000, marketCap: 3400000000 },
      { symbol: 'OSMO', name: 'Osmosis', price: 0.62, change24h: -1.5, volume: 3100000, marketCap: 620000000 },
      { symbol: 'JUNO', name: 'Juno Network', price: 0.28, change24h: 7.3, volume: 2800000, marketCap: 89000000 },
      { symbol: 'SCRT', name: 'Secret Network', price: 0.35, change24h: -0.8, volume: 1900000, marketCap: 78000000 },
      { symbol: 'STARS', name: 'Stargaze', price: 0.012, change24h: 12.5, volume: 1500000, marketCap: 24000000 },
      { symbol: 'HUAHUA', name: 'Chihuahua', price: 0.00008, change24h: -5.2, volume: 890000, marketCap: 8900000 },
      { symbol: 'CMDX', name: 'Comdex', price: 0.045, change24h: 2.1, volume: 650000, marketCap: 4500000 }
    ]

    // Add random fluctuations to make data more realistic
    const enhancedTokens = tokens.map(token => ({
      ...token,
      price: token.price * (1 + (Math.random() - 0.5) * 0.1),
      change24h: token.change24h + (Math.random() - 0.5) * 2,
      volume: token.volume * (1 + (Math.random() - 0.5) * 0.3),
      holders: Math.floor(Math.random() * 50000) + 1000,
      transactions24h: Math.floor(Math.random() * 10000) + 100,
      liquidity: token.volume * (2 + Math.random() * 3)
    }))

    // Sort tokens based on sortBy parameter
    let sortedTokens = [...enhancedTokens]
    switch (sortBy) {
      case 'price':
        sortedTokens.sort((a, b) => b.price - a.price)
        break
      case 'change24h':
        sortedTokens.sort((a, b) => b.change24h - a.change24h)
        break
      case 'marketCap':
        sortedTokens.sort((a, b) => b.marketCap - a.marketCap)
        break
      default: // volume
        sortedTokens.sort((a, b) => b.volume - a.volume)
    }

    const response = {
      tokens: sortedTokens.slice(0, limit),
      totalTokens: sortedTokens.length,
      lastUpdated: new Date().toISOString(),
      marketSummary: {
        totalVolume: sortedTokens.reduce((sum, token) => sum + token.volume, 0),
        totalMarketCap: sortedTokens.reduce((sum, token) => sum + token.marketCap, 0),
        averageChange: sortedTokens.reduce((sum, token) => sum + token.change24h, 0) / sortedTokens.length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Tokens API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token data' },
      { status: 500 }
    )
  }
}