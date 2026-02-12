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
            {/* Concentric pulsating circles */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const relFrame = Math.max(0, frame);
              const pulse = Math.sin(relFrame * 0.06 + i * 0.8) * 15;
              const size = 80 + relFrame * 4 + i * 80 + pulse;
              const opacity = interpolate(
                size,
                [80, 900],
                [0.4, 0],
                { extrapolateRight: 'clamp' },
              );
              const borderWidth = interpolate(
                size,
                [80, 900],
                [3, 1],
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
                    border: `${borderWidth}px solid ${COFFEE.warmGold}`,
                    boxShadow: `0 0 12px ${COFFEE.warmGold}40, inset 0 0 12px ${COFFEE.warmGold}20`,
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
          <SteamParticles count={70} />
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

      {/* Shot 4: Scrolling emails — Mac-style (425-605) */}
      <Sequence from={425} durationInFrames={180}>
        <AbsoluteFill style={{ opacity: shotOpacity(425, 180) }}>
          <AbsoluteFill style={{ backgroundColor: UI.background }}>
            {(() => {
              const rel = frame - 425;
              // Two separate trackpad flick gestures
              // Gesture 1: frames 0-80, ease-in then momentum ease-out
              // Pause: frames 80-100
              // Gesture 2: frames 100-170, ease-in then momentum ease-out
              const flick = (t: number) => {
                // Accelerate then decelerate (like a real flick)
                if (t < 0.3) return 0.5 * Math.pow(t / 0.3, 2); // ease-in
                return 0.5 + 0.5 * (1 - Math.pow(1 - (t - 0.3) / 0.7, 2.5)); // momentum ease-out
              };

              let scrollY = 0;
              if (rel < 80) {
                const t1 = Math.max(0, rel) / 80;
                scrollY = flick(t1) * 350;
              } else if (rel < 100) {
                // Pause between flicks
                scrollY = 350;
              } else {
                scrollY = 350;
                const t2 = Math.min(1, (rel - 100) / 70);
                scrollY += flick(t2) * 300;
              }
              return (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      padding: '60px 200px',
                      transform: `translateY(${-scrollY}px)`,
                    }}
                  >
                    {emailSubjects.concat(emailSubjects).map((subject, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '14px 20px',
                          backgroundColor: UI.surface,
                          borderRadius: 8,
                          border: `1px solid ${UI.border}`,
                          fontFamily: FONTS.primary,
                          fontSize: 18,
                          color: UI.textSecondary,
                        }}
                      >
                        <span style={{ color: UI.text, fontWeight: 500 }}>
                          📧 Branch Manager:{' '}
                        </span>
                        {subject}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {/* Mac-style top + bottom fade masks */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 120,
                background: `linear-gradient(to bottom, ${UI.background} 0%, transparent 100%)`,
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 200,
                background: `linear-gradient(to top, ${UI.background} 0%, transparent 100%)`,
                pointerEvents: 'none',
              }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* Shot 5: Frustrated manager — business woman clip (595-735) */}
      <Sequence from={595} durationInFrames={140}>
        <AbsoluteFill style={{ opacity: shotOpacity(595, 140) }}>
          <OffthreadVideo
            src={staticFile('business woman.mov')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(1.1) sepia(0.15) brightness(1.05)',
            }}
          />
          {/* Warm tint overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(139, 90, 43, 0.15)',
              mixBlendMode: 'multiply',
            }}
          />
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.35)',
            }}
          />
          {/* Orbiting stress text fragments */}
          <AbsoluteFill
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
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
              const radius = 200 + Math.sin(frame * 0.02 + i) * 35;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(35% + ${y}px)`,
                    fontFamily: FONTS.primary,
                    fontSize: 22,
                    color: COFFEE.cream,
                    opacity: 0.5,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {text}
                </div>
              );
            })}
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
        startFrame={250}
        durationInFrames={155}
      />
      <LowerThird
        text="Hundreds of weekly operational updates"
        startFrame={450}
        durationInFrames={150}
      />
    </AbsoluteFill>
  );
};
