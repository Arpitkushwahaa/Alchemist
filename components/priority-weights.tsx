'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Scale as Scales, TrendingUp, Settings, Shuffle } from 'lucide-react';
import { useDataContext } from '@/contexts/data-context';
import { toast } from 'sonner';

const presetProfiles = {
  'maximize-fulfillment': {
    name: 'Maximize Fulfillment',
    description: 'Prioritize completing as many requested tasks as possible',
    weights: {
      'Priority Level': 0.4,
      'Task Fulfillment': 0.3,
      'Skill Match': 0.15,
      'Load Balance': 0.1,
      'Phase Preference': 0.05
    }
  },
  'fair-distribution': {
    name: 'Fair Distribution',
    description: 'Balance workload evenly across all workers',
    weights: {
      'Priority Level': 0.15,
      'Task Fulfillment': 0.2,
      'Skill Match': 0.2,
      'Load Balance': 0.35,
      'Phase Preference': 0.1
    }
  },
  'skill-optimization': {
    name: 'Skill Optimization',
    description: 'Match tasks to workers with the best skill fit',
    weights: {
      'Priority Level': 0.2,
      'Task Fulfillment': 0.2,
      'Skill Match': 0.4,
      'Load Balance': 0.15,
      'Phase Preference': 0.05
    }
  }
};

export function PriorityWeights() {
  const { state, dispatch } = useDataContext();
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const updateWeight = (criterion: string, value: number) => {
    const newPriorities = {
      ...state.priorities,
      [criterion]: value / 100
    };
    dispatch({ type: 'SET_PRIORITIES', payload: newPriorities });
  };

  const applyPreset = (presetKey: string) => {
    const preset = presetProfiles[presetKey as keyof typeof presetProfiles];
    if (preset) {
      dispatch({ type: 'SET_PRIORITIES', payload: preset.weights });
      toast.success(`Applied ${preset.name} preset`);
    }
  };

  const normalizeWeights = () => {
    const total = Object.values(state.priorities).reduce((sum, weight) => sum + weight, 0);
    const normalized = Object.fromEntries(
      Object.entries(state.priorities).map(([key, weight]) => [key, weight / total])
    );
    dispatch({ type: 'SET_PRIORITIES', payload: normalized });
    toast.success('Weights normalized to sum to 1.0');
  };

  const chartData = Object.entries(state.priorities).map(([name, weight]) => ({
    name: name.replace(' ', '\n'),
    weight: (weight * 100).toFixed(1),
    value: weight * 100
  }));

  return (
    <div className="space-y-6">
      {/* Preset Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Quick Start Presets
          </CardTitle>
          <CardDescription>
            Choose a pre-configured weighting profile or customize your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(presetProfiles).map(([key, preset]) => (
              <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium">{preset.name}</h3>
                      <p className="text-xs text-muted-foreground">{preset.description}</p>
                    </div>
                    <div className="space-y-1">
                      {Object.entries(preset.weights).map(([criterion, weight]) => (
                        <div key={criterion} className="flex justify-between text-xs">
                          <span className="truncate">{criterion}:</span>
                          <span className="font-mono">{(weight * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => applyPreset(key)}
                    >
                      Apply Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weight Configuration */}
      <Tabs defaultValue="sliders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sliders">Sliders</TabsTrigger>
          <TabsTrigger value="matrix">Pairwise</TabsTrigger>
          <TabsTrigger value="visualization">Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="sliders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scales className="h-5 w-5" />
                Priority Weights
              </CardTitle>
              <CardDescription>
                Adjust the relative importance of each allocation criterion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(state.priorities).map(([criterion, weight]) => (
                <div key={criterion} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={criterion}>{criterion}</Label>
                    <Badge variant="outline" className="font-mono">
                      {(weight * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <Slider
                    id={criterion}
                    value={[weight * 100]}
                    onValueChange={([value]) => updateWeight(criterion, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Priority</span>
                    <span>High Priority</span>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total: {(Object.values(state.priorities).reduce((sum, w) => sum + w, 0) * 100).toFixed(1)}%
                </div>
                <Button variant="outline" onClick={normalizeWeights}>
                  Normalize Weights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix">
          <Card>
            <CardHeader>
              <CardTitle>Pairwise Comparison Matrix</CardTitle>
              <CardDescription>
                Compare criteria against each other to determine relative importance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Pairwise comparison matrix coming soon...</p>
                <p className="text-xs">This will implement the Analytic Hierarchy Process (AHP)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weight Distribution
              </CardTitle>
              <CardDescription>
                Visual representation of your priority weights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis 
                      label={{ value: 'Weight (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Weight']}
                      labelFormatter={(label) => label.replace('\n', ' ')}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Impact Preview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle>Allocation Impact Preview</CardTitle>
          <CardDescription>
            See how your weight settings would affect resource allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Predicted Outcomes</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>High-priority tasks fulfilled:</span>
                  <span className="font-mono">87%</span>
                </div>
                <div className="flex justify-between">
                  <span>Average worker utilization:</span>
                  <span className="font-mono">72%</span>
                </div>
                <div className="flex justify-between">
                  <span>Skill mismatch instances:</span>
                  <span className="font-mono">5</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Trade-offs</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Higher task fulfillment may reduce load balance</p>
                <p>• Skill optimization might increase wait times</p>
                <p>• Phase preferences could conflict with priorities</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}