import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useRef } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current === null) return;
    import('@wasm/index').then(({Universe}) => {
      const universe = Universe.new();
      const renderLoop = () => {
        preRef.current!.textContent = universe.render();
        universe.tick();
      
        requestAnimationFrame(renderLoop);
      };
      requestAnimationFrame(renderLoop)
    })
  }, [preRef]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <pre ref={preRef} className='leading-3'></pre>
    </main>
  )
}
