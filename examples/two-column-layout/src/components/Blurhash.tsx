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

export const Blurhash = ({
  hash,
  width = 128,
  height = 128,
  punch = 1,
}: BlurhashProps) => {
  const ref = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const pixels = decode(hash, width, height, punch);

    const ctx = ref.current.getContext('2d');
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
  });

  return (
    <canvas
      ref={ref}
      height={height}
      width={width}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};
