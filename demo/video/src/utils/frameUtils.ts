import { interpolate } from 'remotion';

export const secondsToFrames = (seconds: number, fps: number = 30) =>
  Math.round(seconds * fps);

export const framesToSeconds = (frames: number, fps: number = 30) =>
  frames / fps;

export const sceneFade = (
  frame: number,
  durationInFrames: number,
  fadeIn: number = 20,
  fadeOut: number = 20,
) => {
  // Ensure strictly increasing input range
  const safeIn = Math.max(fadeIn, 1);
  const safeOutStart = Math.max(durationInFrames - fadeOut, safeIn + 1);
  const safeEnd = Math.max(durationInFrames, safeOutStart + 1);

  return interpolate(
    frame,
    [0, safeIn, safeOutStart, safeEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};
