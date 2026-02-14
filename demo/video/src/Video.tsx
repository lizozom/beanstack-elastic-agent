import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
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
      <Sequence from={0} durationInFrames={200}>
        <ColdOpen />
      </Sequence>

      <Sequence from={175} durationInFrames={955}>
        <IntroProblem />
        <Audio src={staticFile('01 - INTRO THE PROBLEM.mp3')} playbackRate={1.1} />
      </Sequence>

      <Sequence from={1130} durationInFrames={940}>
        <SolutionArchitecture />
        <Sequence from={15}>
          <Audio src={staticFile('02 - ARCHITECTURE.mp3')} playbackRate={1.1} />
        </Sequence>
      </Sequence>

      <Sequence from={2070} durationInFrames={640}>
        <Scene1BigPicture />
        <Sequence from={0}>
          <Audio src={staticFile('03 - big pic 1.mp3')} playbackRate={1.1} />
        </Sequence>
        <Sequence from={190}>
          <Audio src={staticFile('04 - big pic 2.mp3')} playbackRate={1.1} />
        </Sequence>
      </Sequence>

      <Sequence from={2710} durationInFrames={700}>
        <Scene2StoryBehind />
        <Audio src={staticFile('05 - semantic.mp3')} playbackRate={1.1} />
      </Sequence>

      <Sequence from={3410} durationInFrames={640}>
        <Scene3ActOnIt />
        <Audio src={staticFile('06 - action.mp3')} playbackRate={1.1} />
      </Sequence>

      <Sequence from={4050} durationInFrames={940}>
        <Scene4FindBroken />
      </Sequence>

      <Sequence from={5095} durationInFrames={790}>
        <Scene5Escalate />
      </Sequence>

      <Sequence from={5845} durationInFrames={470}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
};
