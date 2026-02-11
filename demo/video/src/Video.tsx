import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { ColdOpen } from './scenes/ColdOpen';
import { IntroProblem } from './scenes/IntroProblem';
import { SolutionArchitecture } from './scenes/SolutionArchitecture';
import { Scene1BigPicture } from './scenes/Scene1BigPicture';
import { Scene2StoryBehind } from './scenes/Scene2StoryBehind';
import { Scene3ActOnIt } from './scenes/Scene3ActOnIt';
import { Scene4FindBroken } from './scenes/Scene4FindBroken';
import { Scene5Escalate } from './scenes/Scene5Escalate';
import { Closing } from './scenes/Closing';

/**
 * BeanStack Demo Video — 3:30 (6300 frames at 30fps)
 *
 * Scene timeline (absolute frames):
 * - ColdOpen:              0–150     (5s)
 * - IntroProblem:        130–1050   (30s, 20-frame overlap for crossfade)
 * - SolutionArchitecture: 1030–1950  (30s)
 * - Scene1 BigPicture:   1930–2700  (25s)
 * - Scene2 StoryBehind:  2680–3600  (30s)
 * - Scene3 ActOnIt:      3580–4200  (20s)
 * - Scene4 FindBroken:   4180–5100  (30s)
 * - Scene5 Escalate:     5080–5850  (25s)
 * - Closing:             5830–6300  (15s)
 */
export const BeanStackVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={0} durationInFrames={170}>
        <ColdOpen />
      </Sequence>

      <Sequence from={130} durationInFrames={940}>
        <IntroProblem />
      </Sequence>

      <Sequence from={1030} durationInFrames={940}>
        <SolutionArchitecture />
      </Sequence>

      <Sequence from={1930} durationInFrames={790}>
        <Scene1BigPicture />
      </Sequence>

      <Sequence from={2680} durationInFrames={940}>
        <Scene2StoryBehind />
      </Sequence>

      <Sequence from={3580} durationInFrames={640}>
        <Scene3ActOnIt />
      </Sequence>

      <Sequence from={4180} durationInFrames={940}>
        <Scene4FindBroken />
      </Sequence>

      <Sequence from={5080} durationInFrames={790}>
        <Scene5Escalate />
      </Sequence>

      <Sequence from={5830} durationInFrames={470}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
