import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { UI, COFFEE } from '../theme/colors';
import { FONTS } from '../theme/typography';

interface DataTableProps {
  headers: string[];
  rows: string[][];
  startFrame?: number;
  rowStagger?: number;
  highlightRows?: number[];
}

export const DataTable: React.FC<DataTableProps> = ({
  headers,
  rows,
  startFrame = 0,
  rowStagger = 10,
  highlightRows = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerAppear = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.5 },
  });

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${UI.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          backgroundColor: UI.surfaceLight,
          padding: '10px 16px',
          opacity: headerAppear,
          gap: 8,
        }}
      >
        {headers.map((h, i) => (
          <div
            key={i}
            style={{
              flex: i === 0 ? 2 : 1,
              fontFamily: FONTS.primary,
              fontSize: 18,
              fontWeight: 600,
              color: UI.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, ri) => {
        const rowAppear = spring({
          frame: frame - startFrame - 15 - ri * rowStagger,
          fps,
          config: { damping: 20, stiffness: 200, mass: 0.5 },
        });

        const isHighlight = highlightRows.includes(ri);

        return (
          <div
            key={ri}
            style={{
              display: 'flex',
              padding: '10px 16px',
              opacity: rowAppear,
              transform: `translateY(${(1 - rowAppear) * 8}px)`,
              backgroundColor: isHighlight
                ? `${COFFEE.amber}10`
                : 'transparent',
              borderLeft: isHighlight
                ? `3px solid ${COFFEE.amber}`
                : '3px solid transparent',
              borderBottom: `1px solid ${UI.border}`,
              gap: 8,
            }}
          >
            {row.map((cell, ci) => (
              <div
                key={ci}
                style={{
                  flex: ci === 0 ? 2 : 1,
                  fontFamily: FONTS.primary,
                  fontSize: 20,
                  color: isHighlight && ci === 0 ? COFFEE.amber : UI.text,
                  fontWeight: isHighlight && ci === 0 ? 600 : 400,
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};
