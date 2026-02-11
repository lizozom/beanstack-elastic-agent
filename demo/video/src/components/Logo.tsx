import React from 'react';
import { useCurrentFrame, interpolate, Img, staticFile } from 'remotion';

interface LogoProps {
  startFrame?: number;
  fadeInFrames?: number;
  maxWidth?: number;
}

export const Logo: React.FC<LogoProps> = ({
  startFrame = 0,
  fadeInFrames = 30,
  maxWidth = 300,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + fadeInFrames],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div style={{ opacity }}>
      <Img
        src={staticFile('beanstack.jpg')}
        style={{
          maxWidth,
          height: 'auto',
          borderRadius: 8,
        }}
      />
    </div>
  );
};
