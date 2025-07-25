import { NextRequest, NextResponse } from 'next/server'
import { ROUTE_MAPPINGS, APP_CONFIG } from './lib/config'

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

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
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
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
    
    if (origin && origins.includes(origin)) {
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
  
  // Handle CORS preflight requests
  const corsResponse = handleCors(request)
  if (corsResponse) {
    return corsResponse
  }
  
  // Check rate limiting
  if (!checkRateLimit(request)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(APP_CONFIG.security.rateLimit.window / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(APP_CONFIG.security.rateLimit.window / 1000).toString(),
          'X-RateLimit-Limit': APP_CONFIG.security.rateLimit.requests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil((Date.now() + APP_CONFIG.security.rateLimit.window) / 1000).toString()
        }
      }
    )
  }
  
  // Handle API route redirection to server actions
  const redirectResponse = redirectToServerAction(request)
  if (redirectResponse) {
    return redirectResponse as NextResponse
  }
  
  // API key validation for API routes
  if (requiresApiKey(pathname)) {
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'API key required',
          message: 'Please provide a valid API key in the X-API-Key header or Authorization header',
          documentation: '/api-docs'
        },
        { status: 401 }
      )
    }
    
    if (!validateApiKey(apiKey)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid API key',
          message: 'The provided API key is invalid or expired',
          documentation: '/api-docs'
        },
        { status: 403 }
      )
    }
  }
  
  // Continue with the request
  const response = NextResponse.next()
  
  // Add security headers
  addSecurityHeaders(response)
  
  // Add CORS headers for allowed origins
  const origin = request.headers.get('origin')
  if (origin && APP_CONFIG.security.cors.origins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Add rate limit headers
  const rateLimitKey = getRateLimitKey(request)
  const rateLimitEntry = rateLimitMap.get(rateLimitKey)
  
  if (rateLimitEntry) {
    response.headers.set('X-RateLimit-Limit', APP_CONFIG.security.rateLimit.requests.toString())
    response.headers.set('X-RateLimit-Remaining', Math.max(0, APP_CONFIG.security.rateLimit.requests - rateLimitEntry.count).toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimitEntry.resetTime / 1000).toString())
  }
  
  // Add custom headers
  response.headers.set('X-Powered-By', APP_CONFIG.name)
  response.headers.set('X-Version', APP_CONFIG.version)
  
  return response
}

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}