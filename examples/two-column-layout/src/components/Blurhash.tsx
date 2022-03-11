/** @jsx h */
import { decode } from 'blurhash';
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

export interface BlurhashProps {
  hash: string;
  width?: number;
  height?: number;
  punch?: number;
}

export function Blurhash({
  hash,
  width = 128,
  height = 128,
  punch = 1,
}: BlurhashProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hash) {
      return;
    }

    const pixels = decode(hash, width, height, punch);

    const ctx = ref.current.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  }, [hash, width, height, punch]);

  return (
    hash && (
      <canvas
        ref={ref}
        height={height}
        width={width}
        className="aa-BlurhashCanvas"
      />
    )
  );
}
