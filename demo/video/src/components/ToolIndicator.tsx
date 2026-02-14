import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import type { ToolType } from '../data/chatConversations';

interface Tool {
  name: string;
  type: ToolType;
  label?: string;
}

interface ToolIndicatorProps {
  tools: Tool[];
  startFrame?: number;
  staggerFrames?: number;
}

const typeColors: Record<ToolType, string> = {
  esql: UI.accentAmber,
  search: UI.accent,
  workflow: UI.accentGreen,
  builtin: UI.textSecondary,
};

const typeIcons: Record<ToolType, string> = {
  esql: '⚡',
  search: '🔍',
  workflow: '⚙️',
  builtin: '🔧',
};

export const ToolIndicator: React.FC<ToolIndicatorProps> = ({
  tools,
  startFrame = 0,
  staggerFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 62,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontFamily: FONTS.primary,
          fontSize: 24,
          color: UI.textSecondary,
        }}
      >
        Using:
      </span>
      {tools.map((tool, i) => {
        const s = spring({
          frame: frame - startFrame - i * staggerFrames,
          fps,
          config: { damping: 15, stiffness: 200, mass: 0.5 },
        });

        const color = typeColors[tool.type];

        return (
          <div
            key={i}
            style={{
              opacity: s,
              transform: `scale(${s}) translateX(${(1 - s) * 20}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 14,
              backgroundColor: color + '20',
              border: `1px solid ${color}50`,
            }}
          >
            <span style={{ fontSize: 22 }}>{typeIcons[tool.type]}</span>
            <span
              style={{
                fontFamily: FONTS.mono,
                ...TEXT.toolBadge,
                color,
              }}
            >
              {tool.name}
            </span>
            {tool.label && (
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 20,
                  color: UI.textSecondary,
                }}
              >
                {tool.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
