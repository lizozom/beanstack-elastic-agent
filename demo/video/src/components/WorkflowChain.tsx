import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { UI } from '../theme/colors';
import { FONTS } from '../theme/typography';

interface WorkflowStep {
  icon: string;
  label: string;
}

interface WorkflowChainProps {
  steps: WorkflowStep[];
  startFrame?: number;
  stepDuration?: number;
}

export const WorkflowChain: React.FC<WorkflowChainProps> = ({
  steps,
  startFrame = 0,
  stepDuration = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        marginLeft: 42,
        paddingLeft: 16,
      }}
    >
      {steps.map((step, i) => {
        const stepStart = startFrame + i * stepDuration;
        const appear = spring({
          frame: frame - stepStart,
          fps,
          config: { damping: 15, stiffness: 200, mass: 0.5 },
        });

        const isActive = frame >= stepStart;
        const isComplete = frame >= stepStart + stepDuration * 0.7;
        const isLast = i === steps.length - 1;

        // Spinner animation for active step
        const spinnerRotation = interpolate(
          frame,
          [stepStart, stepStart + stepDuration],
          [0, 360],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

        if (!isActive) return null;

        return (
          <div key={i} style={{ display: 'flex', gap: 0 }}>
            {/* Vertical line + circle */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 24,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: isComplete ? UI.accentGreen : UI.surfaceLight,
                  border: `2px solid ${isComplete ? UI.accentGreen : UI.accent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: isComplete ? '#fff' : UI.accent,
                  transform: `scale(${appear})`,
                }}
              >
                {isComplete ? '✓' : ''}
              </div>
              {!isLast && (
                <div
                  style={{
                    width: 2,
                    height: 20,
                    backgroundColor: isComplete ? UI.accentGreen : UI.border,
                    opacity: appear,
                  }}
                />
              )}
            </div>

            {/* Step content */}
            <div
              style={{
                paddingLeft: 10,
                paddingBottom: isLast ? 0 : 8,
                opacity: appear,
                transform: `translateX(${(1 - appear) * 15}px)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>{step.icon}</span>
                <span
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 18,
                    color: isComplete ? UI.accentGreen : UI.text,
                    fontWeight: isComplete && isLast ? 600 : 400,
                  }}
                >
                  {step.label}
                </span>
                {!isComplete && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: `2px solid ${UI.accent}`,
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      transform: `rotate(${spinnerRotation}deg)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
