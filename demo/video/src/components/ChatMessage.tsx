import React from 'react';
import { Img, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { FONTS } from '../theme/typography';

interface ChatMessageProps {
  type: 'user' | 'agent';
  children: React.ReactNode;
  startFrame?: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  children,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appear = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.5 },
  });

  if (frame < startFrame) return null;

  const isUser = type === 'user';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 10}px)`,
        padding: '8px 0',
      }}
    >
      {/* Slack-style rounded-square avatar */}
      {isUser ? (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #5B4A9E, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
            color: '#fff',
          }}
        >
          👤
        </div>
      ) : (
        <Img
          src={staticFile('beanstack.jpg')}
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + badge + timestamp */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.primary,
              fontSize: 30,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {isUser ? 'You' : 'BeanStack Agent'}
          </span>
          {!isUser && (
            <span
              style={{
                fontFamily: FONTS.primary,
                fontSize: 18,
                fontWeight: 600,
                color: '#D1D2D3',
                backgroundColor: '#35373B',
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: 0.5,
              }}
            >
              APP
            </span>
          )}
          <span
            style={{
              fontFamily: FONTS.primary,
              fontSize: 20,
              color: '#ABABAD',
            }}
          >
            {isUser ? '10:32 AM' : '10:33 AM'}
          </span>
        </div>

        {/* Message content — flat, no bubble */}
        <div
          style={{
            fontFamily: FONTS.primary,
            fontSize: 34,
            lineHeight: 1.5,
            color: '#D1D2D3',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
