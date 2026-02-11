import React from 'react';
import { Sequence, useCurrentFrame } from 'remotion';
import { ChatInterface } from '../components/ChatInterface';
import { ChatMessage } from '../components/ChatMessage';
import { TypewriterText } from '../components/TypewriterText';
import { ToolIndicator } from '../components/ToolIndicator';
import { WorkflowChain } from '../components/WorkflowChain';
import { LowerThird } from '../components/LowerThird';
import { conversations } from '../data/chatConversations';
import { workflowSteps } from '../data/branchData';
import { UI } from '../theme/colors';
import { TEXT } from '../theme/typography';
import { sceneFade } from '../utils/frameUtils';

const conv = conversations.scene3;

export const Scene3ActOnIt: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 630, 20, 20);

  return (
    <div style={{ opacity: fade }}>
      <ChatInterface fadeIn={false}>
        {/* User prompt */}
        <ChatMessage type="user" startFrame={10}>
          <TypewriterText
            text={conv.prompt}
            startFrame={15}
            charsPerFrame={1.2}
            style={{ color: '#fff' }}
          />
        </ChatMessage>

        {/* Tool indicator */}
        <Sequence from={90}>
          <ToolIndicator tools={conv.tools} startFrame={0} />
        </Sequence>

        {/* Workflow animation */}
        <Sequence from={120}>
          <WorkflowChain
            steps={workflowSteps.sendEmail}
            startFrame={0}
            stepDuration={25}
          />
        </Sequence>

        {/* Confirmation */}
        <ChatMessage type="agent" startFrame={310}>
          <TypewriterText
            text={conv.response}
            startFrame={315}
            charsPerFrame={1.5}
            cursorVisible={false}
            style={{ ...TEXT.chatResponse, color: UI.text }}
          />
        </ChatMessage>

        {/* Notification chime visual */}
        <Sequence from={350} durationInFrames={30}>
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 30,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 8,
              backgroundColor: UI.accentGreen + '20',
              border: `1px solid ${UI.accentGreen}40`,
            }}
          >
            <span style={{ fontSize: 16 }}>🔔</span>
            <span
              style={{
                fontSize: 13,
                color: UI.accentGreen,
                fontWeight: 600,
              }}
            >
              Email sent successfully
            </span>
          </div>
        </Sequence>
      </ChatInterface>

      <LowerThird
        text="Kibana Workflow: send_manager_message — deterministic, auditable"
        startFrame={300}
        durationInFrames={280}
      />
    </div>
  );
};
