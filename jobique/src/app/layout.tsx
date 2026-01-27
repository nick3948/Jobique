'use client'
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body>
          {children}
          <Analytics />
          <Toaster richColors position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  )
}