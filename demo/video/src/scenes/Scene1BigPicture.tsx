import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage } from '../components/ChatMessage';
import { TypewriterText } from '../components/TypewriterText';
import { ToolIndicator } from '../components/ToolIndicator';
import { BarChart } from '../components/BarChart';
import { FadeInText } from '../components/FadeInText';
import { LowerThird } from '../components/LowerThird';
import { conversations } from '../data/chatConversations';
import { regionRevenue, formatRevenue } from '../data/regionData';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

const conv = conversations.scene1;

export const Scene1BigPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 780, 20, 20);

  return (
    <div style={{ opacity: fade }}>
      <ChatInterface fadeIn={false}>
        {/* Narrator hint */}
        <Sequence from={0} durationInFrames={50}>
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
            The operations lead wants to compare how their biggest markets are
            performing...
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
        <Sequence from={110}>
          <ToolIndicator tools={conv.tools} startFrame={0} />
        </Sequence>

        {/* Agent response */}
        <ChatMessage type="agent" startFrame={150}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FadeInText
              text="Revenue by Region (2025)"
              delay={0}
              style={{
                ...TEXT.h3,
                fontSize: 18,
                fontWeight: 600,
                color: UI.text,
              }}
            />

            <Sequence from={160}>
              <BarChart
                data={regionRevenue}
                startFrame={0}
                formatValue={formatRevenue}
              />
            </Sequence>

            <Sequence from={250}>
              <FadeInText
                text="BeanStack Uptown New York stands out — $960K in Q3 alone, far above the regional average."
                delay={0}
                style={{
                  ...TEXT.chatResponse,
                  color: UI.textSecondary,
                  marginTop: 8,
                }}
              />
            </Sequence>
          </div>
        </ChatMessage>
      </ChatInterface>

      <LowerThird
        text="ES|QL: revenue_by_region → Index: search_financial_reports"
        startFrame={400}
        durationInFrames={300}
      />
    </div>
  );
};
