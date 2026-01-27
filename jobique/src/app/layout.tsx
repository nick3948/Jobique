'use client'
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <title>Jobique</title>
          <meta name="description" content="Job Application Tracker" />
          <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        </head>
        <body className={inter.className}>
          {children}
          <Analytics />
          <Toaster richColors position="top-center" closeButton theme="light" />
        </body>
      </html>
    </ClerkProvider>
  )
}