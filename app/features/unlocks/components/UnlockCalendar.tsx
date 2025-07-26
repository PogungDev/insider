"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CalendarDays, Clock, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Eye, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"

const upcomingUnlocks = [
  {
    id: '1',
    date: '2024-01-08',
    time: '14:00 UTC',
    token: 'ARB',
    project: 'Arbitrum',
    amount: '1,110,000,000',
    value: '$2,220,000,000',
    percentage: 11.2,
    category: 'Team & Advisors',
    impact: 'high',
    marketCap: '$19.8B',
    circulatingSupply: '3.27B',
    vestingSchedule: 'Monthly linear',
    recipients: 847,
    avgHolding: '1.31M ARB'
  },
  {
    id: '2',
    date: '2024-01-10',
    time: '12:00 UTC',
    token: 'OP',
    project: 'Optimism',
    amount: '24,000,000',
    value: '$72,000,000',
    percentage: 2.4,
    category: 'Ecosystem Fund',
    impact: 'medium',
    marketCap: '$3.0B',
    circulatingSupply: '1.0B',
    vestingSchedule: 'Quarterly',
    recipients: 156,
    avgHolding: '153.8K OP'
  },
  {
    id: '3',
    date: '2024-01-12',
    time: '16:30 UTC',
    token: 'DYDX',
    project: 'dYdX',
    amount: '33,333,333',
    value: '$100,000,000',
    percentage: 3.3,
    category: 'Trading Rewards',
    impact: 'medium',
    marketCap: '$3.0B',
    circulatingSupply: '1.0B',
    vestingSchedule: 'Monthly',
    recipients: 2847,
    avgHolding: '11.7K DYDX'
  },
  {
    id: '4',
    date: '2024-01-15',
    time: '10:00 UTC',
    token: 'APT',
    project: 'Aptos',
    amount: '24,305,555',
    value: '$291,666,660',
    percentage: 2.4,
    category: 'Core Contributors',
    impact: 'high',
    marketCap: '$12.1B',
    circulatingSupply: '1.0B',
    vestingSchedule: 'Monthly linear',
    recipients: 234,
    avgHolding: '103.9K APT'
  },
  {
    id: '5',
    date: '2024-01-18',
    time: '08:00 UTC',
    token: 'SUI',
    project: 'Sui',
    amount: '64,814,814',
    value: '$129,629,628',
    percentage: 6.5,
    category: 'Early Contributors',
    impact: 'high',
    marketCap: '$2.0B',
    circulatingSupply: '1.0B',
    vestingSchedule: 'Monthly',
    recipients: 567,
    avgHolding: '114.4K SUI'
  },
  {
    id: '6',
    date: '2024-01-20',
    time: '15:45 UTC',
    token: 'IMX',
    project: 'Immutable X',
    amount: '25,000,000',
    value: '$50,000,000',
    percentage: 1.25,
    category: 'Ecosystem Development',
    impact: 'low',
    marketCap: '$4.0B',
    circulatingSupply: '2.0B',
    vestingSchedule: 'Quarterly',
    recipients: 89,
    avgHolding: '280.9K IMX'
  }
]

const historicalUnlocks = [
  {
    date: '2024-01-01',
    totalValue: '$1.2B',
    events: 8,
    avgImpact: -3.2,
    topUnlock: 'ARB - $890M'
  },
  {
    date: '2024-01-02',
    totalValue: '$450M',
    events: 3,
    avgImpact: -1.8,
    topUnlock: 'OP - $280M'
  },
  {
    date: '2024-01-03',
    totalValue: '$780M',
    events: 5,
    avgImpact: -2.5,
    topUnlock: 'DYDX - $420M'
  },
  {
    date: '2024-01-04',
    totalValue: '$2.1B',
    events: 12,
    avgImpact: -5.7,
    topUnlock: 'APT - $1.1B'
  },
  {
    date: '2024-01-05',
    totalValue: '$320M',
    events: 2,
    avgImpact: -0.9,
    topUnlock: 'SUI - $200M'
  },
  {
    date: '2024-01-06',
    totalValue: '$890M',
    events: 6,
    avgImpact: -3.1,
    topUnlock: 'IMX - $450M'
  },
  {
    date: '2024-01-07',
    totalValue: '$1.5B',
    events: 9,
    avgImpact: -4.2,
    topUnlock: 'ARB - $780M'
  }
]

const calendarData = [
  { date: 1, unlocks: [] },
  { date: 2, unlocks: [] },
  { date: 3, unlocks: [] },
  { date: 4, unlocks: [] },
  { date: 5, unlocks: [] },
  { date: 6, unlocks: [] },
  { date: 7, unlocks: [] },
  { date: 8, unlocks: [{ token: 'ARB', value: '$2.22B', impact: 'high' }] },
  { date: 9, unlocks: [] },
  { date: 10, unlocks: [{ token: 'OP', value: '$72M', impact: 'medium' }] },
  { date: 11, unlocks: [] },
  { date: 12, unlocks: [{ token: 'DYDX', value: '$100M', impact: 'medium' }] },
  { date: 13, unlocks: [] },
  { date: 14, unlocks: [] },
  { date: 15, unlocks: [{ token: 'APT', value: '$291M', impact: 'high' }] },
  { date: 16, unlocks: [] },
  { date: 17, unlocks: [] },
  { date: 18, unlocks: [{ token: 'SUI', value: '$129M', impact: 'high' }] },
  { date: 19, unlocks: [] },
  { date: 20, unlocks: [{ token: 'IMX', value: '$50M', impact: 'low' }] },
  { date: 21, unlocks: [] },
  { date: 22, unlocks: [] },
  { date: 23, unlocks: [] },
  { date: 24, unlocks: [] },
  { date: 25, unlocks: [] },
  { date: 26, unlocks: [] },
  { date: 27, unlocks: [] },
  { date: 28, unlocks: [] },
  { date: 29, unlocks: [] },
  { date: 30, unlocks: [] },
  { date: 31, unlocks: [] }
]

