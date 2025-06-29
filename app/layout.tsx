import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Data Alchemist - AI Resource Allocation Configurator | Portfolio Project',
  description: 'Enterprise-grade data transformation platform built with Next.js, TypeScript, and React. Demonstrates advanced web development skills and AI integration.',
  keywords: ['Next.js', 'TypeScript', 'React', 'AI', 'Data Processing', 'Web Development', 'Portfolio'],
  authors: [{ name: 'Developer Portfolio' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}