"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Wallet, Target, CheckCircle, AlertCircle } from "lucide-react"
import { useWallet } from "@/app/(core)/providers/WalletProvider"

interface WalletSelectorProps {
  onWalletSelected?: (address: string) => void
  className?: string
}

export function WalletSelector({ onWalletSelected, className }: WalletSelectorProps) {
  const [inputAddress, setInputAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const { selectedWallet, setSelectedWallet } = useWallet()

  // Mock recent wallets for quick selection
  const recentWallets = [
    {
      address: "sei1abc123def456ghi789jkl012mno345pqr678stu901",
      label: "DeFi Alpha Hunter",
      lastAnalyzed: "2 hours ago",
      riskLevel: "low" as const
    },
    {
      address: "sei1xyz789abc123def456ghi789jkl012mno345pqr678",
      label: "Whale Arbitrageur", 
      lastAnalyzed: "1 day ago",
      riskLevel: "medium" as const
    },
    {
      address: "sei1mno456pqr789stu012vwx345yza678bcd901efg234",
      label: "Institutional Flow",
      lastAnalyzed: "3 days ago", 
      riskLevel: "low" as const
    }
  ]

  const validateSeiAddress = (address: string): boolean => {
    // Basic Sei address validation
    return address.startsWith('sei1') && address.length >= 39 && address.length <= 45
  }

  const handleAddressChange = (value: string) => {
    setInputAddress(value)
    if (value.length > 10) {
      const isValid = validateSeiAddress(value)
      setValidationStatus(isValid ? 'valid' : 'invalid')
    } else {
      setValidationStatus('idle')
    }
  }

  const { startAnalysis } = useWallet()

  const handleAnalyzeWallet = () => {
    if (validationStatus === 'valid') {
      setSelectedWallet(inputAddress)
      startAnalysis(inputAddress)
      onWalletSelected?.(inputAddress)
    }
  }

  const handleQuickSelect = (address: string) => {
    setInputAddress(address)
    setSelectedWallet(address)
    setValidationStatus('valid')
    startAnalysis(address)
    onWalletSelected?.(address)
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Wallet Analysis Target
          </CardTitle>
          <CardDescription>
            Enter a Sei wallet address to begin behavioral analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Selection */}
          {selectedWallet && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Currently Analyzing</span>
              </div>
              <div className="text-sm text-blue-700 font-mono break-all">
                {selectedWallet}
              </div>
            </div>
          )}

          {/* Address Input */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="sei1abc123def456ghi789..."
                value={inputAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {validationStatus !== 'idle' && (
                <div className="absolute right-3 top-3">
                  {validationStatus === 'valid' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {validationStatus === 'invalid' && (
              <p className="text-sm text-red-600">
                Please enter a valid Sei address (starts with 'sei1')
              </p>
            )}

            <Button 
              onClick={handleAnalyzeWallet}
              disabled={validationStatus !== 'valid'}
              className="w-full"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          </div>

          {/* Recent Wallets */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Recent Analyses</h4>
            <div className="space-y-2">
              {recentWallets.map((wallet, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleQuickSelect(wallet.address)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{wallet.label}</span>
                    <Badge className={getRiskBadgeColor(wallet.riskLevel)}>
                      {wallet.riskLevel} risk
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 font-mono break-all mb-1">
                    {wallet.address}
                  </div>
                  <div className="text-xs text-gray-400">
                    Last analyzed: {wallet.lastAnalyzed}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
