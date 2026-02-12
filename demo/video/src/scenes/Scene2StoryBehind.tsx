import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage } from '../components/ChatMessage';
import { TypewriterText } from '../components/TypewriterText';
import { ToolIndicator } from '../components/ToolIndicator';
import { ReportFragment } from '../components/ReportFragment';
import { FadeInText } from '../components/FadeInText';
import { LowerThird } from '../components/LowerThird';
import { conversations } from '../data/chatConversations';
import { reportFragments } from '../data/branchData';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

const conv = conversations.scene2;

export const Scene2StoryBehind: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 930, 20, 20);

  return (
    <div style={{ opacity: fade }}>
      <ChatInterface fadeIn={false}>
        {/* Narrator hint */}
        <Sequence from={0} durationInFrames={50} layout="none">
          <div
            style={{
              fontFamily: FONTS.primary,
              ...TEXT.caption,
              color: UI.textSecondary,
              fontStyle: 'italic',
              textAlign: 'center',
              paddingBottom: 8,
            }}
          >
            Numbers tell you what happened. But the why is buried in
            unstructured reports...
          </div>
        </Sequence>

        {/* User prompt */}
        <ChatMessage type="user" startFrame={40}>
          <TypewriterText
            text={conv.prompt}
            startFrame={45}
            charsPerFrame={1}
            style={{ color: '#fff' }}
          />
        </ChatMessage>

        {/* Tool indicator */}
        <Sequence from={120} layout="none">
          <ToolIndicator tools={conv.tools} startFrame={0} />
        </Sequence>

        {/* Searching animation */}
        <Sequence from={140} durationInFrames={40} layout="none">
          <div
            style={{
              marginLeft: 42,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.primary,
                fontSize: 14,
                color: UI.textSecondary,
              }}
            >
              Searching reports with semantic search...
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: UI.accent,
                  opacity:
                    Math.sin((frame - 140) * 0.3 + i * 1.2) > 0 ? 0.8 : 0.2,
                }}
              />
            ))}
          </div>
        </Sequence>

        {/* Report fragments */}
        <ReportFragment
          {...reportFragments.tikTok}
          startFrame={200}
        />
        <ReportFragment
          {...reportFragments.financial}
          startFrame={280}
        />

        {/* Agent synthesis */}
        <ChatMessage type="agent" startFrame={380}>
          <TypewriterText
            text={conv.response}
            startFrame={385}
            charsPerFrame={1.5}
            cursorVisible={false}
            style={{ ...TEXT.chatResponse, color: UI.text }}
          />
        </ChatMessage>
      </ChatInterface>

      <LowerThird
        text="Cohere Embed v4 + Hybrid Search"
        startFrame={500}
        durationInFrames={350}
      />
    </div>
  );
};
