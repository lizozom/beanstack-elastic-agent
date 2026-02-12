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

const conv = conversations.scene5;

export const Scene5Escalate: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 780, 20, 20);

  return (
    <div style={{ opacity: fade }}>
      <ChatInterface fadeIn={false}>
        {/* User prompt */}
        <ChatMessage type="user" startFrame={10}>
          <TypewriterText
            text={conv.prompt}
            startFrame={15}
            charsPerFrame={1}
            style={{ color: '#fff' }}
          />
        </ChatMessage>

        {/* Tool indicator */}
        <Sequence from={110} layout="none">
          <ToolIndicator tools={conv.tools} startFrame={0} />
        </Sequence>

        {/* Escalation workflow */}
        <Sequence from={140} layout="none">
          <WorkflowChain
            steps={workflowSteps.escalation}
            startFrame={0}
            stepDuration={30}
          />
        </Sequence>

        {/* Confirmation */}
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
        text="Escalation workflow: case + email + audit log — one prompt"
        startFrame={400}
        durationInFrames={320}
      />
    </div>
  );
};
