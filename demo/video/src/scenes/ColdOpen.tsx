import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
} from 'remotion';
import { FONTS, TEXT } from '../theme/typography';
import { CLOSING, COFFEE } from '../theme/colors';

const lines = [
  '100 branches.',
  'Way too much coffee.',
  'Thousands of reports.',
  'But who\'s reading them?',
];

const LINE_DELAYS = [30, 55, 80, 110];

export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo fades in first
  const logoAppear = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CLOSING.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Logo appears first */}
        <div
          style={{
            opacity: logoAppear,
            transform: `scale(${0.9 + logoAppear * 0.1})`,
            marginBottom: 16,
          }}
        >
          <Img
            src={staticFile('beanstack.jpg')}
            style={{
              width: 220,
              height: 'auto',
              borderRadius: 12,
            }}
          />
        </div>

        {/* Text lines appear after logo */}
        {lines.map((line, i) => {
          const s = spring({
            frame: frame - LINE_DELAYS[i],
            fps,
            config: { damping: 20, stiffness: 80, mass: 1 },
          });

          return (
            <div
              key={i}
              style={{
                fontFamily: FONTS.primary,
                ...TEXT.h1,
                color: i === lines.length - 1 ? COFFEE.amber : CLOSING.text,
                opacity: s,
                transform: `translateY(${(1 - s) * 15}px)`,
                fontStyle: 'italic',
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
