import {Footer } from './slices/Footer';
import {Header } from './slices/Header';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
    <Header />
    <Footer />
    </main>
  )
}
