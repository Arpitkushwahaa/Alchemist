'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  Code,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import { config } from '@/lib/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const techStack = [
    { name: 'Next.js 13', icon: Code, color: 'text-gray-700 dark:text-gray-300' },
    { name: 'TypeScript', icon: Shield, color: 'text-blue-600' },
    { name: 'React 18', icon: Zap, color: 'text-cyan-600' },
    { name: 'Tailwind CSS', icon: Globe, color: 'text-teal-600' },
  ];

  const features = [
    'AI-Powered Data Processing',
    'Real-time Validation',
    'Business Rules Engine',
    'Production Export System'
  ];

  return (
    <footer className="border-t bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600" />
                <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-lg"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Data Alchemist
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI Resource Configurator
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              Enterprise-grade data transformation platform demonstrating modern web development 
              practices with React, TypeScript, and AI integration.
            </p>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                v{config.app.version}
              </Badge>
              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Production Ready
              </Badge>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Technology Stack
            </h4>
            <ul className="space-y-2">
              {techStack.map((tech) => (
                <li key={tech.name}>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <tech.icon className={`h-3 w-3 ${tech.color}`} />
                    <span>{tech.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Key Features
            </h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="text-sm text-gray-600 dark:text-gray-400">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Data Alchemist. Technical Portfolio Project.
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js, TypeScript & Modern Web Technologies
          </div>
        </div>

        {/* Technical Showcase */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Code className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Technical Portfolio Demonstration
              </p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              This application showcases advanced React patterns, TypeScript implementation, 
              AI integration, and modern web development best practices.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}