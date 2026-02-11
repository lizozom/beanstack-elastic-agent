import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import { FONTS, TEXT } from '../theme/typography';
import { CLOSING } from '../theme/colors';
import { Logo } from '../components/Logo';

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Quick montage flashes (0-60)
  const montageItems = [
    '21 Tools',
    '3 Workflows',
    'System Prompt',
    'Slack Integration',
    'Architecture',
  ];
  const montageIndex = Math.floor(frame / 12);
  const showMontage = frame < 60;

  // Phase 2: Black pause (60-90)
  // Phase 3: Main tagline (90-180)
  const taglineOpacity = spring({
    frame: frame - 90,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  // Phase 4: Built on line (210-300)
  const builtOnOpacity = spring({
    frame: frame - 210,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  // Phase 5: Final fade out
  const finalFade = interpolate(frame, [400, 450], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: CLOSING.background,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: finalFade,
      }}
    >
      {/* Montage flashes */}
      {showMontage && montageIndex < montageItems.length && (
        <div
          style={{
            fontFamily: FONTS.primary,
            ...TEXT.h2,
            color: CLOSING.textSecondary,
            opacity: 0.6,
          }}
        >
          {montageItems[montageIndex]}
        </div>
      )}

      {/* Main content */}
      {!showMontage && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${(1 - taglineOpacity) * 20}px)`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: FONTS.primary,
                ...TEXT.hero,
                color: CLOSING.text,
                marginBottom: 16,
              }}
            >
              BeanStack Agent
            </div>
            <div
              style={{
                fontFamily: FONTS.primary,
                ...TEXT.h3,
                color: CLOSING.textSecondary,
              }}
            >
              From buried reports to real action.
            </div>
          </div>

          <div
            style={{
              opacity: builtOnOpacity,
              transform: `translateY(${(1 - builtOnOpacity) * 15}px)`,
              marginTop: 40,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: FONTS.primary,
                ...TEXT.bodyLarge,
                color: CLOSING.textSecondary,
                marginBottom: 30,
              }}
            >
              Built on Elastic Agent Builder.
            </div>
            <Logo startFrame={0} fadeInFrames={1} maxWidth={250} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
