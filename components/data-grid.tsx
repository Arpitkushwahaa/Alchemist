'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Edit3, Save, X } from 'lucide-react';
import { useDataContext } from '@/contexts/data-context';
import { toast } from 'sonner';

export function DataGrid() {
  const { state, dispatch } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    toast.success('AI search processing...', {
      description: `Searching for: "${searchQuery}"`
    });
  };

  const startEdit = (cellId: string, currentValue: string) => {
    setEditingCell(cellId);
    setEditValue(currentValue);
  };

  const saveEdit = (entityType: 'clients' | 'workers' | 'tasks', index: number, field: string) => {
    // Update the specific field in the entity
    if (entityType === 'clients') {
      const updatedClient = { ...state.clients[index], [field]: editValue };
      dispatch({ type: 'UPDATE_CLIENT', payload: { index, client: updatedClient } });
    }
    // Similar logic for workers and tasks...
    
    setEditingCell(null);
    setEditValue('');
    toast.success('Cell updated successfully');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const renderEditableCell = (value: string, cellId: string, entityType: 'clients' | 'workers' | 'tasks', index: number, field: string) => {
    const isEditing = editingCell === cellId;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => saveEdit(entityType, index, field)}
            className="h-8 w-8 p-0"
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={cancelEdit}
            className="h-8 w-8 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-1 rounded"
        onClick={() => startEdit(cellId, value)}
      >
        <span className="truncate">{value}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI Search */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Natural Language Search
          </CardTitle>
          <CardDescription>
            Search your data using plain English. Try: "All tasks with duration more than 2 phases"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., High priority clients in GroupA with budget over 100000"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              AI Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <Tabs defaultValue="clients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients" className="flex items-center gap-2">
            Clients
            <Badge variant="secondary">{state.clients.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center gap-2">
            Workers
            <Badge variant="secondary">{state.workers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            Tasks
            <Badge variant="secondary">{state.tasks.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Clients Data</CardTitle>
              <CardDescription>
                Click on any cell to edit inline. Changes are saved automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Client ID</th>
                      <th className="text-left p-3 font-medium">Name</th>
                      <th className="text-left p-3 font-medium">Priority</th>
                      <th className="text-left p-3 font-medium">Requested Tasks</th>
                      <th className="text-left p-3 font-medium">Group</th>
                      <th className="text-left p-3 font-medium">Attributes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.clients.map((client, index) => (
                      <tr key={client.ClientID} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {renderEditableCell(client.ClientID, `client-${index}-id`, 'clients', index, 'ClientID')}
                        </td>
                        <td className="p-3">
                          {renderEditableCell(client.ClientName, `client-${index}-name`, 'clients', index, 'ClientName')}
                        </td>
                        <td className="p-3">
                          <Badge variant={client.PriorityLevel >= 4 ? 'destructive' : client.PriorityLevel >= 3 ? 'default' : 'secondary'}>
                            {client.PriorityLevel}
                          </Badge>
                        </td>
                        <td className="p-3 max-w-xs">
                          {renderEditableCell(client.RequestedTaskIDs, `client-${index}-tasks`, 'clients', index, 'RequestedTaskIDs')}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{client.GroupTag}</Badge>
                        </td>
                        <td className="p-3 max-w-xs">
                          {renderEditableCell(client.AttributesJSON, `client-${index}-attrs`, 'clients', index, 'AttributesJSON')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {state.clients.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No client data uploaded. Please upload a clients CSV file.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle>Workers Data</CardTitle>
              <CardDescription>
                Manage worker information including skills, availability, and load capacity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No worker data uploaded. Please upload a workers CSV file.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Data</CardTitle>
              <CardDescription>
                View and edit task definitions including requirements and constraints.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No task data uploaded. Please upload a tasks CSV file.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}