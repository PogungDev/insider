import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const severity = searchParams.get('severity') || 'all'
    const category = searchParams.get('type') || 'all'

    // Simulate anomaly alerts data
    const alerts = Array.from({ length: Math.min(limit, 20) }, (_, i) => ({
      id: `alert_${Date.now()}_${i}`,
      type: ['rugpull_risk', 'whale_movement', 'unusual_volume', 'dev_dump'][Math.floor(Math.random() * 4)],
      severity: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)],
      title: [
        'Potential Rugpull Detected',
        'Large Whale Movement',
        'Unusual Trading Volume',
        'Dev Wallet Activity'
      ][Math.floor(Math.random() * 4)],
      description: [
        'Suspicious token contract activity detected',
        'Large wallet transferred significant amount',
        'Trading volume spike detected',
        'Developer wallet showing unusual activity'
      ][Math.floor(Math.random() * 4)],
      walletAddress: `sei1${Math.random().toString(36).substring(2, 15)}`,
      tokenAddress: `0x${Math.random().toString(16).substring(2, 10)}`,
      amount: Math.floor(Math.random() * 1000000),
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      confidence: Math.floor(Math.random() * 30) + 70,
      status: ['active', 'resolved', 'investigating'][Math.floor(Math.random() * 3)]
    }))

    // Filter by severity if specified
    const filteredAlerts = severity === 'all' 
      ? alerts 
      : alerts.filter(alert => alert.severity === severity)

    return NextResponse.json(filteredAlerts)
  } catch (error) {
    console.error('Anomaly Alerts API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch anomaly alerts' },
      { status: 500 }
    )
  }
}