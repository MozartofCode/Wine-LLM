import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { AgeGate } from '@/components/age-gate'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Pour Decisions',
  description: 'Learn about wine, play a daily wine game, and find your next favorite bottle. No account needed.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
        <AgeGate />
        {/* Optional cookieless analytics: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to enable. */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  )
}
