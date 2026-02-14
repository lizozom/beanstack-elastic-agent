import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from 'remotion';
import { UI } from '../theme/colors';
import { FONTS } from '../theme/typography';

// Slack dark mode palette
const SLACK = {
  sidebarBg: '#19171D',
  sidebarActive: '#1164A3',
  sidebarText: '#D1D2D3',
  sidebarMuted: '#ABABAD',
  headerBg: '#222529',
  mainBg: '#1A1D21',
  inputBorder: '#565856',
  divider: '#35373B',
  green: '#2BAC76',
};

interface ChatInterfaceProps {
  children: React.ReactNode;
  title?: string;
  fadeIn?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  children,
  title = 'beanstack-agent',
  fadeIn = true,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, 15], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: SLACK.mainBg, opacity }}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* ── Slack Sidebar ── */}
        <div
          style={{
            width: 340,
            backgroundColor: SLACK.sidebarBg,
            borderRight: `1px solid ${SLACK.divider}`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Workspace header */}
          <div
            style={{
              padding: '20px 24px 16px',
              borderBottom: `1px solid ${SLACK.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Img
              src={staticFile('beanstack.jpg')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                fontFamily: FONTS.primary,
                fontSize: 28,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              BeanStack HQ
            </div>
            <div
              style={{
                marginLeft: 'auto',
                fontSize: 24,
                color: SLACK.sidebarMuted,
              }}
            >
              ▾
            </div>
          </div>

          {/* Channels */}
          <div style={{ padding: '18px 0 8px' }}>
            <div
              style={{
                padding: '0 24px 10px',
                fontFamily: FONTS.primary,
                fontSize: 20,
                fontWeight: 600,
                color: SLACK.sidebarMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Channels</span>
              <span style={{ fontSize: 24, fontWeight: 400, cursor: 'pointer' }}>
                +
              </span>
            </div>

            {[
              { name: 'general', active: false },
              { name: 'ops-updates', active: false },
              { name: 'beanstack-agent', active: true },
              { name: 'incidents', active: false },
              { name: 'reports', active: false },
            ].map((ch) => (
              <div
                key={ch.name}
                style={{
                  padding: '7px 24px',
                  fontFamily: FONTS.primary,
                  fontSize: 24,
                  color: ch.active ? '#fff' : SLACK.sidebarText,
                  fontWeight: ch.active ? 700 : 400,
                  backgroundColor: ch.active ? SLACK.sidebarActive : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontWeight: 400,
                    color: ch.active ? '#fff' : SLACK.sidebarMuted,
                    fontSize: 22,
                  }}
                >
                  #
                </span>
                {ch.name}
              </div>
            ))}
          </div>

          {/* Direct Messages */}
          <div style={{ padding: '12px 0' }}>
            <div
              style={{
                padding: '0 24px 10px',
                fontFamily: FONTS.primary,
                fontSize: 20,
                fontWeight: 600,
                color: SLACK.sidebarMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Direct Messages</span>
              <span style={{ fontSize: 24, fontWeight: 400, cursor: 'pointer' }}>
                +
              </span>
            </div>

            {[
              { name: 'Marcus Johnson', online: true },
              { name: 'Sarah Chen', online: true },
              { name: 'David Park', online: false },
            ].map((dm) => (
              <div
                key={dm.name}
                style={{
                  padding: '7px 24px',
                  fontFamily: FONTS.primary,
                  fontSize: 22,
                  color: SLACK.sidebarText,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    backgroundColor: dm.online ? SLACK.green : 'transparent',
                    border: dm.online
                      ? 'none'
                      : `2px solid ${SLACK.sidebarMuted}`,
                    flexShrink: 0,
                  }}
                />
                {dm.name}
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Chat Area ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: SLACK.mainBg,
          }}
        >
          {/* Channel header */}
          <div
            style={{
              padding: '14px 32px',
              borderBottom: `1px solid ${SLACK.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontWeight: 400, color: SLACK.sidebarMuted }}>
                  #
                </span>{' '}
                {title}
              </div>
              <span
                style={{
                  fontSize: 24,
                  color: SLACK.sidebarMuted,
                  marginLeft: 4,
                }}
              >
                ☆
              </span>
              <div
                style={{
                  width: 1,
                  height: 24,
                  backgroundColor: SLACK.divider,
                  marginLeft: 8,
                  marginRight: 4,
                }}
              />
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 20,
                  color: SLACK.sidebarMuted,
                }}
              >
                Operations intelligence agent
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                fontSize: 22,
                color: SLACK.sidebarMuted,
              }}
            >
              <span>👥 3</span>
              <span>📌</span>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              padding: '20px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              overflow: 'hidden',
            }}
          >
            {children}
          </div>

          {/* Input bar */}
          <div style={{ padding: '8px 32px 20px' }}>
            <div
              style={{
                border: `2px solid ${SLACK.inputBorder}`,
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 22,
                  color: SLACK.sidebarMuted,
                }}
              >
                Message #{title}
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 18,
                  fontSize: 22,
                  color: SLACK.sidebarMuted,
                }}
              >
                <span style={{ fontWeight: 700 }}>B</span>
                <span style={{ fontStyle: 'italic' }}>I</span>
                <span>🔗</span>
                <span>📎</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
