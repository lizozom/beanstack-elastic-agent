import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONTS } from '../theme/typography';

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  cursorVisible?: boolean;
  style?: React.CSSProperties;
  mono?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 1,
  cursorVisible = true,
  style = {},
  mono = false,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(
    Math.floor(elapsed * charsPerFrame),
    text.length,
  );
  const isComplete = visibleChars >= text.length;
  const showCursor =
    cursorVisible && !isComplete && Math.sin(frame * 0.4) > 0;

  return (
    <span
      style={{
        fontFamily: mono ? FONTS.mono : FONTS.primary,
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {text.substring(0, visibleChars)}
      {showCursor && (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '1.1em',
            backgroundColor: style.color || '#E8E8ED',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
          }}
        />
      )}
    </span>
  );
};
