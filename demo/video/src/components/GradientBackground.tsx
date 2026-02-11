import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';

interface GradientBackgroundProps {
  colors: [string, string] | [string, string, string];
  angle?: number;
  animateAngle?: boolean;
  scaleFrom?: number;
  scaleTo?: number;
  overlayOpacity?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  angle = 135,
  animateAngle = false,
  scaleFrom = 1.0,
  scaleTo = 1.05,
  overlayOpacity = 0,
}) => {
  const frame = useCurrentFrame();
  const currentAngle = animateAngle
    ? angle + interpolate(frame, [0, 300], [0, 30], {
        extrapolateRight: 'clamp',
      })
    : angle;

  const scale = interpolate(frame, [0, 300], [scaleFrom, scaleTo], {
    extrapolateRight: 'clamp',
  });

  const gradient =
    colors.length === 3
      ? `linear-gradient(${currentAngle}deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`
      : `linear-gradient(${currentAngle}deg, ${colors[0]}, ${colors[1]})`;

  return (
    <AbsoluteFill>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: gradient,
          transform: `scale(${scale})`,
        }}
      />
      {overlayOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: `rgba(0,0,0,${overlayOpacity})`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
