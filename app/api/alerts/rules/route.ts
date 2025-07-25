import { NextRequest, NextResponse } from 'next/server';

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
  walletFilters?: string[];
  tokenFilters?: string[];
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

interface CreateRuleRequest {
  name: string;
  description: string;
  type: AlertRule['type'];
  conditions: Omit<AlertCondition, 'id'>[];
  actions: Omit<AlertAction, 'id'>[];
  priority: AlertRule['priority'];
  walletFilters?: string[];
  tokenFilters?: string[];
}

// Mock data storage (in production, this would be a database)
let mockRules: AlertRule[] = [
  {
    id: 'rule_1',
    name: 'Large Whale Transfer',
    description: 'Alert when whale wallets transfer more than $1M',
    type: 'whale',
    conditions: [
      {
        id: 'cond_1',
        field: 'transfer_amount_usd',
        operator: 'gt',
        value: 1000000
      },
      {
        id: 'cond_2',
        field: 'wallet_type',
        operator: 'eq',
        value: 'whale',
        logicalOperator: 'AND'
      }
    ],
    actions: [
      {
        id: 'action_1',
        type: 'email',
        target: 'alerts@example.com',
        isEnabled: true
      },
      {
        id: 'action_2',
        type: 'telegram',
        target: '@whale_alerts',
        isEnabled: true
      }
    ],
    isActive: true,
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    triggeredCount: 23,
    lastTriggered: '2024-01-20T14:30:00Z'
  },
  {
    id: 'rule_2',
    name: 'Token Unlock Alert',
    description: 'Alert 24h before major token unlocks',
    type: 'unlock',
    conditions: [
      {
        id: 'cond_3',
        field: 'unlock_amount_usd',
        operator: 'gt',
        value: 500000
      },
      {
        id: 'cond_4',
        field: 'time_until_unlock',
        operator: 'lte',
        value: 86400, // 24 hours in seconds
        logicalOperator: 'AND'
      }
    ],
    actions: [
      {
        id: 'action_3',
        type: 'discord',
        target: '#unlock-alerts',
        isEnabled: true
      }
    ],
    isActive: true,
    priority: 'medium',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    triggeredCount: 7,
    lastTriggered: '2024-01-19T09:15:00Z'
  },
  {
    id: 'rule_3',
    name: 'Volume Anomaly Detection',
    description: 'Detect unusual trading volume spikes',
    type: 'anomaly',
    conditions: [
      {
        id: 'cond_5',
        field: 'volume_change_24h',
        operator: 'gt',
        value: 500 // 500% increase
      },
      {
        id: 'cond_6',
        field: 'market_cap',
        operator: 'gt',
        value: 1000000,
        logicalOperator: 'AND'
      }
    ],
    actions: [
      {
        id: 'action_4',
        type: 'webhook',
        target: 'https://api.example.com/alerts',
        isEnabled: true
      }
    ],
    isActive: true,
    priority: 'critical',
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    triggeredCount: 12,
    lastTriggered: '2024-01-21T11:45:00Z'
  }
];

function generateId(): string {
  return 'rule_' + Math.random().toString(36).substr(2, 9);
}

function generateConditionId(): string {
  return 'cond_' + Math.random().toString(36).substr(2, 9);
}

function generateActionId(): string {
  return 'action_' + Math.random().toString(36).substr(2, 9);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('active');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredRules = [...mockRules];

    // Apply filters
    if (type) {
      filteredRules = filteredRules.filter(rule => rule.type === type);
    }
    
    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredRules = filteredRules.filter(rule => rule.isActive === activeFilter);
    }
    
    if (priority) {
      filteredRules = filteredRules.filter(rule => rule.priority === priority);
    }

    // Sort by creation date (newest first)
    filteredRules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const paginatedRules = filteredRules.slice(offset, offset + limit);

    // Calculate summary statistics
    const summary = {
      totalRules: filteredRules.length,
      activeRules: filteredRules.filter(r => r.isActive).length,
      totalTriggered: filteredRules.reduce((sum, r) => sum + r.triggeredCount, 0),
      rulesByType: {
        whale: filteredRules.filter(r => r.type === 'whale').length,
        unlock: filteredRules.filter(r => r.type === 'unlock').length,
        anomaly: filteredRules.filter(r => r.type === 'anomaly').length,
        price: filteredRules.filter(r => r.type === 'price').length,
        volume: filteredRules.filter(r => r.type === 'volume').length,
        custom: filteredRules.filter(r => r.type === 'custom').length
      },
      rulesByPriority: {
        low: filteredRules.filter(r => r.priority === 'low').length,
        medium: filteredRules.filter(r => r.priority === 'medium').length,
        high: filteredRules.filter(r => r.priority === 'high').length,
        critical: filteredRules.filter(r => r.priority === 'critical').length
      }
    };

    return NextResponse.json({
      success: true,
      data: paginatedRules,
      summary,
      pagination: {
        total: filteredRules.length,
        limit,
        offset,
        hasMore: offset + limit < filteredRules.length
      }
    });
  } catch (error) {
    console.error('Alert rules GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert rules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateRuleRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.type || !body.conditions || !body.actions) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate conditions
    if (body.conditions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one condition is required' },
        { status: 400 }
      );
    }

    // Validate actions
    if (body.actions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one action is required' },
        { status: 400 }
      );
    }

    // Create new rule
    const newRule: AlertRule = {
      id: generateId(),
      name: body.name,
      description: body.description || '',
      type: body.type,
      conditions: body.conditions.map(condition => ({
        ...condition,
        id: generateConditionId()
      })),
      actions: body.actions.map(action => ({
        ...action,
        id: generateActionId()
      })),
      isActive: true,
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      triggeredCount: 0,
      walletFilters: body.walletFilters,
      tokenFilters: body.tokenFilters
    };

    // Add to mock storage
    mockRules.push(newRule);

    // In production, this would:
    // 1. Save to database
    // 2. Deploy rule to CosmWasm AlertRegistry contract
    // 3. Update monitoring systems
    // 4. Send confirmation notifications

    return NextResponse.json({
      success: true,
      data: newRule,
      message: 'Alert rule created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Alert rules POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create alert rule' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const ruleIndex = mockRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Update rule
    const updatedRule = {
      ...mockRules[ruleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update conditions and actions with IDs if provided
    if (updates.conditions) {
      updatedRule.conditions = updates.conditions.map((condition: any) => ({
        ...condition,
        id: condition.id || generateConditionId()
      }));
    }

    if (updates.actions) {
      updatedRule.actions = updates.actions.map((action: any) => ({
        ...action,
        id: action.id || generateActionId()
      }));
    }

    mockRules[ruleIndex] = updatedRule;

    return NextResponse.json({
      success: true,
      data: updatedRule,
      message: 'Alert rule updated successfully'
    });
  } catch (error) {
    console.error('Alert rules PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update alert rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Rule ID is required' },
        { status: 400 }
      );
    }

    const ruleIndex = mockRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Rule not found' },
        { status: 404 }
      );
    }

    // Remove rule
    const deletedRule = mockRules.splice(ruleIndex, 1)[0];

    // In production, this would:
    // 1. Remove from database
    // 2. Remove from CosmWasm AlertRegistry contract
    // 3. Stop monitoring for this rule
    // 4. Send confirmation notifications

    return NextResponse.json({
      success: true,
      data: deletedRule,
      message: 'Alert rule deleted successfully'
    });
  } catch (error) {
    console.error('Alert rules DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert rule' },
      { status: 500 }
    );
  }
}