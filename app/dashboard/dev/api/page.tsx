'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Settings, Activity, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  description: string;
  key: string;
  keyPreview: string;
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
    lastUsed?: string;
  };
  status: 'active' | 'inactive' | 'revoked';
  createdAt: string;
  expiresAt?: string;
  ipWhitelist: string[];
  webhookUrl?: string;
}

interface ApiUsage {
  timestamp: string;
  requests: number;
  endpoint: string;
  statusCode: number;
  responseTime: number;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [usageData, setUsageData] = useState<ApiUsage[]>([]);
  const [summary, setSummary] = useState({
    totalKeys: 0,
    activeKeys: 0,
    totalRequests: 0,
    requestsToday: 0,
    avgResponseTime: 0,
    topEndpoints: [] as { endpoint: string; requests: number }[]
  });

  // Form state for creating API keys
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    rateLimit: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    },
    expiresAt: '',
    ipWhitelist: [''],
    webhookUrl: ''
  });

  const availablePermissions = [
    { id: 'wallets:read', name: 'Read Wallets', description: 'Access wallet information and balances' },
    { id: 'wallets:write', name: 'Write Wallets', description: 'Create and update wallet tracking' },
    { id: 'alerts:read', name: 'Read Alerts', description: 'Access alert configurations and history' },
    { id: 'alerts:write', name: 'Write Alerts', description: 'Create and manage alert rules' },
    { id: 'analytics:read', name: 'Read Analytics', description: 'Access analytics and insights data' },
    { id: 'reports:read', name: 'Read Reports', description: 'Access generated reports' },
    { id: 'reports:write', name: 'Write Reports', description: 'Generate and manage reports' },
    { id: 'admin:read', name: 'Admin Read', description: 'Administrative read access' },
    { id: 'admin:write', name: 'Admin Write', description: 'Administrative write access' }
  ];

  useEffect(() => {
    fetchApiKeys();
    fetchUsageData();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dev/keys');
      const data = await response.json();
      
      if (data.success) {
        setApiKeys(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/dev/usage');
      const data = await response.json();
      
      if (data.success) {
        setUsageData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    }
  };

  const createApiKey = async () => {
    try {
      const response = await fetch('/api/dev/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchApiKeys();
        toast.success('API key created successfully');
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/dev/keys/${keyId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchApiKeys();
        toast.success('API key revoked successfully');
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const toggleKeyStatus = async (keyId: string, status: 'active' | 'inactive') => {
    try {
      const response = await fetch(`/api/dev/keys/${keyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchApiKeys();
        toast.success(`API key ${status === 'active' ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error('Failed to update API key:', error);
      toast.error('Failed to update API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
      rateLimit: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      expiresAt: '',
      ipWhitelist: [''],
      webhookUrl: ''
    });
  };

  const addIpAddress = () => {
    setFormData({
      ...formData,
      ipWhitelist: [...formData.ipWhitelist, '']
    });
  };

  const removeIpAddress = (index: number) => {
    setFormData({
      ...formData,
      ipWhitelist: formData.ipWhitelist.filter((_, i) => i !== index)
    });
  };

  const updateIpAddress = (index: number, value: string) => {
    const newIpList = [...formData.ipWhitelist];
    newIpList[index] = value;
    setFormData({ ...formData, ipWhitelist: newIpList });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'revoked': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Key className="mr-3 h-8 w-8 text-blue-600" />
            API Keys
          </h1>
          <p className="text-muted-foreground">Manage your API keys and access permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions and rate limits
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Key Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter API key name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the purpose of this API key"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Rate Limits</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Per Minute</Label>
                        <Input
                          type="number"
                          value={formData.rateLimit.requestsPerMinute}
                          onChange={(e) => setFormData({
                            ...formData,
                            rateLimit: { ...formData.rateLimit, requestsPerMinute: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Per Hour</Label>
                        <Input
                          type="number"
                          value={formData.rateLimit.requestsPerHour}
                          onChange={(e) => setFormData({
                            ...formData,
                            rateLimit: { ...formData.rateLimit, requestsPerHour: Number(e.target.value) }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Per Day</Label>
                        <Input
                          type="number"
                          value={formData.rateLimit.requestsPerDay}
                          onChange={(e) => setFormData({
                            ...formData,
                            rateLimit: { ...formData.rateLimit, requestsPerDay: Number(e.target.value) }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-semibold">API Permissions</h4>
                  <div className="space-y-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                permissions: [...formData.permissions, permission.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                permissions: formData.permissions.filter(p => p !== permission.id)
                              });
                            }
                          }}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor={permission.id} className="font-medium">
                            {permission.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>IP Whitelist (Optional)</Label>
                    <p className="text-sm text-muted-foreground">Restrict API key usage to specific IP addresses</p>
                    {formData.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={ip}
                          onChange={(e) => updateIpAddress(index, e.target.value)}
                          placeholder="Enter IP address (e.g., 192.168.1.1)"
                        />
                        {formData.ipWhitelist.length > 1 && (
                          <Button variant="outline" size="sm" onClick={() => removeIpAddress(index)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addIpAddress}>
                      Add IP Address
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                    <Input
                      id="webhookUrl"
                      value={formData.webhookUrl}
                      onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                      placeholder="https://your-webhook-url.com/endpoint"
                    />
                    <p className="text-sm text-muted-foreground">Receive notifications about API key usage</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey}>
                Create API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Keys</p>
                <p className="text-2xl font-bold">{summary.totalKeys}</p>
              </div>
              <Key className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Keys</p>
                <p className="text-2xl font-bold text-green-600">{summary.activeKeys}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{formatNumber(summary.totalRequests)}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{formatNumber(summary.requestsToday)}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{summary.avgResponseTime}ms</p>
              </div>
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys and monitor their usage</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading API keys...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{apiKey.name}</div>
                        <div className="text-sm text-muted-foreground">{apiKey.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showKey[apiKey.id] ? apiKey.key : apiKey.keyPreview}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                        >
                          {showKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(apiKey.status)} text-white`}>
                          {apiKey.status.toUpperCase()}
                        </Badge>
                        <Switch
                          checked={apiKey.status === 'active'}
                          onCheckedChange={(checked) => 
                            toggleKeyStatus(apiKey.id, checked ? 'active' : 'inactive')
                          }
                          disabled={apiKey.status === 'revoked'}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {apiKey.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.split(':')[0]}
                          </Badge>
                        ))}
                        {apiKey.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{apiKey.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatNumber(apiKey.usage.totalRequests)}</div>
                        <div className="text-sm text-muted-foreground">
                          Today: {formatNumber(apiKey.usage.requestsToday)}
                        </div>
                        {apiKey.usage.lastUsed && (
                          <div className="text-xs text-muted-foreground">
                            Last: {formatDate(apiKey.usage.lastUsed)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDate(apiKey.createdAt)}</div>
                        {apiKey.expiresAt && (
                          <div className="text-sm text-muted-foreground">
                            Expires: {formatDate(apiKey.expiresAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" onClick={() => setSelectedKey(apiKey)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => revokeApiKey(apiKey.id)}
                          disabled={apiKey.status === 'revoked'}
                        >
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