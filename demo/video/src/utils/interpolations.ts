import { interpolate, Easing } from 'remotion';

export const staggeredEntry = (
  frame: number,
  index: number,
  staggerDelay: number = 10,
  fadeDuration: number = 15,
) => {
  const start = index * staggerDelay;
  return interpolate(frame, [start, start + fadeDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

export const slideUp = (
  frame: number,
  startFrame: number,
  distance: number = 30,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

export const drawLine = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  totalLength: number,
) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return {
    strokeDasharray: totalLength,
    strokeDashoffset: totalLength * (1 - progress),
  };
};
