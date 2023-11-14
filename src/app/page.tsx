'use client';

import {Footer } from './slices/footer';
import {Header } from './slices/header';
import {Articles} from './slices/articles';
import dynamic from 'next/dynamic';

export default function Home() {
    const DynamicArticles = dynamic(() =>
      import('./slices/articles').then((mod) => mod.Articles)
    )

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <DynamicArticles />
      <Footer />
    </main>
  )
}
