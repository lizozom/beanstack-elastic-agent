import type { SpringConfig } from 'remotion';

export const SPRING_CONFIGS: Record<string, Partial<SpringConfig>> = {
  snappy: { damping: 15, stiffness: 200, mass: 0.5 },
  gentle: { damping: 20, stiffness: 80, mass: 1 },
  bouncy: { damping: 8, stiffness: 150, mass: 0.8 },
  smooth: { damping: 30, stiffness: 100, mass: 1 },
  quick: { damping: 20, stiffness: 300, mass: 0.3 },
};

export const TYPING = {
  fast: 2,
  normal: 1,
  slow: 0.5,
  responseDelay: 30,
};

export const TRANSITIONS = {
  crossfade: 20,
  sceneCrossfade: 30,
  elementFadeIn: 15,
  elementFadeOut: 10,
};
