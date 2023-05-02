"use client"

import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] })
export default function Page() {
  useEffect(() => {
    console.log('Page mounted')
    import("../../wasm/pkg/index")
      .then((wasm) => {
        wasm.greet()
      })
  }, []);
  return <h1>Hello, Next.js!</h1>;
}