const summaryStats = [
  { label: 'Total Unlock Value', value: '$2.86B', change: 15.2, period: '30 days' },
  { label: 'Upcoming Events', value: 23, change: -8.1, period: '30 days' },
  { label: 'Avg Market Impact', value: '-3.2%', change: 12.5, period: '30 days' },
  { label: 'High Impact Events', value: 8, change: 25.0, period: '30 days' }
]

export function UnlockCalendar() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState('calendar')
  const [filterImpact, setFilterImpact] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMonth, setCurrentMonth] = useState('January 2024')

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Team & Advisors': return 'bg-purple-100 text-purple-700'
      case 'Ecosystem Fund': return 'bg-blue-100 text-blue-700'
      case 'Trading Rewards': return 'bg-green-100 text-green-700'
      case 'Core Contributors': return 'bg-orange-100 text-orange-700'
      case 'Early Contributors': return 'bg-pink-100 text-pink-700'
      case 'Ecosystem Development': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredUnlocks = upcomingUnlocks.filter(unlock => {
    if (filterImpact !== 'all' && unlock.impact !== filterImpact) return false
    if (filterCategory !== 'all' && unlock.category !== filterCategory) return false
    if (searchQuery && !unlock.token.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !unlock.project.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Token Unlock Calendar
        </h1>
        <div className="flex items-center gap-4">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="timeline">Timeline</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Calendar className="h-3 w-3 mr-1" />
            Unlock Tracker
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-purple-700">{stat.value}</p>
                  <p className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change}% ({stat.period})
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-purple-600" />
                  {currentMonth}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => (
                  <div key={index} 
                       className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors ${
                         selectedDate === day.date ? 'bg-purple-100 border-purple-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                       }`}
                       onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}>
                    <div className="text-sm font-medium mb-1">{day.date}</div>
                    {day.unlocks.map((unlock, unlockIndex) => (
                      <div key={unlockIndex} className={`text-xs p-1 rounded mb-1 ${getImpactColor(unlock.impact)}`}>
                        <div className="font-medium">{unlock.token}</div>
                        <div>{unlock.value}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedDate && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Unlocks on January {selectedDate}, 2024</CardTitle>
              </CardHeader>
              <CardContent>
                {calendarData.find(d => d.date === selectedDate)?.unlocks.length ? (
                  <div className="space-y-4">
                    {upcomingUnlocks
                      .filter(unlock => new Date(unlock.date).getDate() === selectedDate)
                      .map((unlock) => (
                      <div key={unlock.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {unlock.token.slice(0, 2)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{unlock.project} ({unlock.token})</h3>
                              <p className="text-sm text-gray-600">{unlock.time}</p>
                            </div>
                          </div>
                          <Badge className={getImpactColor(unlock.impact)}>
                            {unlock.impact} impact
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Amount</p>
                            <p className="font-semibold">{unlock.amount} {unlock.token}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Value</p>
                            <p className="font-semibold">{unlock.value}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">% of Supply</p>
                            <p className="font-semibold">{unlock.percentage}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Category</p>
                            <Badge className={getCategoryColor(unlock.category)}>
                              {unlock.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No unlocks scheduled for this date</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterImpact} onValueChange={setFilterImpact}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Team & Advisors">Team & Advisors</SelectItem>
                <SelectItem value="Ecosystem Fund">Ecosystem Fund</SelectItem>
                <SelectItem value="Trading Rewards">Trading Rewards</SelectItem>
                <SelectItem value="Core Contributors">Core Contributors</SelectItem>
                <SelectItem value="Early Contributors">Early Contributors</SelectItem>
                <SelectItem value="Ecosystem Development">Ecosystem Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {filteredUnlocks.map((unlock, index) => (
              <Card key={unlock.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        {unlock.token}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold">{unlock.project}</h3>
                          <Badge className={getImpactColor(unlock.impact)}>
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {unlock.impact} impact
                          </Badge>
                          <Badge className={getCategoryColor(unlock.category)}>
                            {unlock.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {unlock.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {unlock.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{unlock.value}</p>
                      <p className="text-sm text-gray-600">{unlock.amount} {unlock.token}</p>
                      <p className="text-sm text-gray-600">{unlock.percentage}% of supply</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Market Cap</p>
                        <p className="font-semibold">{unlock.marketCap}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Circulating Supply</p>
                        <p className="font-semibold">{unlock.circulatingSupply}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Recipients</p>
                        <p className="font-semibold">{unlock.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Holding</p>
                        <p className="font-semibold">{unlock.avgHolding}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Historical Unlock Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historicalUnlocks.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{day.date}</p>
                        <p className="text-sm text-gray-600">{day.events} events</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{day.totalValue}</p>
                        <p className="text-sm text-gray-600">Total Value</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${day.avgImpact < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {day.avgImpact}%
                        </p>
                        <p className="text-sm text-gray-600">Avg Impact</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-pink-600" />
                  Unlock Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Team & Advisors', 'Ecosystem Fund', 'Trading Rewards', 'Core Contributors', 'Early Contributors', 'Ecosystem Development'].map((category, index) => {
                    const count = upcomingUnlocks.filter(u => u.category === category).length
                    const totalValue = upcomingUnlocks
                      .filter(u => u.category === category)
                      .reduce((sum, u) => sum + parseFloat(u.value.replace(/[$,]/g, '')), 0)
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getCategoryColor(category)}>
                            {category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{count} events</p>
                          <p className="text-sm text-gray-600">${(totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}