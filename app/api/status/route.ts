import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simulate various backend statuses
    const status = {
      seiRpcEndpoint: { 
        status: "Connected", 
        latency: `${Math.floor(Math.random() * 50) + 20}ms` 
      },
      cryptoRankApi: { 
        status: "Active", 
        lastFetch: new Date(Date.now() - Math.random() * 3600000).toISOString() 
      },
      messariApi: { 
        status: "Active", 
        lastFetch: new Date(Date.now() - Math.random() * 3600000).toISOString() 
      },
      mongoDb: { 
        status: "Connected", 
        queryTime: `${Math.floor(Math.random() * 100) + 10}ms` 
      },
      webSocketStream: { 
        status: "Active", 
        connectedClients: Math.floor(Math.random() * 100) + 5,
        latency: `${Math.floor(Math.random() * 30) + 10}ms`
      },
      cronJobs: { 
        status: "Running", 
        lastRun: new Date(Date.now() - Math.random() * 3600000).toISOString() 
      },
      alertEngine: { 
        status: "Ready", 
        pendingAlerts: Math.floor(Math.random() * 10),
        deliveryTime: `${Math.floor(Math.random() * 5000) + 1000}ms`
      }
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Status API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}