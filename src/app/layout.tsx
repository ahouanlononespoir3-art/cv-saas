// src/app/layout.tsx
import type { Metadata } from 'next';
import { Sora, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const sora = Sora({
  subsets:   ['latin'],
  variable:  '--font-sora',
  display:   'swap',
});

const jetbrains = JetBrains_Mono({
  subsets:   ['latin'],
  variable:  '--font-jetbrains',
  display:   'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'CVPro AI — Créez votre CV parfait avec l\'IA',
    template: '%s | CVPro AI',
  },
  description:
    'Générez automatiquement des CV professionnels optimisés ATS et des lettres de motivation personnalisées grâce à l\'intelligence artificielle.',
  keywords: ['CV', 'curriculum vitae', 'lettre de motivation', 'IA', 'ATS', 'emploi'],
  openGraph: {
    type:  'website',
    locale: 'fr_FR',
    url:   'https://cvpro.ai',
    title: 'CVPro AI — Créez votre CV parfait avec l\'IA',
    description: 'Générez automatiquement des CV professionnels avec l\'IA',
    siteName: 'CVPro AI',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${sora.variable} ${jetbrains.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color:       '#f1f5f9',
              border:      '1px solid #334155',
              borderRadius: '10px',
              fontSize:    '14px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
