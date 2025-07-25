import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { APP_CONFIG } from './config'

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date)
  
  if (format === 'relative') {
    return formatRelativeTime(d)
  }
  
  const options: Intl.DateTimeFormatOptions = format === 'long' 
    ? { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }
    : { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }
  
  return d.toLocaleDateString('en-US', options)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays}d ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears}y ago`
}

export function getTimeframeLabel(timeframe: string): string {
  const labels: Record<string, string> = {
    '1h': 'Last Hour',
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 3 Months',
    '1y': 'Last Year',
    'all': 'All Time'
  }
  
  return labels[timeframe] || timeframe
}

// ============================================================================
// NUMBER & CURRENCY FORMATTING
// ============================================================================

export function formatNumber(num: number, options: {
  decimals?: number
  compact?: boolean
  currency?: boolean
  percentage?: boolean
} = {}): string {
  const { decimals = 2, compact = false, currency = false, percentage = false } = options
  
  if (percentage) {
    return `${(num * 100).toFixed(decimals)}%`
  }
  
  if (compact && Math.abs(num) >= 1000) {
    const units = ['', 'K', 'M', 'B', 'T']
    const unitIndex = Math.floor(Math.log10(Math.abs(num)) / 3)
    const scaledNum = num / Math.pow(1000, unitIndex)
    const formatted = scaledNum.toFixed(decimals)
    
    return currency 
      ? `$${formatted}${units[unitIndex]}`
      : `${formatted}${units[unitIndex]}`
  }
  
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  
  return currency ? `$${formatted}` : formatted
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

export function formatTokenAmount(amount: string | number, decimals: number = 18, displayDecimals: number = 6): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  const scaled = num / Math.pow(10, decimals)
  
  if (scaled === 0) return '0'
  if (scaled < 0.000001) return '<0.000001'
  
  return scaled.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: displayDecimals
  })
}

// ============================================================================
// ADDRESS & HASH UTILITIES
// ============================================================================

export function truncateAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length <= startChars + endChars) {
    return address
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export function truncateHash(hash: string, length: number = 8): string {
  if (!hash || hash.length <= length) {
    return hash
  }
  
  return `${hash.slice(0, length)}...`
}

export function isValidAddress(address: string): boolean {
  // Basic validation for Ethereum-style addresses
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function isValidHash(hash: string): boolean {
  // Basic validation for transaction hashes
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

// ============================================================================
// RISK & SCORING UTILITIES
// ============================================================================

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score <= 30) return 'low'
  if (score <= 70) return 'medium'
  return 'high'
}

export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-red-600 bg-red-50'
  }
  
  return colors[level]
}

export function getWhaleTier(balance: number): 'minnow' | 'dolphin' | 'whale' | 'humpback' {
  if (balance < 1000) return 'minnow'
  if (balance < 10000) return 'dolphin'
  if (balance < 100000) return 'whale'
  return 'humpback'
}

export function getWhaleTierColor(tier: 'minnow' | 'dolphin' | 'whale' | 'humpback'): string {
  const colors = {
    minnow: 'text-gray-600 bg-gray-50',
    dolphin: 'text-blue-600 bg-blue-50',
    whale: 'text-purple-600 bg-purple-50',
    humpback: 'text-orange-600 bg-orange-50'
  }
  
  return colors[tier]
}

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const success = document.execCommand('copy')
      textArea.remove()
      return success
    }
  } catch {
    return false
  }
}
