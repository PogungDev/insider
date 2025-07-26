import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_MAPPINGS, APP_CONFIG } from './lib/config'

// Cache configuration
const CACHE_CONTROL_HEADERS = {
  public: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  private: 'private, max-age=3600, stale-while-revalidate=86400',
  noStore: 'no-store, no-cache, must-revalidate, proxy-revalidate',
  shortTerm: 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

// Function to handle static assets
function handleStaticAssets(request: NextRequest, response: NextResponse) {
  const url = request.nextUrl.pathname;
  if (
    url.includes('/_next/static/') ||
    url.includes('/static/') ||
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.woff') ||
    url.endsWith('.woff2') ||
    url.endsWith('.ttf') ||
    url.endsWith('.svg') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg')
  ) {
    // Aggressive caching for static assets
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Prevent aborted requests
    response.headers.set('Connection', 'keep-alive');
    response.headers.set('Keep-Alive', 'timeout=5, max=1000');
    return true;
  }
  return false;
}

const PROTECTED_ROUTES = [
  '/dashboard',
  '/api'
]

const PUBLIC_ROUTES = [
  '/',
  '/api-docs',
  '/behavioral-insights',
  '/strategy-intelligence',
  '/wallet-profile'
]

const API_ROUTES = Object.keys(ROUTE_MAPPINGS)

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

function getRateLimitKey(request: NextRequest): string {
  // Use API key if present, otherwise use IP
  const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
  if (apiKey) {
    return `api:${apiKey}`
  }
  
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return `ip:${ip}`
}

function checkRateLimit(request: NextRequest): boolean {
  if (!APP_CONFIG.security.rateLimit.enabled) {
    return true
  }
  
  const key = getRateLimitKey(request)
  const now = Date.now()
  const windowMs = APP_CONFIG.security.rateLimit.window
  const maxRequests = APP_CONFIG.security.rateLimit.requests
  
  const entry = rateLimitMap.get(key)
  
  if (!entry || now > entry.resetTime) {
    // New window or expired entry
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return true
  }
  
  if (entry.count >= maxRequests) {
    return false
  }
  
  entry.count++
  return true
}

// ============================================================================
// API KEY VALIDATION
// ============================================================================

function validateApiKey(apiKey: string): boolean {
  // In production, this would check against a database
  // For now, we'll use a simple validation
  return apiKey.startsWith(APP_CONFIG.security.apiKeys.prefix) && 
         apiKey.length >= APP_CONFIG.security.apiKeys.length
}

function requiresApiKey(pathname: string): boolean {
  // API routes require API key
  return pathname.startsWith('/api/') && !pathname.startsWith('/api-docs')
}

// ============================================================================
// CORS HANDLING
// ============================================================================

function handleCors(request: NextRequest): NextResponse | null {
  const origin = request.headers.get('origin')
  const { origins, methods, headers } = APP_CONFIG.security.cors
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    
    if (origin && (origins as readonly string[]).includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }
    
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', headers.join(', '))
    response.headers.set('Access-Control-Max-Age', '86400')
    
    return response
  }
  
  return null
}

// ============================================================================
// API ROUTE REDIRECTION
// ============================================================================

function redirectToServerAction(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  
  // Check if this is an API route that should be handled by server actions
  if (API_ROUTES.includes(pathname)) {
    // For GET requests, redirect to the corresponding page with server action
    if (request.method === 'GET') {
      const actionName = ROUTE_MAPPINGS[pathname as keyof typeof ROUTE_MAPPINGS]
      
      // Map API routes to their corresponding dashboard pages
      const pageMapping: Record<string, string> = {
        '/api/search/wallet': '/dashboard/wallets/search',
        '/api/screener/dev': '/dashboard/screener/dev',
        '/api/whales/top': '/dashboard/whales/top',
        '/api/alerts/rules': '/dashboard/alerts/rules',
        '/api/unlocks/screener': '/dashboard/unlocks/screener',
        '/api/dev/keys': '/dashboard/dev/api',
        '/api/status': '/dashboard',
        '/api/tokens': '/dashboard'
      }
      
      const redirectPath = pageMapping[pathname]
      if (redirectPath) {
        const url = request.nextUrl.clone()
        url.pathname = redirectPath
        
        // Preserve query parameters
        const searchParams = request.nextUrl.searchParams
        url.search = searchParams.toString()
        
        return NextResponse.redirect(url)
      }
    }
    
    // For non-GET requests, return a response indicating to use server actions
    return NextResponse.json({
      success: false,
      error: 'API routes have been migrated to server actions',
      message: `Please use the ${ROUTE_MAPPINGS[pathname as keyof typeof ROUTE_MAPPINGS]} server action instead`,
      migration: {
        oldEndpoint: pathname,
        newAction: ROUTE_MAPPINGS[pathname as keyof typeof ROUTE_MAPPINGS],
        documentation: '/api-docs'
      }
    }, { status: 410 }) // 410 Gone
  }
  
  return null
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

function addSecurityHeaders(response: NextResponse): void {
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // CSP header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-ancestors 'none'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // HSTS header (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
}

// ============================================================================
// MAIN MIDDLEWARE FUNCTION
// ============================================================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for webview requests with ide_webview_request_time parameter
  const hasWebviewParam = request.nextUrl.searchParams.has('ide_webview_request_time')
  if (hasWebviewParam) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return response
  }
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      },
    });
    return response;
  }
  
  // Simplified rate limiting - only for API routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api-docs')) {
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      )
    }
  }
  
  // Continue with the request
  const response = NextResponse.next()
  
  // Handle static assets
  handleStaticAssets(request, response);
  
  // Add basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
  
  return response
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths including static assets to apply caching
     * This includes:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}