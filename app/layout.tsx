'use client';

import { Web3Provider } from '@/components/providers/Web3Provider'
import { Suspense } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import Fallback from './fallback'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#000000" />
        <title>Insider Analytics - Ultra-Dense Architecture</title>
      </head>
      <body>
        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <Web3Provider>
              {children}
            </Web3Provider>
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
}