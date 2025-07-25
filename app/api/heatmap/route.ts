import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet') || 'default'
    const timeframe = searchParams.get('timeframe') || '7d'

    // Generate heatmap data for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    const heatmapData = days.map(day => 
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100),
        transactions: Math.floor(Math.random() * 50),
        volume: Math.floor(Math.random() * 10000)
      }))
    ).flat()

    const response = {
      walletAddress,
      timeframe,
      data: heatmapData,
      summary: {
        totalTransactions: heatmapData.reduce((sum, item) => sum + item.transactions, 0),
        totalVolume: heatmapData.reduce((sum, item) => sum + item.volume, 0),
        peakHour: Math.floor(Math.random() * 24),
        peakDay: days[Math.floor(Math.random() * days.length)]
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Heatmap API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    )
  }
}