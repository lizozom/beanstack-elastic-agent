import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage } from '../components/ChatMessage';
import { TypewriterText } from '../components/TypewriterText';
import { ToolIndicator } from '../components/ToolIndicator';
import { FadeInText } from '../components/FadeInText';
import { LowerThird } from '../components/LowerThird';
import { conversations } from '../data/chatConversations';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

const conv = conversations.scene4;

const findings = [
  {
    branch: 'BeanStack Davis Philadelphia',
    revenue: '$280K',
    issue: '3 equipment fires this year — branch closed twice',
    color: UI.accentRed,
  },
  {
    branch: 'BeanStack Angel New York',
    revenue: '$310K',
    issue: 'Staff walkout after AC failure — skeleton crew for 2 weeks',
    color: UI.accentAmber,
  },
  {
    branch: 'BeanStack Downtown Charlotte',
    revenue: '$295K',
    issue: 'Chronic maintenance issues — 8 equipment failures in 6 months',
    color: UI.accentAmber,
  },
];

export const Scene4FindBroken: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 930, 20, 20);

  return (
    <div style={{ opacity: fade }}>
      <ChatInterface fadeIn={false}>
        {/* User prompt */}
        <ChatMessage type="user" startFrame={40}>
          <TypewriterText
            text={conv.prompt}
            startFrame={45}
            charsPerFrame={1}
            style={{ color: '#fff' }}
          />
        </ChatMessage>

        {/* Tool indicators - showing chain */}
        <Sequence from={110} layout="none">
          <ToolIndicator tools={conv.tools} startFrame={0} staggerFrames={30} />
        </Sequence>

        {/* Agent response with findings */}
        <ChatMessage type="agent" startFrame={170}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FadeInText
              text="Found 3 consistently underperforming branches:"
              delay={0}
              style={{
                ...TEXT.chatResponse,
                fontWeight: 600,
                color: UI.text,
              }}
            />

            {findings.map((f, i) => (
              <Sequence key={i} from={220 + i * 60} layout="none">
                <div
                  style={{
                    borderLeft: `4px solid ${f.color}`,
                    paddingLeft: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONTS.primary,
                      fontSize: 28,
                      fontWeight: 600,
                      color: UI.text,
                    }}
                  >
                    {f.branch}
                    <span
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 24,
                        fontWeight: 400,
                        color: f.color,
                        marginLeft: 12,
                      }}
                    >
                      {f.revenue}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: FONTS.primary,
                      fontSize: 24,
                      color: UI.textSecondary,
                    }}
                  >
                    {f.issue}
                  </div>
                </div>
              </Sequence>
            ))}
          </div>
        </ChatMessage>

        {/* Summary */}
        <Sequence from={500} layout="none">
          <ChatMessage type="agent" startFrame={500}>
            <TypewriterText
              text="Structured data flags the problem. Unstructured reports explain the cause. The agent connects both."
              startFrame={505}
              charsPerFrame={1.5}
              cursorVisible={false}
              style={{ ...TEXT.chatResponse, color: UI.textSecondary, fontStyle: 'italic' }}
            />
          </ChatMessage>
        </Sequence>
      </ChatInterface>

      <LowerThird
        text="Tool chaining: ES|QL analytics → semantic search → root cause"
        startFrame={500}
        durationInFrames={350}
      />
    </div>
  );
};
