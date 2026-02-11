import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  OffthreadVideo,
  staticFile,
} from 'remotion';
import { SteamParticles } from '../components/SteamParticles';
import { MapVisualization } from '../components/MapVisualization';
import { FadeInText } from '../components/FadeInText';
import { LowerThird } from '../components/LowerThird';
import { ChatInterface } from '../components/ChatInterface';
import { COFFEE, UI, CLOSING } from '../theme/colors';
import { FONTS, TEXT } from '../theme/typography';
import { mapPins } from '../data/branchData';
import { sceneFade } from '../utils/frameUtils';

// Scrolling email subject lines
const emailSubjects = [
  'Week of Jan 15 — rough one',
  'Equipment update needed ASAP',
  'Q3 numbers are in',
  'Staff shortage this weekend',
  'Espresso machine #2 down again',
  'Holiday rush prep',
  'Supply chain delay — need alternatives',
  'Health inspection passed (barely)',
  'AC broken — staff complaints',
  'Weekend event: marathon nearby',
  'Pumpkin spice season update',
  'Pest control follow-up',
  'New barista training schedule',
  'Revenue drop — what happened?',
];

export const IntroProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = sceneFade(frame, 900, 0, 20);

  // Per-shot crossfade helper: fade in/out over `fadeLen` frames (quick: 10)
  const shotOpacity = (shotStart: number, shotDur: number, fadeLen = 10) => {
    const rel = frame - shotStart;
    return interpolate(rel, [0, fadeLen, shotDur - fadeLen, shotDur], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  };

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {/* Shot 1: Coffee shop video + ripple effect (0-135 = 4.5s) */}
      <Sequence from={0} durationInFrames={135}>
        <AbsoluteFill style={{ opacity: shotOpacity(0, 135) }}>
          <OffthreadVideo
            src={staticFile('coffee shop.mp4')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Dark overlay for mood */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}
          />
          <AbsoluteFill
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            {/* Concentric circles */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const relFrame = Math.max(0, frame);
              const size = 40 + relFrame * 3 + i * 50;
              const opacity = interpolate(
                size,
                [40, 500],
                [0.4, 0],
                { extrapolateRight: 'clamp' },
              );
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: `1px solid ${COFFEE.warmGold}`,
                    opacity,
                  }}
                />
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Shot 2: Espresso video + steam (125-245 = 4s) */}
      <Sequence from={125} durationInFrames={120}>
        <AbsoluteFill style={{ opacity: shotOpacity(125, 120) }}>
          <OffthreadVideo
            src={staticFile('espresso.mp4')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          {/* Dark overlay for mood */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          />
          {/* Steam overlay */}
          <SteamParticles count={50} />
        </AbsoluteFill>
      </Sequence>

      {/* Shot 3: Map with pins (235-435) */}
      <Sequence from={235} durationInFrames={200}>
        <AbsoluteFill style={{ opacity: shotOpacity(235, 200) }}>
          <AbsoluteFill style={{ backgroundColor: COFFEE.espresso }}>
            <MapVisualization pins={mapPins} startFrame={20} />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Shot 4: Scrolling emails (425-605) */}
      <Sequence from={425} durationInFrames={180}>
        <AbsoluteFill style={{ opacity: shotOpacity(425, 180) }}>
          <AbsoluteFill style={{ backgroundColor: UI.background }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '40px 200px',
                transform: `translateY(${-(frame - 425) * 3}px)`,
              }}
            >
              {emailSubjects.concat(emailSubjects).map((subject, i) => {
                const blur = Math.min((frame - 425) / 60, 3);
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: UI.surface,
                      borderRadius: 6,
                      border: `1px solid ${UI.border}`,
                      fontFamily: FONTS.primary,
                      fontSize: 18,
                      color: UI.textSecondary,
                      filter: `blur(${blur}px)`,
                      opacity: 0.7,
                    }}
                  >
                    <span style={{ color: UI.text, fontWeight: 500 }}>
                      📧 Branch Manager:{' '}
                    </span>
                    {subject}
                  </div>
                );
              })}
            </div>
            {/* Vignette overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to bottom, transparent 30%, rgba(15,15,16,0.9) 90%)',
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Shot 5: Abstract stress (595-735) */}
      <Sequence from={595} durationInFrames={140}>
        <AbsoluteFill style={{ opacity: shotOpacity(595, 140) }}>
          <AbsoluteFill style={{ backgroundColor: COFFEE.espresso }}>
            <AbsoluteFill
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              {/* Text fragments orbiting */}
              {[
                'equipment failure',
                'revenue down',
                'staffing',
                'supply chain',
                'complaints',
                'inspection',
                'turnover',
                'costs',
              ].map((text, i) => {
                const angle =
                  (i / 8) * Math.PI * 2 + (frame - 595) * 0.008;
                const radius = 180 + Math.sin(frame * 0.02 + i) * 30;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      fontFamily: FONTS.primary,
                      fontSize: 16,
                      color: COFFEE.cream,
                      opacity: 0.4,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {text}
                  </div>
                );
              })}
              {/* Center icon */}
              <div style={{ fontSize: 60, opacity: 0.7 }}>😰</div>
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Chat interface reveal (725-900) */}
      <Sequence from={725} durationInFrames={175}>
        <ChatInterface title="BeanStack Agent" fadeIn>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              opacity: interpolate(
                frame - 725,
                [20, 50],
                [0, 0.5],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              ),
            }}
          >
            <div
              style={{
                fontFamily: FONTS.primary,
                ...TEXT.bodyLarge,
                color: UI.textSecondary,
                textAlign: 'center',
              }}
            >
              Ask me anything about BeanStack operations...
            </div>
          </div>
        </ChatInterface>

        {/* Text overlay */}
        <Sequence from={50} durationInFrames={125}>
          <div
            style={{
              position: 'absolute',
              bottom: 120,
              left: 0,
              right: 0,
              textAlign: 'center',
            }}
          >
            <FadeInText
              text="Available on Slack, WhatsApp, or your client of choice"
              delay={0}
              style={{
                ...TEXT.bodyLarge,
                color: CLOSING.text,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            />
          </div>
        </Sequence>
      </Sequence>

      {/* Lower third */}
      <LowerThird
        text="BeanStack — 106 branches across the US"
        startFrame={335}
        durationInFrames={200}
      />
    </AbsoluteFill>
  );
};
