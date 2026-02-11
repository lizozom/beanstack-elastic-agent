import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';

interface ChatInterfaceProps {
  children: React.ReactNode;
  title?: string;
  fadeIn?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  children,
  title = 'BeanStack Agent',
  fadeIn = true,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: UI.background,
        opacity,
        padding: 40,
      }}
    >
      {/* Container */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${UI.border}`,
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: 260,
            backgroundColor: UI.surface,
            borderRight: `1px solid ${UI.border}`,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.primary,
              ...TEXT.h3,
              color: UI.text,
              marginBottom: 20,
            }}
          >
            ☕ BeanStack
          </div>
          {/* Fake conversation list */}
          {['Daily Brief', 'Regional Analysis', 'Staff Query'].map(
            (item, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  backgroundColor:
                    i === 1 ? UI.surfaceLight : 'transparent',
                  fontFamily: FONTS.primary,
                  fontSize: 15,
                  color: i === 1 ? UI.text : UI.textSecondary,
                }}
              >
                {item}
              </div>
            ),
          )}
        </div>

        {/* Main chat area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: UI.background,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${UI.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #8D6E63)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              ☕
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 16,
                  fontWeight: 600,
                  color: UI.text,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 12,
                  color: UI.accentGreen,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: UI.accentGreen,
                  }}
                />
                Online
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflow: 'hidden',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
