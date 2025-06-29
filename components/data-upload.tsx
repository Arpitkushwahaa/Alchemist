'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Brain, Database, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useDataContext } from '@/contexts/data-context';
import { parseCSVData, parseXLSXData } from '@/lib/data-parser';
import { config } from '@/lib/config';

interface UploadedFile {
  file: File;
  type: 'clients' | 'workers' | 'tasks';
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
}

export function DataUpload() {
  const { dispatch } = useDataContext();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const oversizedFiles = acceptedFiles.filter(file => file.size > config.fileUpload.maxSize);
    if (oversizedFiles.length > 0) {
      toast.error(`Files too large. Maximum size: ${config.fileUpload.maxSize / 1024 / 1024}MB`);
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      type: detectFileType(file.name),
      status: 'pending',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    processFiles(newFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true,
    maxSize: config.fileUpload.maxSize
  });

  const detectFileType = (filename: string): 'clients' | 'workers' | 'tasks' => {
    const name = filename.toLowerCase();
    if (name.includes('client')) return 'clients';
    if (name.includes('worker')) return 'workers';
    if (name.includes('task')) return 'tasks';
    return 'clients';
  };

  const processFiles = async (files: UploadedFile[]) => {
    setIsProcessing(true);

    for (const fileItem of files) {
      try {
        updateFileStatus(fileItem.file.name, 'processing', 25);
        
        let data: any[];
        const fileExtension = fileItem.file.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'csv') {
          data = await parseCSVData(fileItem.file);
        } else {
          data = await parseXLSXData(fileItem.file);
        }

        updateFileStatus(fileItem.file.name, 'processing', 75);

        switch (fileItem.type) {
          case 'clients':
            dispatch({ type: 'SET_CLIENTS', payload: data });
            break;
          case 'workers':
            dispatch({ type: 'SET_WORKERS', payload: data });
            break;
          case 'tasks':
            dispatch({ type: 'SET_TASKS', payload: data });
            break;
        }

        updateFileStatus(fileItem.file.name, 'success', 100);
        toast.success(`${fileItem.type} data processed successfully`);

      } catch (error) {
        updateFileStatus(fileItem.file.name, 'error', 0, error instanceof Error ? error.message : 'Processing failed');
        toast.error(`Failed to process ${fileItem.file.name}`);
      }
    }

    setIsProcessing(false);
  };

  const updateFileStatus = (fileName: string, status: UploadedFile['status'], progress: number, error?: string) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.file.name === fileName 
          ? { ...file, status, progress, error }
          : file
      )
    );
  };

  const loadSampleData = () => {
    const sampleClients = [
      {
        ClientID: 'C1',
        ClientName: 'Acme Corp',
        PriorityLevel: 3,
        RequestedTaskIDs: 'T1,T2,T3',
        GroupTag: 'GroupA',
        AttributesJSON: '{"location":"New York","budget":100000}'
      },
      {
        ClientID: 'C2',
        ClientName: 'Globex Inc',
        PriorityLevel: 1,
        RequestedTaskIDs: 'T2,T4,T5',
        GroupTag: 'GroupB',
        AttributesJSON: '{"location":"London","budget":75000}'
      },
      {
        ClientID: 'C3',
        ClientName: 'Initech Solutions',
        PriorityLevel: 4,
        RequestedTaskIDs: 'T1,T3,T5',
        GroupTag: 'GroupA',
        AttributesJSON: '{"location":"San Francisco","budget":120000}'
      }
    ];

    const sampleWorkers = [
      {
        WorkerID: 'W1',
        WorkerName: 'Alice Johnson',
        Skills: 'Python,Machine Learning,Data Analysis',
        AvailableSlots: '[1,2,3,4,5]',
        MaxLoadPerPhase: 3,
        WorkerGroup: 'GroupA',
        QualificationLevel: 8
      },
      {
        WorkerID: 'W2',
        WorkerName: 'Bob Smith',
        Skills: 'JavaScript,React,Node.js',
        AvailableSlots: '[1,3,5]',
        MaxLoadPerPhase: 2,
        WorkerGroup: 'GroupB',
        QualificationLevel: 7
      },
      {
        WorkerID: 'W3',
        WorkerName: 'Carol Davis',
        Skills: 'Java,Spring,Microservices',
        AvailableSlots: '[2,4,6]',
        MaxLoadPerPhase: 4,
        WorkerGroup: 'GroupA',
        QualificationLevel: 9
      }
    ];

    const sampleTasks = [
      {
        TaskID: 'T1',
        TaskName: 'Database Migration',
        Category: 'Infrastructure',
        Duration: 3,
        RequiredSkills: 'Database,SQL,Migration',
        PreferredPhases: '[1,2]',
        MaxConcurrent: 1
      },
      {
        TaskID: 'T2',
        TaskName: 'API Development',
        Category: 'Backend',
        Duration: 2,
        RequiredSkills: 'JavaScript,APIs,Node.js',
        PreferredPhases: '[2,3]',
        MaxConcurrent: 2
      },
      {
        TaskID: 'T3',
        TaskName: 'Machine Learning Model',
        Category: 'AI/ML',
        Duration: 5,
        RequiredSkills: 'Python,Machine Learning,Data Science',
        PreferredPhases: '[1,2,3]',
        MaxConcurrent: 1
      },
      {
        TaskID: 'T4',
        TaskName: 'Frontend Dashboard',
        Category: 'Frontend',
        Duration: 3,
        RequiredSkills: 'React,JavaScript,UI/UX',
        PreferredPhases: '[2,3,4]',
        MaxConcurrent: 2
      },
      {
        TaskID: 'T5',
        TaskName: 'Security Audit',
        Category: 'Security',
        Duration: 2,
        RequiredSkills: 'Security,Penetration Testing',
        PreferredPhases: '[1,3,5]',
        MaxConcurrent: 1
      }
    ];

    dispatch({ type: 'SET_CLIENTS', payload: sampleClients });
    dispatch({ type: 'SET_WORKERS', payload: sampleWorkers });
    dispatch({ type: 'SET_TASKS', payload: sampleTasks });
    
    toast.success('Sample data loaded successfully');
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'processing':
        return <Brain className="h-6 w-6 text-blue-500 animate-pulse" />;
      default:
        return <FileText className="h-6 w-6 text-slate-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'clients':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'workers':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'tasks':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
    }
  };

  return (
    <div className="space-y-10">
      {/* Upload Zone */}
      <Card className={`border-3 border-dashed transition-all duration-500 ${
        isDragActive 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20 scale-105 shadow-2xl' 
          : 'border-slate-300 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl'
      }`}>
        <CardContent className="p-12">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all duration-500 ${
              isDragActive ? 'scale-105' : 'hover:scale-102'
            }`}
          >
            <input {...getInputProps()} />
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <Upload className={`h-20 w-20 mx-auto text-blue-500 relative z-10 transition-all duration-500 ${
                isDragActive ? 'animate-bounce scale-125' : 'hover:scale-110'
              }`} />
              <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-purple-500 animate-bounce" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              {isDragActive ? 'Drop files here...' : 'Upload Data Files'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Drag and drop CSV or XLSX files, or click to browse. Our AI will automatically detect 
              and map your data columns with intelligent validation.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="px-6 py-3 text-sm font-semibold hover:scale-105 transition-transform duration-300">
                CSV Files
              </Badge>
              <Badge variant="outline" className="px-6 py-3 text-sm font-semibold hover:scale-105 transition-transform duration-300">
                XLSX Files
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 text-sm font-semibold hover:scale-105 transition-transform duration-300">
                <Brain className="h-4 w-4 mr-2" />
                AI Processing
              </Badge>
              <Badge variant="outline" className="text-xs px-4 py-2 font-mono">
                Max: {config.fileUpload.maxSize / 1024 / 1024}MB
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Processing Status */}
      {uploadedFiles.length > 0 && (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <FileText className="h-7 w-7 text-blue-600" />
              Processing Status
            </h3>
            <div className="space-y-6">
              {uploadedFiles.map((fileItem, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="flex-shrink-0">
                      {getStatusIcon(fileItem.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="font-bold text-lg text-slate-900 dark:text-white truncate">
                          {fileItem.file.name}
                        </span>
                        <Badge className={`px-4 py-2 font-semibold ${getTypeColor(fileItem.type)}`}>
                          {fileItem.type.charAt(0).toUpperCase() + fileItem.type.slice(1)}
                        </Badge>
                      </div>
                      {fileItem.status === 'processing' && (
                        <div className="space-y-2">
                          <Progress value={fileItem.progress} className="w-full h-3" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            Processing... {fileItem.progress}%
                          </p>
                        </div>
                      )}
                      {fileItem.error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                          {fileItem.error}
                        </p>
                      )}
                      {fileItem.status === 'success' && (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          Successfully processed and validated
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-mono bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg">
                    {Math.round(fileItem.file.size / 1024)} KB
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Data Section */}
      <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-emerald-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-emerald-600/5"></div>
        <CardContent className="p-10 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                <Database className="h-7 w-7 text-blue-600" />
                Try with Sample Data
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-2xl">
                Load pre-configured sample data to explore the application features and capabilities. 
                Includes clients, workers, and tasks with realistic data relationships.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1">
                  3 Clients
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-3 py-1">
                  3 Workers
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1">
                  5 Tasks
                </Badge>
              </div>
            </div>
            <Button 
              onClick={loadSampleData} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-8 text-lg font-semibold rounded-2xl hover:scale-105"
            >
              <Zap className="h-6 w-6 mr-3" />
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}