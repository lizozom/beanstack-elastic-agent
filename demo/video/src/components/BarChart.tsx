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

const BAR_MAX_HEIGHT = 200;

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
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 40,
        width: '100%',
        paddingTop: 20,
      }}
    >
      {data.map((item, i) => {
        const s = spring({
          frame: frame - startFrame - i * staggerFrames,
          fps,
          config: { damping: 20, stiffness: 100, mass: 0.8 },
        });

        const barHeight = (item.value / maxValue) * BAR_MAX_HEIGHT * s;
        const isHighlight = item.highlight;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              opacity: Math.min(s * 2, 1),
            }}
          >
            {/* Value label above bar */}
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 24,
                color: isHighlight ? COFFEE.amber : UI.text,
                fontWeight: isHighlight ? 700 : 500,
              }}
            >
              {s > 0.1 ? formatValue(item.value) : ''}
            </div>

            {/* Bar */}
            <div
              style={{
                width: 100,
                height: BAR_MAX_HEIGHT,
                backgroundColor: UI.surfaceLight,
                borderRadius: 6,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: barHeight,
                  background: isHighlight
                    ? `linear-gradient(to top, ${COFFEE.amber}, ${COFFEE.warmGold})`
                    : `linear-gradient(to top, ${UI.accent}80, ${UI.accent}40)`,
                  borderRadius: 6,
                  boxShadow: isHighlight
                    ? `0 0 16px ${COFFEE.amber}40`
                    : 'none',
                }}
              />
            </div>

            {/* Label below bar */}
            <div
              style={{
                fontFamily: FONTS.primary,
                fontSize: 22,
                color: isHighlight ? COFFEE.amber : UI.textSecondary,
                fontWeight: isHighlight ? 600 : 400,
                textAlign: 'center',
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
