'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Brain, Settings, Trash2, Edit, MessageSquare } from 'lucide-react';
import { useDataContext } from '@/contexts/data-context';
import { toast } from 'sonner';

export function RuleBuilder() {
  const { state, dispatch } = useDataContext();
  const [naturalLanguageRule, setNaturalLanguageRule] = useState('');
  const [isProcessingNL, setIsProcessingNL] = useState(false);
  const [newRule, setNewRule] = useState({
    type: 'coRun' as const,
    name: '',
    description: '',
    parameters: {}
  });

  const processNaturalLanguageRule = async () => {
    if (!naturalLanguageRule.trim()) return;
    
    setIsProcessingNL(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock rule generation
    const generatedRule = {
      id: `rule-${Date.now()}`,
      type: 'coRun' as const,
      name: 'AI Generated Co-run Rule',
      description: `Generated from: "${naturalLanguageRule}"`,
      parameters: {
        tasks: ['T1', 'T2'],
        condition: naturalLanguageRule
      },
      enabled: true
    };

    dispatch({ type: 'ADD_RULE', payload: generatedRule });
    setNaturalLanguageRule('');
    setIsProcessingNL(false);
    
    toast.success('AI rule generated successfully');
  };

  const addManualRule = () => {
    if (!newRule.name.trim()) {
      toast.error('Please enter a rule name');
      return;
    }

    const rule = {
      id: `rule-${Date.now()}`,
      ...newRule,
      enabled: true
    };

    dispatch({ type: 'ADD_RULE', payload: rule });
    setNewRule({
      type: 'coRun',
      name: '',
      description: '',
      parameters: {}
    });
    
    toast.success('Rule added successfully');
  };

  const deleteRule = (ruleId: string) => {
    dispatch({ type: 'DELETE_RULE', payload: ruleId });
    toast.success('Rule deleted');
  };

  const toggleRule = (ruleId: string, enabled: boolean) => {
    const rule = state.rules.find(r => r.id === ruleId);
    if (rule) {
      dispatch({ 
        type: 'UPDATE_RULE', 
        payload: { 
          id: ruleId, 
          rule: { ...rule, enabled } 
        } 
      });
    }
  };

  const ruleTypes = [
    { value: 'coRun', label: 'Co-Run Tasks', description: 'Tasks that must run together' },
    { value: 'slotRestriction', label: 'Slot Restriction', description: 'Limit available slots for groups' },
    { value: 'loadLimit', label: 'Load Limit', description: 'Maximum load per worker group' },
    { value: 'phaseWindow', label: 'Phase Window', description: 'Restrict tasks to specific phases' },
    { value: 'patternMatch', label: 'Pattern Match', description: 'Rules based on data patterns' },
    { value: 'precedence', label: 'Precedence', description: 'Task execution order' }
  ];

  return (
    <div className="space-y-6">
      {/* Natural Language Rule Input */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Natural Language Rule Builder
          </CardTitle>
          <CardDescription>
            Describe your business rule in plain English and let AI convert it to configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nl-rule">Describe your rule</Label>
            <Textarea
              id="nl-rule"
              placeholder="e.g., Tasks T12 and T14 should always run together in the same phase, and they require workers with Python skills"
              value={naturalLanguageRule}
              onChange={(e) => setNaturalLanguageRule(e.target.value)}
              className="min-h-24"
            />
          </div>
          <Button 
            onClick={processNaturalLanguageRule}
            disabled={isProcessingNL || !naturalLanguageRule.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isProcessingNL ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Generate Rule
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Rule Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Manual Rule Builder
          </CardTitle>
          <CardDescription>
            Create rules using the traditional interface for precise control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                placeholder="Enter rule name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select 
                value={newRule.type} 
                onValueChange={(value: any) => setNewRule({ ...newRule, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ruleTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rule-description">Description</Label>
            <Textarea
              id="rule-description"
              placeholder="Describe what this rule does"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            />
          </div>

          <Button onClick={addManualRule} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* Active Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rules ({state.rules.length})</CardTitle>
          <CardDescription>
            Manage your business rules and their priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No rules configured yet. Add your first rule above.
            </div>
          ) : (
            <div className="space-y-4">
              {state.rules.map((rule, index) => (
                <div key={rule.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Badge variant="outline">{rule.type}</Badge>
                        {rule.enabled && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(enabled) => toggleRule(rule.id, enabled)}
                      />
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {Object.keys(rule.parameters).length > 0 && (
                    <>
                      <Separator />
                      <div className="text-xs space-y-1">
                        <p className="font-medium">Parameters:</p>
                        <pre className="text-muted-foreground bg-gray-50 p-2 rounded">
                          {JSON.stringify(rule.parameters, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Recommendations */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            AI Rule Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">Co-run Opportunity Detected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tasks T12 and T14 are frequently requested together. Consider adding a co-run rule.
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Add Rule
                </Button>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">Load Balance Suggestion</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    GroupA workers are consistently overloaded. Consider adding load limits.
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Add Rule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}