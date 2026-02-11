import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { FONTS } from '../theme/typography';

interface FadeInTextProps {
  text: string;
  delay?: number;
  slideDistance?: number;
  style?: React.CSSProperties;
  useSpring?: boolean;
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  delay = 0,
  slideDistance = 20,
  style = {},
  useSpring: useSpringAnim = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let opacity: number;
  let translateY: number;

  if (useSpringAnim) {
    const s = spring({
      frame: frame - delay,
      fps,
      config: { damping: 20, stiffness: 80, mass: 1 },
    });
    opacity = s;
    translateY = (1 - s) * slideDistance;
  } else {
    opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    translateY = interpolate(frame, [delay, delay + 20], [slideDistance, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  return (
    <div
      style={{
        fontFamily: FONTS.primary,
        opacity,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
