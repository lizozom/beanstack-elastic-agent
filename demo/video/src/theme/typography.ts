import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

export const FONTS = {
  primary: fontFamily,
  mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
} as const;

export const TEXT = {
  hero: { fontSize: 72, fontWeight: 700 as const, lineHeight: 1.1 },
  h1: { fontSize: 56, fontWeight: 700 as const, lineHeight: 1.2 },
  h2: { fontSize: 42, fontWeight: 600 as const, lineHeight: 1.3 },
  h3: { fontSize: 32, fontWeight: 600 as const, lineHeight: 1.4 },
  body: { fontSize: 24, fontWeight: 400 as const, lineHeight: 1.6 },
  bodyLarge: { fontSize: 28, fontWeight: 400 as const, lineHeight: 1.5 },
  caption: { fontSize: 18, fontWeight: 400 as const, lineHeight: 1.4 },
  mono: { fontSize: 20, fontWeight: 400 as const, lineHeight: 1.5 },
  lowerThird: { fontSize: 22, fontWeight: 500 as const, lineHeight: 1.3 },
  chatPrompt: { fontSize: 22, fontWeight: 400 as const, lineHeight: 1.5 },
  chatResponse: { fontSize: 20, fontWeight: 400 as const, lineHeight: 1.6 },
  toolBadge: { fontSize: 14, fontWeight: 600 as const, lineHeight: 1 },
} as const;
