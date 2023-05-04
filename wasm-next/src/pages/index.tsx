import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useCallback, useEffect, useRef } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface GameProps {
  cellSize: number;
  gridColor: string;
  deadColor: string;
  aliveColor: string;
}

export default function Home({
  cellSize = 5,
  gridColor = '#CCCCCC',
  deadColor = '#FFFFFF',
  aliveColor = '#000000',
}: GameProps) {
  // const preRef = useRef<HTMLPreElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const exec = useCallback(async (canvas: HTMLCanvasElement) => {
    const [{memory}, {Universe, Cell}] = await Promise.all([
      import ('@wasm/index_bg.wasm'),
      import('@wasm/index'),
    ]);

    const universe = Universe.new();
    const width = universe.width();
    const height = universe.height();

    if (canvasRef.current === null) return;
    canvasRef.current.height = (cellSize + 1) * height + 1;
    canvasRef.current.width = (cellSize + 1) * width + 1;

    const ctx = canvasRef.current.getContext('2d')!;
    const drawGrid = () => {
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
    
      // Vertical lines.
      for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (cellSize + 1) + 1, 0);
        ctx.lineTo(i * (cellSize + 1) + 1, (cellSize + 1) * height + 1);
      }
    
      // Horizontal lines.
      for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (cellSize + 1) + 1);
        ctx.lineTo((cellSize + 1) * width + 1, j * (cellSize + 1) + 1);
      }
    
      ctx.stroke();
    };

    const getIndex = (row: number, column: number) => {
      return row * width + column;
    };
    
    const drawCells = () => {
      const cellsPtr = universe.cells();
      const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
    
      ctx.beginPath();
    
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const idx = getIndex(row, col);
    
          ctx.fillStyle = cells[idx] === Cell.Dead
            ? deadColor
            : aliveColor;
    
          ctx.fillRect(
            col * (cellSize + 1) + 1,
            row * (cellSize + 1) + 1,
            cellSize,
            cellSize
          );
        }
      }
    
      ctx.stroke();
    };

    const renderLoop = () => {
      universe.tick();
    
      drawGrid();
      drawCells();
    
      requestAnimationFrame(renderLoop);
    };

    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
  }, [aliveColor, cellSize, deadColor, gridColor]);

  useEffect(() => {
    if (canvasRef.current === null) return;
    exec(canvasRef.current);
  }, [canvasRef, exec]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <canvas ref={canvasRef} className='border-2 border-black'></canvas>
    </main>
  )
}
