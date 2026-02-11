import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { FONTS, TEXT } from '../theme/typography';
import { COFFEE, UI } from '../theme/colors';

interface LowerThirdProps {
  text: string;
  startFrame?: number;
  durationInFrames: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  text,
  startFrame = 0,
  durationInFrames,
  fadeInFrames = 15,
  fadeOutFrames = 10,
}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - startFrame;

  if (relFrame < 0 || relFrame > durationInFrames) return null;

  const opacity = interpolate(
    relFrame,
    [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const slideX = interpolate(relFrame, [0, fadeInFrames], [-40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 60,
        left: 40,
        opacity,
        transform: `translateX(${slideX}px)`,
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <div
        style={{
          width: 3,
          backgroundColor: COFFEE.amber,
          borderRadius: 2,
          marginRight: 12,
        }}
      />
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          padding: '12px 20px',
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            ...TEXT.lowerThird,
            color: UI.text,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
