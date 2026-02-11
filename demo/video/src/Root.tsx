import React from 'react';
import { Composition } from 'remotion';
import { BeanStackVideo } from './Video';
import { ColdOpen } from './scenes/ColdOpen';
import { IntroProblem } from './scenes/IntroProblem';
import { SolutionArchitecture } from './scenes/SolutionArchitecture';
import { Scene1BigPicture } from './scenes/Scene1BigPicture';
import { Scene2StoryBehind } from './scenes/Scene2StoryBehind';
import { Scene3ActOnIt } from './scenes/Scene3ActOnIt';
import { Scene4FindBroken } from './scenes/Scene4FindBroken';
import { Scene5Escalate } from './scenes/Scene5Escalate';
import { Closing } from './scenes/Closing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video */}
      <Composition
        id="BeanStackDemo"
        component={BeanStackVideo}
        durationInFrames={6300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual scenes for preview/development */}
      <Composition
        id="ColdOpen"
        component={ColdOpen}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntroProblem"
        component={IntroProblem}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SolutionArchitecture"
        component={SolutionArchitecture}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene1BigPicture"
        component={Scene1BigPicture}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2StoryBehind"
        component={Scene2StoryBehind}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3ActOnIt"
        component={Scene3ActOnIt}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4FindBroken"
        component={Scene4FindBroken}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene5Escalate"
        component={Scene5Escalate}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Closing"
        component={Closing}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
