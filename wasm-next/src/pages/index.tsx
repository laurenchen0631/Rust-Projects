import Image from 'next/image'
import { Inter } from 'next/font/google'
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { MouseEvent } from 'react';

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
  const [playing , setPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationId = useRef<number>();

  const render = useCallback(async (canvas: HTMLCanvasElement) => {
    const [{memory}, {Universe, Cell}] = await Promise.all([
      import ('@wasm/index_bg.wasm'),
      import('@wasm/index'),
    ]);

    const universe = Universe.new();
    const width = universe.width();
    const height = universe.height();

    if (canvasRef.current === null) return;
    canvas.height = (cellSize + 1) * height + 1;
    canvas.width = (cellSize + 1) * width + 1;

    const ctx = canvas.getContext('2d')!;
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

      ctx.fillStyle = aliveColor;
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const idx = getIndex(row, col);
          if (cells[idx] !== Cell.Alive) {
            continue;
          }

          ctx.fillRect(
            col * (cellSize + 1) + 1,
            row * (cellSize + 1) + 1,
            cellSize,
            cellSize
          );
        }
      }

      // Dead cells.
      ctx.fillStyle = deadColor;
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          const idx = getIndex(row, col);
          if (cells[idx] !== Cell.Dead) {
            continue;
          }

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
      if (animationId.current === undefined) return;
      universe.tick();
    
      drawGrid();
      drawCells();
    
      animationId.current = requestAnimationFrame(renderLoop);
    };

    drawGrid();
    drawCells();
    animationId.current = requestAnimationFrame(renderLoop);
  }, [aliveColor, cellSize, deadColor, gridColor]);

  const stop = useCallback(() => {
    if (animationId.current !== undefined) {
      console.log(animationId.current);
      cancelAnimationFrame(animationId.current);
      animationId.current = undefined;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    setPlaying(true);
    render(canvasRef.current!);
  }, [render]);

  useEffect(() => {
    if (canvasRef.current === null) return;
    play();
  }, [canvasRef, play]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <button onClick={playing ? stop : play}>{playing ? '⏸' : '▶'}</button>
      <canvas ref={canvasRef} className='border-2 border-black' />
    </main>
  )
}
