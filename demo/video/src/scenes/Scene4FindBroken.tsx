import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage } from '../components/ChatMessage';
import { TypewriterText } from '../components/TypewriterText';
import { ToolIndicator } from '../components/ToolIndicator';
import { DataTable } from '../components/DataTable';
import { ReportFragment } from '../components/ReportFragment';
import { FadeInText } from '../components/FadeInText';
import { LowerThird } from '../components/LowerThird';
import { conversations } from '../data/chatConversations';
import { underperformingBranches, reportFragments } from '../data/branchData';
import { UI } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

const conv = conversations.scene4;

export const Scene4FindBroken: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 930, 20, 20);

  const tableHeaders = [
    'Branch',
    'Revenue',
    'Satisfaction',
    'Equipment Issues',
    'Key Issue',
  ];
  const tableRows = underperformingBranches.map((b) => [
    b.name,
    b.revenue,
    b.satisfaction,
    b.equipmentIssues,
    b.keyIssue,
  ]);

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
            Finding the branches that need help before it's too late...
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

        {/* Tool indicators - showing chain */}
        <Sequence from={110}>
          <ToolIndicator tools={conv.tools} startFrame={0} staggerFrames={30} />
        </Sequence>

        {/* Agent response with data table */}
        <ChatMessage type="agent" startFrame={170}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FadeInText
              text="Branches with Consistently Low Performance"
              delay={0}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: UI.text,
              }}
            />

            <Sequence from={180}>
              <DataTable
                headers={tableHeaders}
                rows={tableRows}
                startFrame={0}
                highlightRows={[0]}
              />
            </Sequence>
          </div>
        </ChatMessage>

        {/* Report fragments for root causes */}
        <ReportFragment
          {...reportFragments.fire}
          startFrame={420}
        />
        <ReportFragment
          {...reportFragments.walkout}
          startFrame={500}
        />

        {/* Summary */}
        <Sequence from={600}>
          <ChatMessage type="agent" startFrame={600}>
            <TypewriterText
              text="Structured data flags the problem. Unstructured reports explain the cause. The agent connects both."
              startFrame={605}
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
