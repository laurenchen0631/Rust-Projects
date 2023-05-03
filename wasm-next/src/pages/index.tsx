import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  useEffect(() => {
    import('@wasm/index').then(({ greet }) => greet("World"));
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      Hello, World!
    </main>
  )
}
