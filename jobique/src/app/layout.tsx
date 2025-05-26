'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider> {/* Optional theming */}
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}