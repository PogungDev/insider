'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, Trash2, Edit, Play, Pause, AlertTriangle, Bell, Zap } from 'lucide-react';

interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: 'whale' | 'unlock' | 'anomaly' | 'price' | 'volume' | 'custom';
  conditions: AlertCondition[];
  actions: AlertAction[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  triggeredCount: number;
  lastTriggered?: string;
}

interface AlertCondition {
  id: string;
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' | 'in';
  value: string | number;
  logicalOperator?: 'AND' | 'OR';
}

interface AlertAction {
  id: string;
  type: 'email' | 'telegram' | 'discord' | 'webhook' | 'sms';
  target: string;
  template?: string;
  isEnabled: boolean;
}

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [summary, setSummary] = useState({
    totalRules: 0,
    activeRules: 0,
    totalTriggered: 0,
    rulesByType: {} as Record<string, number>,
    rulesByPriority: {} as Record<string, number>
  });

  // Form state for creating/editing rules
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'whale' as AlertRule['type'],
    priority: 'medium' as AlertRule['priority'],
    conditions: [{ field: '', operator: 'gt' as const, value: '', logicalOperator: undefined }],
    actions: [{ type: 'email' as const, target: '', isEnabled: true }]
  });

  useEffect(() => {
    fetchRules();
  }, [selectedType, selectedPriority]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType !== 'all') params.append('type', selectedType);
      if (selectedPriority !== 'all') params.append('priority', selectedPriority);
      
      const response = await fetch(`/api/alerts/rules?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRules(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    try {
      const response = await fetch('/api/alerts/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchRules();
      }
    } catch (error) {
      console.error('Failed to create rule:', error);
    }
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/alerts/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, isActive })
      });
      
      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const response = await fetch(`/api/alerts/rules?id=${ruleId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchRules();
      }
    } catch (error) {
      console.error('Failed to delete rule:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'whale',
      priority: 'medium',
      conditions: [{ field: '', operator: 'gt', value: '', logicalOperator: undefined }],
      actions: [{ type: 'email', target: '', isEnabled: true }]
    });
    setEditingRule(null);
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: '', operator: 'gt', value: '', logicalOperator: 'AND' }]
    });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index)
    });
  };

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'email', target: '', isEnabled: true }]
    });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index)
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whale': return <Zap className="h-4 w-4" />;
      case 'unlock': return <Bell className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Settings className="mr-3 h-8 w-8 text-blue-600" />
            Alert Rules
          </h1>
          <p className="text-muted-foreground">Create and manage custom alert rules for monitoring</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Alert Rule</DialogTitle>
              <DialogDescription>
                Set up conditions and actions for your custom alert rule
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter rule name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Rule Type</Label>
                    <Select value={formData.type} onValueChange={(value: AlertRule['type']) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whale">Whale Activity</SelectItem>
                        <SelectItem value="unlock">Token Unlocks</SelectItem>
                        <SelectItem value="anomaly">Anomaly Detection</SelectItem>
                        <SelectItem value="price">Price Movement</SelectItem>
                        <SelectItem value="volume">Volume Changes</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this rule monitors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value: AlertRule['priority']) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Conditions</h4>
                    <Button variant="outline" size="sm" onClick={addCondition}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>
                  
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      {index > 0 && (
                        <Select 
                          value={condition.logicalOperator || 'AND'} 
                          onValueChange={(value: 'AND' | 'OR') => {
                            const newConditions = [...formData.conditions];
                            newConditions[index].logicalOperator = value;
                            setFormData({ ...formData, conditions: newConditions });
                          }}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AND">AND</SelectItem>
                            <SelectItem value="OR">OR</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      
                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <Label>Field</Label>
                          <Select 
                            value={condition.field} 
                            onValueChange={(value) => {
                              const newConditions = [...formData.conditions];
                              newConditions[index].field = value;
                              setFormData({ ...formData, conditions: newConditions });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="transfer_amount_usd">Transfer Amount (USD)</SelectItem>
                              <SelectItem value="wallet_balance">Wallet Balance</SelectItem>
                              <SelectItem value="volume_24h">24h Volume</SelectItem>
                              <SelectItem value="price_change_24h">24h Price Change</SelectItem>
                              <SelectItem value="market_cap">Market Cap</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Operator</Label>
                          <Select 
                            value={condition.operator} 
                            onValueChange={(value: AlertCondition['operator']) => {
                              const newConditions = [...formData.conditions];
                              newConditions[index].operator = value;
                              setFormData({ ...formData, conditions: newConditions });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gt">Greater than</SelectItem>
                              <SelectItem value="gte">Greater than or equal</SelectItem>
                              <SelectItem value="lt">Less than</SelectItem>
                              <SelectItem value="lte">Less than or equal</SelectItem>
                              <SelectItem value="eq">Equal to</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Value</Label>
                          <Input
                            value={condition.value}
                            onChange={(e) => {
                              const newConditions = [...formData.conditions];
                              newConditions[index].value = e.target.value;
                              setFormData({ ...formData, conditions: newConditions });
                            }}
                            placeholder="Enter value"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          {formData.conditions.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeCondition(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Actions</h4>
                    <Button variant="outline" size="sm" onClick={addAction}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </Button>
                  </div>
                  
                  {formData.actions.map((action, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Action Type</Label>
                          <Select 
                            value={action.type} 
                            onValueChange={(value: AlertAction['type']) => {
                              const newActions = [...formData.actions];
                              newActions[index].type = value;
                              setFormData({ ...formData, actions: newActions });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="telegram">Telegram</SelectItem>
                              <SelectItem value="discord">Discord</SelectItem>
                              <SelectItem value="webhook">Webhook</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Target</Label>
                          <Input
                            value={action.target}
                            onChange={(e) => {
                              const newActions = [...formData.actions];
                              newActions[index].target = e.target.value;
                              setFormData({ ...formData, actions: newActions });
                            }}
                            placeholder={action.type === 'email' ? 'email@example.com' : action.type === 'telegram' ? '@username' : 'Target'}
                          />
                        </div>
                        
                        <div className="flex items-end space-x-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={action.isEnabled}
                              onCheckedChange={(checked) => {
                                const newActions = [...formData.actions];
                                newActions[index].isEnabled = checked;
                                setFormData({ ...formData, actions: newActions });
                              }}
                            />
                            <Label>Enabled</Label>
                          </div>
                          {formData.actions.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeAction(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createRule}>
                Create Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{summary.totalRules}</p>
              </div>
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">{summary.activeRules}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Triggered</p>
                <p className="text-2xl font-bold">{summary.totalTriggered}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Rules</p>
                <p className="text-2xl font-bold text-red-600">{summary.rulesByPriority.critical || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Rules Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Manage your custom alert rules and monitoring conditions</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="whale">Whale</SelectItem>
                  <SelectItem value="unlock">Unlock</SelectItem>
                  <SelectItem value="anomaly">Anomaly</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading alert rules...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Triggered</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(rule.type)}
                        <span className="capitalize">{rule.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(rule.priority)} text-white`}>
                        {rule.priority.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={rule.isActive}
                          onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                        />
                        <span className={rule.isActive ? 'text-green-600' : 'text-gray-500'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{rule.triggeredCount}</span>
                    </TableCell>
                    <TableCell>
                      {rule.lastTriggered ? formatDate(rule.lastTriggered) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => setEditingRule(rule)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}