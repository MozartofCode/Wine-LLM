import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pour Decisions',
  description: 'Your personal wine sommelier',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
