'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { config } from '@/lib/config';

interface NavbarProps {
  onNavigate?: {
    features: () => void;
    platform: () => void;
    architecture: () => void;
    about: () => void;
  };
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setTheme } = useTheme();

  const navItems = [
    { name: 'Features', action: onNavigate?.features },
    { name: 'Platform', action: onNavigate?.platform },
    { name: 'Architecture', action: onNavigate?.architecture },
    { name: 'About', action: onNavigate?.about },
  ];

  const handleNavClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand - Now Clickable */}
          <button 
            onClick={scrollToTop}
            className="flex items-center space-x-3 group cursor-pointer hover:scale-105 transition-all duration-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <div className="relative">
              <Brain className="h-8 w-8 text-blue-600 group-hover:animate-pulse transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-lg group-hover:bg-blue-600/30 transition-all duration-300"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                Data Alchemist
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                AI Resource Configurator
              </p>
            </div>
            <Badge variant="outline" className="hidden md:flex text-xs border-blue-200 text-blue-700 group-hover:border-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all duration-300">
              v{config.app.version}
            </Badge>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.action)}
                className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer group px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300 group">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-yellow-500" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-gray-950 border shadow-lg backdrop-blur-md">
                <DropdownMenuItem onClick={() => setTheme('light')} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <Moon className="mr-2 h-4 w-4 text-blue-400" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200">
                  <Monitor className="mr-2 h-4 w-4 text-gray-600" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 px-0 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-110 transition-all duration-300 group"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 dark:bg-gray-950/95 backdrop-blur animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Home Link */}
              <button
                onClick={scrollToTop}
                className="block w-full text-left px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>Home</span>
                </div>
              </button>
              
              {navItems.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.action)}
                  className="block w-full text-left px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-md"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span>{item.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}