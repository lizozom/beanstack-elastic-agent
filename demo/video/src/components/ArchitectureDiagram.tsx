import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { UI, COFFEE } from '../theme/colors';
import { FONTS } from '../theme/typography';

interface NodeDef {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  color: string;
  subItems?: string[];
}

interface EdgeDef {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

const nodes: NodeDef[] = [
  {
    id: 'user',
    label: 'User',
    icon: '💬',
    x: 210,
    y: 400,
    width: 200,
    color: UI.accent,
    subItems: ['Slack', 'WhatsApp', 'Chat'],
  },
  {
    id: 'agent',
    label: 'Elastic Agent Builder',
    sublabel: 'Claude 4.5',
    icon: '🤖',
    x: 590,
    y: 400,
    width: 260,
    color: COFFEE.amber,
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '🛠️',
    x: 1010,
    y: 400,
    width: 280,
    color: UI.accentGreen,
    subItems: ['Index Search (4)', 'ES|QL (10)', 'Workflows (3)'],
  },
  {
    id: 'es',
    label: 'Elasticsearch + Kibana',
    icon: '🔎',
    x: 1450,
    y: 400,
    width: 260,
    color: '#00BFB3',
  },
];

const edges: EdgeDef[] = [
  { fromX: 410, fromY: 440, toX: 590, toY: 440 },
  { fromX: 850, fromY: 440, toX: 1010, toY: 440 },
  { fromX: 1290, fromY: 440, toX: 1450, toY: 440 },
];

const NODE_STAGGER = 45;
const EDGE_STAGGER = 40;

export const ArchitectureDiagram: React.FC<{ startFrame?: number }> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ position: 'relative', width: 1920, height: 1080 }}>
      {/* Edges (drawn lines) */}
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {edges.map((edge, i) => {
          const edgeStart = startFrame + (i + 1) * NODE_STAGGER - 10;
          const length = edge.toX - edge.fromX;
          const progress = interpolate(
            frame,
            [edgeStart, edgeStart + EDGE_STAGGER],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );

          return (
            <g key={i}>
              <line
                x1={edge.fromX}
                y1={edge.fromY}
                x2={edge.fromX + length * progress}
                y2={edge.toY}
                stroke={UI.textSecondary}
                strokeWidth={2}
                strokeDasharray="8,4"
              />
              {/* Arrow head */}
              {progress > 0.9 && (
                <polygon
                  points={`${edge.toX - 8},${edge.toY - 6} ${edge.toX},${edge.toY} ${edge.toX - 8},${edge.toY + 6}`}
                  fill={UI.textSecondary}
                  opacity={interpolate(progress, [0.9, 1], [0, 1])}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
        const s = spring({
          frame: frame - startFrame - i * NODE_STAGGER,
          fps,
          config: { damping: 15, stiffness: 150, mass: 0.6 },
        });

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: node.x,
              top: node.y,
              width: node.width,
              opacity: s,
              transform: `scale(${s}) translateY(${(1 - s) * 20}px)`,
            }}
          >
            {/* Main card */}
            <div
              style={{
                backgroundColor: UI.surface,
                border: `1px solid ${node.color}40`,
                borderRadius: 12,
                padding: '16px 20px',
                textAlign: 'center',
                boxShadow: `0 0 20px ${node.color}15`,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{node.icon}</div>
              <div
                style={{
                  fontFamily: FONTS.primary,
                  fontSize: 16,
                  fontWeight: 600,
                  color: UI.text,
                }}
              >
                {node.label}
              </div>
              {node.sublabel && (
                <div
                  style={{
                    fontFamily: FONTS.primary,
                    fontSize: 13,
                    color: node.color,
                    marginTop: 4,
                  }}
                >
                  {node.sublabel}
                </div>
              )}
            </div>

            {/* Sub-items */}
            {node.subItems && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: 8,
                }}
              >
                {node.subItems.map((sub, si) => {
                  const subS = spring({
                    frame:
                      frame - startFrame - i * NODE_STAGGER - 15 - si * 8,
                    fps,
                    config: { damping: 20, stiffness: 200, mass: 0.5 },
                  });

                  return (
                    <div
                      key={si}
                      style={{
                        opacity: subS,
                        transform: `translateY(${(1 - subS) * 8}px)`,
                        padding: '6px 12px',
                        borderRadius: 6,
                        backgroundColor: `${node.color}15`,
                        border: `1px solid ${node.color}25`,
                        fontFamily: FONTS.primary,
                        fontSize: 13,
                        color: UI.textSecondary,
                        textAlign: 'center',
                      }}
                    >
                      {sub}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
