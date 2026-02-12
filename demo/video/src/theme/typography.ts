import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

export const FONTS = {
  primary: fontFamily,
  mono: "'SF Mono', 'Fira Code', 'Consolas', monospace",
} as const;

export const TEXT = {
  hero: { fontSize: 94, fontWeight: 700 as const, lineHeight: 1.1 },
  h1: { fontSize: 73, fontWeight: 700 as const, lineHeight: 1.2 },
  h2: { fontSize: 55, fontWeight: 600 as const, lineHeight: 1.3 },
  h3: { fontSize: 42, fontWeight: 600 as const, lineHeight: 1.4 },
  body: { fontSize: 31, fontWeight: 400 as const, lineHeight: 1.6 },
  bodyLarge: { fontSize: 36, fontWeight: 400 as const, lineHeight: 1.5 },
  caption: { fontSize: 23, fontWeight: 400 as const, lineHeight: 1.4 },
  mono: { fontSize: 26, fontWeight: 400 as const, lineHeight: 1.5 },
  lowerThird: { fontSize: 29, fontWeight: 500 as const, lineHeight: 1.3 },
  chatPrompt: { fontSize: 29, fontWeight: 400 as const, lineHeight: 1.5 },
  chatResponse: { fontSize: 26, fontWeight: 400 as const, lineHeight: 1.6 },
  toolBadge: { fontSize: 18, fontWeight: 600 as const, lineHeight: 1 },
} as const;
