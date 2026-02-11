import React from 'react';
import { useCurrentFrame, AbsoluteFill } from 'remotion';

interface SteamParticlesProps {
  count?: number;
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export const SteamParticles: React.FC<SteamParticlesProps> = ({
  count = 25,
}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    const startX = seededRandom(i * 7 + 1) * 1920;
    const startY = 1080 + seededRandom(i * 13 + 3) * 200;
    const speed = 0.8 + seededRandom(i * 19 + 5) * 1.2;
    const wobbleFreq = 0.02 + seededRandom(i * 23 + 7) * 0.03;
    const wobbleAmp = 20 + seededRandom(i * 29 + 11) * 40;
    const size = 7 + seededRandom(i * 31 + 13) * 8;
    const baseOpacity = 0.05 + seededRandom(i * 37 + 17) * 0.12;
    const phase = seededRandom(i * 41 + 19) * Math.PI * 2;

    const y = startY - frame * speed;
    const x = startX + Math.sin(frame * wobbleFreq + phase) * wobbleAmp;
    const wrappedY = ((y % 1400) + 1400) % 1400 - 200;
    const fadeY =
      wrappedY > 400
        ? 1
        : wrappedY > 200
          ? (wrappedY - 200) / 200
          : wrappedY > 0
            ? wrappedY / 200
            : 0;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: wrappedY,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,' + baseOpacity * fadeY + ')',
          filter: 'blur(2px)',
        }}
      />
    );
  });

  return <AbsoluteFill>{particles}</AbsoluteFill>;
};
