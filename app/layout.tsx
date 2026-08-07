import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'IDSI Formations 2026',
  description: 'Dashboard de suivi du programme de formations 2026 — Association des Anciens Diplômés IDSI, Côte d\'Ivoire',
  // Favicon : app/icon.png & app/apple-icon.png (logo IDSI Alumni carré)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
