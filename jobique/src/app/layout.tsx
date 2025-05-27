'use client'

import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}