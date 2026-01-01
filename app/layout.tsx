import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Medicine Management',
  description: 'Manage your medicine inventory with expiry tracking',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Medicine Management',
  },
}

import { ErrorBoundary } from '@/components/ErrorBoundary'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <ErrorBoundary>
          <ServiceWorkerRegistration />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}

