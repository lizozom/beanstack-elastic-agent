import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { UI, COFFEE } from '../theme/colors';
import { FONTS } from '../theme/typography';

interface ReportFragmentProps {
  from: string;
  subject: string;
  body: string;
  highlight?: string;
  startFrame?: number;
}

export const ReportFragment: React.FC<ReportFragmentProps> = ({
  from,
  subject,
  body,
  highlight,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 150, mass: 0.6 },
  });

  if (frame < startFrame) return null;

  const renderBody = () => {
    if (!highlight) return body;
    const parts = body.split(highlight);
    if (parts.length === 1) return body;
    return (
      <>
        {parts[0]}
        <span
          style={{
            backgroundColor: `${COFFEE.amber}30`,
            color: COFFEE.amber,
            fontWeight: 600,
            padding: '1px 4px',
            borderRadius: 3,
          }}
        >
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      style={{
        opacity: appear,
        transform: `translateY(${(1 - appear) * 15}px)`,
        backgroundColor: UI.surface,
        border: `1px solid ${UI.border}`,
        borderRadius: 8,
        padding: '12px 16px',
        marginLeft: 62,
        maxWidth: '70%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 18,
            color: UI.textSecondary,
          }}
        >
          From: {from}
        </span>
      </div>
      <div
        style={{
          fontFamily: FONTS.primary,
          fontSize: 22,
          fontWeight: 600,
          color: UI.text,
          marginBottom: 8,
        }}
      >
        {subject}
      </div>
      {/* Body */}
      <div
        style={{
          fontFamily: FONTS.primary,
          fontSize: 20,
          color: UI.textSecondary,
          lineHeight: 1.5,
        }}
      >
        {renderBody()}
      </div>
    </div>
  );
};
