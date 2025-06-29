'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  Settings, 
  Download, 
  Sparkles, 
  Zap,
  Shield,
  Rocket,
  ArrowRight,
  CheckCircle,
  Cloud,
  LogIn,
  UserPlus
} from 'lucide-react';
import { config } from '@/lib/config';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Processing',
      description: 'Intelligent data parsing and validation with real-time insights',
      color: 'text-blue-600'
    },
    {
      icon: Cloud,
      title: 'Cloud Database',
      description: 'Secure data persistence with Supabase PostgreSQL',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Auto-save and real-time collaboration features',
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Production Ready',
      description: 'Enterprise-grade security and scalability',
      color: 'text-orange-600'
    }
  ];

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <main className="flex-1">
        <div className="container mx-auto p-6 space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-8 py-16">
            {/* Centered Brand Section */}
            <div className="flex flex-col items-center justify-center space-y-6 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                <Brain className="h-20 w-20 text-blue-600 animate-float relative z-10" />
                <Sparkles className="absolute -top-3 -right-3 h-10 w-10 text-purple-500 animate-bounce" />
              </div>
              
              <div className="text-center space-y-3">
                <h1 className="text-6xl md:text-7xl font-bold gradient-text leading-tight">
                  Data Alchemist
                </h1>
                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                  Production-Ready AI Resource Configurator
                </p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Enterprise-grade data transformation platform with cloud database persistence, 
              real-time collaboration, and AI-powered automation. Built for production environments.
            </p>
            
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="glass px-6 py-3 text-sm font-medium hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <feature.icon className={`h-5 w-5 mr-2 ${feature.color}`} />
                  {feature.title}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs font-mono px-4 py-2">
                v{config.app.version}
              </Badge>
            </div>

            {/* Authentication Actions */}
            <div className="flex items-center justify-center gap-6 pt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-6 text-lg font-semibold"
                onClick={() => router.push('/auth/signup')}
              >
                <UserPlus className="h-6 w-6 mr-3" />
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-3" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass hover:scale-105 transition-all duration-300 px-10 py-6 text-lg font-semibold"
                onClick={() => router.push('/auth/login')}
              >
                <LogIn className="h-6 w-6 mr-3" />
                Sign In
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:shadow-lg transition-all duration-300 group hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <Card className="glass bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold">Production-Ready Data Platform</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Built with enterprise-grade technologies including PostgreSQL, real-time sync, 
                  and cloud-native architecture for scalable data processing workflows.
                </p>
                <div className="flex items-center justify-center gap-8 pt-4">
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime SLA</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">Real-time</div>
                    <div className="text-sm text-muted-foreground">Data Sync</div>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">Cloud</div>
                    <div className="text-sm text-muted-foreground">Native</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Section */}
          <Card className="glass hover:shadow-xl transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Production Architecture
              </CardTitle>
              <CardDescription>
                Enterprise-grade technology stack with cloud database and real-time capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2 group cursor-pointer">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-blue-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold">Frontend</h4>
                  <p className="text-sm text-muted-foreground">Next.js 13, React 18, TypeScript</p>
                </div>
                <div className="text-center space-y-2 group cursor-pointer">
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <Cloud className="h-8 w-8 text-green-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold">Database</h4>
                  <p className="text-sm text-muted-foreground">Supabase PostgreSQL with RLS</p>
                </div>
                <div className="text-center space-y-2 group cursor-pointer">
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-purple-600 mx-auto" />
                  </div>
                  <h4 className="font-semibold">Real-time</h4>
                  <p className="text-sm text-muted-foreground">Live sync and collaboration</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}