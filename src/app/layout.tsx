'use client';

import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
const queryClient = new QueryClient();

  return (
    <html lang="en">
        <head>
          <title>Innoscripta test case</title>
          <meta name="description" content="Test case task for frontend developer role" />
        </head>
      <body className={`${inter.className} bg-gray-100`}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider >
      </body>
    </html>
  )
}
