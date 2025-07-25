import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function WalletSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Wallet Discovery Tool</CardTitle>
        <CardDescription className="text-slate-500">Search for any wallet address</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <Input 
            placeholder="Enter wallet address or ENS" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}