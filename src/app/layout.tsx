import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { CompanionProvider } from '@/components/providers/CompanionProvider';
import { RobotCompanion } from '@/components/companion/RobotCompanion';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
};

export const metadata: Metadata = {
  title: 'CodeQuest — Dasturlashni 0 dan Professionalgacha O‘rganing',
  description:
    'O‘zbek tilidagi eng zamonaviy va interaktiv dasturlash ta’lim platformasi. Nazariya, kod muharriri, testlar va shaxsiy Code Mentor.',
  keywords: ['dasturlash', 'o‘rganish', 'kurslar', 'javascript', 'html', 'css', 'python', 'codequest'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-background text-foreground antialiased flex flex-col`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <CompanionProvider>
                {children}
                <RobotCompanion />
              </CompanionProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
