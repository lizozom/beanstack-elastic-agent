import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import { FadeInText } from '../components/FadeInText';
import { UI, COFFEE } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

// Tool summary data
const toolCategories = [
  { label: 'Index Search tools', count: 4, icon: '🔍', color: UI.accent },
  { label: 'ES|QL Analytics tools', count: 10, icon: '⚡', color: COFFEE.amber },
  { label: 'Workflow tools', count: 3, icon: '⚙️', color: UI.accentGreen },
  { label: 'Built-in tools', count: 4, icon: '🔧', color: UI.textSecondary },
];

export const SolutionArchitecture: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 930, 20, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: UI.background, opacity: fade }}>
      {/* Subtle grid pattern */}
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', opacity: 0.05 }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={UI.text} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <FadeInText
          text="Meet the Agent"
          delay={10}
          style={{
            ...TEXT.h1,
            color: UI.text,
          }}
        />
        <FadeInText
          text="A domain-specific operations intelligence agent for BeanStack"
          delay={25}
          style={{
            ...TEXT.body,
            color: UI.textSecondary,
            marginTop: 8,
          }}
        />
      </div>

      {/* Architecture diagram (centered, frames 40+) */}
      <Sequence from={40}>
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: 0,
            width: 1920,
            height: 1080,
            transform: `scale(${interpolate(frame, [40, 500, 600, 930], [1, 1, 0.85, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
            transformOrigin: 'center 40%',
          }}
        >
          <ArchitectureDiagram startFrame={0} />
        </div>
      </Sequence>

      {/* Tool counts (appear after diagram is built) */}
      <Sequence from={350}>
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {toolCategories.map((cat, i) => {
            const delay = i * 15;
            const opacity = interpolate(
              frame - 350,
              [delay, delay + 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );
            const slideY = interpolate(
              frame - 350,
              [delay, delay + 20],
              [15, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            );

            // Highlight each tool category once, starting at frame 420 (second 14)
            const highlightIndex = Math.floor((frame - 420) / 150);
            const isHighlighted = highlightIndex === i && i < toolCategories.length - 1;
            const highlightGlow = isHighlighted
              ? interpolate(
                  (frame - 420) % 40,
                  [0, 10, 30, 40],
                  [0, 1, 1, 0],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                )
              : 0;

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateY(${slideY}px) scale(${1 + highlightGlow * 0.05})`,
                  textAlign: 'center',
                  padding: '14px 24px',
                  borderRadius: 10,
                  backgroundColor: isHighlighted ? `${cat.color}30` : `${cat.color}10`,
                  border: `1px solid ${isHighlighted ? cat.color : `${cat.color}25`}`,
                  boxShadow: isHighlighted
                    ? `0 0 ${12 + highlightGlow * 8}px ${cat.color}40`
                    : 'none',
                  minWidth: 180,
                }}
              >
                <div style={{ fontSize: 31, marginBottom: 6 }}>{cat.icon}</div>
                <div
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 36,
                    fontWeight: 700,
                    color: cat.color,
                  }}
                >
                  {cat.count}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 30,
                    color: isHighlighted ? UI.text : UI.textSecondary,
                    fontWeight: isHighlighted ? 600 : 400,
                    marginTop: 4,
                    width: 220,
                  }}
                >
                  {cat.label}
                </div>
              </div>
            );
          })}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
