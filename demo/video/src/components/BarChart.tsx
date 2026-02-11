import React from 'react';
import { useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { UI, COFFEE } from '../theme/colors';
import { FONTS } from '../theme/typography';

interface BarChartItem {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartProps {
  data: BarChartItem[];
  startFrame?: number;
  staggerFrames?: number;
  formatValue?: (v: number) => string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  startFrame = 0,
  staggerFrames = 8,
  formatValue = (v) => `$${(v / 1000000).toFixed(1)}M`,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      {data.map((item, i) => {
        const s = spring({
          frame: frame - startFrame - i * staggerFrames,
          fps,
          config: { damping: 20, stiffness: 100, mass: 0.8 },
        });

        const barWidth = (item.value / maxValue) * 100 * s;
        const isHighlight = item.highlight;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: Math.min(s * 2, 1),
            }}
          >
            <div
              style={{
                width: 110,
                fontFamily: FONTS.primary,
                fontSize: 14,
                color: isHighlight ? COFFEE.amber : UI.textSecondary,
                textAlign: 'right',
                fontWeight: isHighlight ? 600 : 400,
                flexShrink: 0,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                flex: 1,
                height: 28,
                backgroundColor: UI.surfaceLight,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  background: isHighlight
                    ? `linear-gradient(90deg, ${COFFEE.amber}, ${COFFEE.warmGold})`
                    : `linear-gradient(90deg, ${UI.accent}80, ${UI.accent}40)`,
                  borderRadius: 4,
                  boxShadow: isHighlight
                    ? `0 0 12px ${COFFEE.amber}40`
                    : 'none',
                }}
              />
            </div>
            <div
              style={{
                width: 70,
                fontFamily: FONTS.mono,
                fontSize: 14,
                color: isHighlight ? COFFEE.amber : UI.text,
                fontWeight: isHighlight ? 600 : 400,
                flexShrink: 0,
              }}
            >
              {s > 0.1 ? formatValue(item.value) : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
};
