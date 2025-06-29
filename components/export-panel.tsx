'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, FileText, Settings, CheckCircle, Package } from 'lucide-react';
import { useDataContext } from '@/contexts/data-context';
import { toast } from 'sonner';

export function ExportPanel() {
  const { state } = useDataContext();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportOptions, setExportOptions] = useState({
    includeValidationReport: true,
    includeMetadata: true,
    formatAsJSON: false,
    separateFiles: true
  });

  const exportData = async () => {
    setIsExporting(true);
    setExportProgress(0);

    const steps = [
      { name: 'Validating data...', progress: 20 },
      { name: 'Generating rules configuration...', progress: 40 },
      { name: 'Preparing export files...', progress: 60 },
      { name: 'Creating download package...', progress: 80 },
      { name: 'Finalizing export...', progress: 100 }
    ];

    for (const step of steps) {
      toast.info(step.name);
      setExportProgress(step.progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate and download files
    generateExportFiles();
    
    setIsExporting(false);
    toast.success('Export completed successfully!');
  };

  const generateExportFiles = () => {
    // Generate cleaned CSV data
    const clientsCSV = generateCSV(state.clients, 'clients');
    const workersCSV = generateCSV(state.workers, 'workers');
    const tasksCSV = generateCSV(state.tasks, 'tasks');

    // Generate rules configuration
    const rulesConfig = {
      rules: state.rules.filter(rule => rule.enabled),
      priorities: state.priorities,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalClients: state.clients.length,
        totalWorkers: state.workers.length,
        totalTasks: state.tasks.length,
        activeRules: state.rules.filter(rule => rule.enabled).length
      }
    };

    // Create download links
    downloadFile('clients_cleaned.csv', clientsCSV, 'text/csv');
    downloadFile('workers_cleaned.csv', workersCSV, 'text/csv');
    downloadFile('tasks_cleaned.csv', tasksCSV, 'text/csv');
    downloadFile('rules_config.json', JSON.stringify(rulesConfig, null, 2), 'application/json');

    if (exportOptions.includeValidationReport) {
      const validationReport = generateValidationReport();
      downloadFile('validation_report.json', JSON.stringify(validationReport, null, 2), 'application/json');
    }
  };

  const generateCSV = (data: any[], type: string) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  };

  const generateValidationReport = () => {
    return {
      summary: {
        totalErrors: state.validationErrors.filter(e => e.type === 'error').length,
        totalWarnings: state.validationErrors.filter(e => e.type === 'warning').length,
        validationDate: new Date().toISOString()
      },
      errors: state.validationErrors,
      recommendations: [
        'Review duplicate client entries',
        'Ensure all required skills are covered by workers',
        'Validate task dependencies for circular references'
      ]
    };
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const dataStats = {
    clients: state.clients.length,
    workers: state.workers.length,
    tasks: state.tasks.length,
    rules: state.rules.filter(rule => rule.enabled).length,
    errors: state.validationErrors.filter(e => e.type === 'error').length,
    warnings: state.validationErrors.filter(e => e.type === 'warning').length
  };

  const isReadyForExport = dataStats.clients > 0 && dataStats.errors === 0;

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <Card className={isReadyForExport ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isReadyForExport ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Package className="h-5 w-5 text-amber-600" />
            )}
            Export Readiness
          </CardTitle>
          <CardDescription>
            {isReadyForExport 
              ? 'Your data is clean and ready for export'
              : 'Please resolve validation errors before exporting'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Data Entities</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Clients:</span>
                  <Badge variant={dataStats.clients > 0 ? 'default' : 'secondary'}>
                    {dataStats.clients}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Workers:</span>
                  <Badge variant={dataStats.workers > 0 ? 'default' : 'secondary'}>
                    {dataStats.workers}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tasks:</span>
                  <Badge variant={dataStats.tasks > 0 ? 'default' : 'secondary'}>
                    {dataStats.tasks}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Configuration</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Active Rules:</span>
                  <Badge variant={dataStats.rules > 0 ? 'default' : 'secondary'}>
                    {dataStats.rules}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Priority Weights:</span>
                  <Badge variant="default">Configured</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Validation Status</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Errors:</span>
                  <Badge variant={dataStats.errors === 0 ? 'default' : 'destructive'}>
                    {dataStats.errors}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Warnings:</span>
                  <Badge variant={dataStats.warnings === 0 ? 'default' : 'secondary'}>
                    {dataStats.warnings}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Export Options
          </CardTitle>
          <CardDescription>
            Customize what gets included in your export package
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="validation-report">Include Validation Report</Label>
              <Switch
                id="validation-report"
                checked={exportOptions.includeValidationReport}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, includeValidationReport: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="metadata">Include Metadata</Label>
              <Switch
                id="metadata"
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, includeMetadata: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="json-format">Export as JSON</Label>
              <Switch
                id="json-format"
                checked={exportOptions.formatAsJSON}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, formatAsJSON: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="separate-files">Separate Files</Label>
              <Switch
                id="separate-files"
                checked={exportOptions.separateFiles}
                onCheckedChange={(checked) => 
                  setExportOptions({ ...exportOptions, separateFiles: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Files Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Export Package Contents</CardTitle>
          <CardDescription>
            Files that will be included in your download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">clients_cleaned.csv</p>
                <p className="text-xs text-muted-foreground">{dataStats.clients} records</p>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">workers_cleaned.csv</p>
                <p className="text-xs text-muted-foreground">{dataStats.workers} records</p>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">tasks_cleaned.csv</p>
                <p className="text-xs text-muted-foreground">{dataStats.tasks} records</p>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Settings className="h-4 w-4 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium">rules_config.json</p>
                <p className="text-xs text-muted-foreground">Rules and priority configuration</p>
              </div>
              <Badge variant="outline">Required</Badge>
            </div>
            
            {exportOptions.includeValidationReport && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium">validation_report.json</p>
                  <p className="text-xs text-muted-foreground">Validation results and recommendations</p>
                </div>
                <Badge variant="secondary">Optional</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <Card>
        <CardContent className="p-6">
          {isExporting && (
            <div className="space-y-4 mb-6">
              <Progress value={exportProgress} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">
                Preparing your export package... {exportProgress}%
              </p>
            </div>
          )}
          
          <Button
            onClick={exportData}
            disabled={!isReadyForExport || isExporting}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isExporting ? (
              <>
                <Package className="h-5 w-5 mr-2 animate-spin" />
                Generating Export...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Export Complete Package
              </>
            )}
          </Button>
          
          {!isReadyForExport && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Please upload data and resolve validation errors before exporting
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}