/** @jsxRuntime classic */
/** @jsx h */
import { decode } from 'blurhash';
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export interface BlurhashProps {
  hash: string;
  width: number;
  height: number;
  punch?: number;
}

export function Blurhash({ hash, width, height, punch = 1 }: BlurhashProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pixels = decode(hash, width, height, punch);

    const ctx = canvasRef.current.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }, [hash, width, height, punch]);

  return (
    <canvas
      ref={canvasRef}
      height={height}
      width={width}
      className="aa-BlurhashCanvas"
    />
  );
}
