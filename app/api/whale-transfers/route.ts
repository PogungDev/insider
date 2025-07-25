import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const timeframe = searchParams.get('timeframe') || '24h'

    // Calculate time range
    const now = new Date()
    const hours = timeframe === '24h' ? 24 : timeframe === '7d' ? 168 : 24
    const startTime = new Date(now.getTime() - (hours * 60 * 60 * 1000))

    // Simulate whale transfer data
    const whaleTransfers = Array.from({ length: Math.min(limit, 50) }, (_, i) => {
      const transferTime = new Date(startTime.getTime() + (Math.random() * hours * 60 * 60 * 1000))
      const tokens = ['SEI', 'USDC', 'WETH', 'ATOM', 'OSMO']
      const token = tokens[Math.floor(Math.random() * tokens.length)]
      const amount = Math.floor(Math.random() * 10000000) + 100000
      
      return {
        id: `transfer_${Date.now()}_${i}`,
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
        from: `sei1${Math.random().toString(36).substring(2, 15)}`,
        to: `sei1${Math.random().toString(36).substring(2, 15)}`,
        token,
        tokenAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        amount,
        value: amount * (token === 'SEI' ? 0.45 : token === 'USDC' ? 1 : token === 'WETH' ? 2340 : token === 'ATOM' ? 8.75 : 0.62),
        timestamp: transferTime.toISOString(),
        blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        type: ['transfer', 'swap', 'liquidity_add', 'liquidity_remove'][Math.floor(Math.random() * 4)],
        isWhale: amount > 1000000,
        riskScore: Math.floor(Math.random() * 100),
        tags: [
          ['large_transfer', 'whale_activity'],
          ['dex_interaction', 'high_volume'],
          ['liquidity_provision'],
          ['arbitrage', 'mev']
        ][Math.floor(Math.random() * 4)]
      }
    })

    // Sort by timestamp (newest first)
    whaleTransfers.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const response = {
      transfers: whaleTransfers,
      timeframe,
      summary: {
        totalTransfers: whaleTransfers.length,
        totalValue: whaleTransfers.reduce((sum, transfer) => sum + transfer.value, 0),
        uniqueWallets: new Set([...whaleTransfers.map(t => t.from), ...whaleTransfers.map(t => t.to)]).size,
        averageAmount: whaleTransfers.reduce((sum, transfer) => sum + transfer.amount, 0) / whaleTransfers.length,
        whaleCount: whaleTransfers.filter(t => t.isWhale).length
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Whale Transfers API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch whale transfer data' },
      { status: 500 }
    )
  }
}