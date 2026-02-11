import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';

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
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 10}px)`,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #8D6E63)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
            marginTop: 4,
          }}
        >
          ☕
        </div>
      )}
      <div
        style={{
          maxWidth: '75%',
          padding: '12px 18px',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isUser ? UI.userBubble : UI.agentBubble,
          fontFamily: FONTS.primary,
          ...TEXT.chatResponse,
          color: UI.text,
        }}
      >
        {children}
      </div>
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: UI.surfaceLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
            marginTop: 4,
            color: UI.text,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
};
