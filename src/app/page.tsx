'use client';

import {Footer } from './slices/Footer';
import {Header } from './slices/Header';
import {Articles} from './slices/Articles';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <Articles />
      <Footer />
    </main>
  )
}
