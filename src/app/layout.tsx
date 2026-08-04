import type { Metadata } from 'next'
import { Sora, Inter, IBM_Plex_Mono, Archivo } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Footer } from '@/components/layout/Footer'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { ChatWidget } from '@/components/layout/ChatWidget'
import { CartProvider } from '@/lib/cart/CartContext'

const sora = Sora({
  subsets: ['latin'],
  // Variable weight axis (100–800) so intermediate weights like 440 render.
  variable: '--font-display',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
// Brand wordmark face — "ASAP Components" lockup only.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-brand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ASAP Components — Aerospace & Defense Parts Distributor',
    template: '%s | ASAP Components',
  },
  description:
    'ASAP Components is a leading distributor of aviation, aerospace, and defense parts. Search by part number or NSN and request a quote — answered within 15 minutes, 24/7.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${plexMono.variable} ${archivo.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <Footer />
          <CookieBanner />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  )
}
