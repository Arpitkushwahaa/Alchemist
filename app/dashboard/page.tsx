'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { DataProvider } from '@/contexts/data-context';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProjectSelector } from '@/components/project-selector';
import { DataUpload } from '@/components/data-upload';
import { DataGrid } from '@/components/data-grid';
import { ValidationPanel } from '@/components/validation-panel';
import { RuleBuilder } from '@/components/rule-builder';
import { ExportPanel } from '@/components/export-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Database, 
  AlertTriangle, 
  Cog, 
  Download,
  User,
  LogOut,
  Save
} from 'lucide-react';
import { useState } from 'react';

function DashboardContent() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Dashboard Header */}
      <div className="border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Badge variant="outline" className="text-xs">
                Welcome back!
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-8">
          {/* Welcome Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to Data Alchemist
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Transform your data with AI-powered processing and intelligent automation.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logged in as</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.user_metadata?.name || user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Management */}
          <ProjectSelector />

          {/* Main Application Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px] mx-auto glass backdrop-blur-md">
              <TabsTrigger 
                value="upload" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
              >
                <Upload className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Upload
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
              >
                <Database className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Data Grid
              </TabsTrigger>
              <TabsTrigger 
                value="validation" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
              >
                <AlertTriangle className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Validation
              </TabsTrigger>
              <TabsTrigger 
                value="rules" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
              >
                <Cog className="h-4 w-4 mr-2 group-hover:animate-spin" />
                Rules
              </TabsTrigger>
              <TabsTrigger 
                value="export" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-105 group"
              >
                <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                Export
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card className="glass hover:shadow-xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Data Upload & Import
                  </CardTitle>
                  <CardDescription>
                    Upload your CSV or XLSX files. Data is automatically saved to the cloud database with real-time sync.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataUpload />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <DataGrid />
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <ValidationPanel />
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <RuleBuilder />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <Card className="glass hover:shadow-xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-600" />
                    Export & Download
                  </CardTitle>
                  <CardDescription>
                    Export your processed data and configuration files ready for production deployment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExportPanel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}