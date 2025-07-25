import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    const days = parseInt(range.replace('d', '')) || 30
    const endDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))

    // Simulate unlock events data
    const unlockEvents = Array.from({ length: 15 }, (_, i) => {
      const unlockDate = new Date(now.getTime() + (Math.random() * days * 24 * 60 * 60 * 1000))
      return {
        id: `unlock_${Date.now()}_${i}`,
        token: ['SEI', 'USDC', 'WETH', 'ATOM', 'OSMO'][Math.floor(Math.random() * 5)],
        tokenAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
        amount: Math.floor(Math.random() * 10000000) + 100000,
        value: Math.floor(Math.random() * 1000000) + 50000,
        date: unlockDate.toISOString(),
        type: ['vesting', 'cliff', 'linear'][Math.floor(Math.random() * 3)],
        recipient: `sei1${Math.random().toString(36).substring(2, 15)}`,
        description: [
          'Team vesting unlock',
          'Investor cliff unlock',
          'Community rewards unlock',
          'Advisor token unlock'
        ][Math.floor(Math.random() * 4)],
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        marketImpact: Math.floor(Math.random() * 100),
        status: 'scheduled'
      }
    })

    // Sort by date
    unlockEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(unlockEvents)
  } catch (error) {
    console.error('Unlock List API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unlock events' },
      { status: 500 }
    )
  }
}