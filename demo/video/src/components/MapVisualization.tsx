import React from 'react';
import {
  useCurrentFrame,
  spring,
  useVideoConfig,
  AbsoluteFill,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { COFFEE } from '../theme/colors';

interface Pin {
  lat: number;
  lon: number;
  label: string;
}

interface MapVisualizationProps {
  pins: Pin[];
  startFrame?: number;
  pinStaggerFrames?: number;
}

// The usa.svg geoViewBox: -127.55 50.67 -64.55 24.34
// The usa.svg viewBox: 477 421 593.38 318.29
// This maps geographic coordinates to SVG coordinates
const GEO_LEFT = -127.55;
const GEO_TOP = 50.67;
const GEO_RIGHT = -64.55;
const GEO_BOTTOM = 24.34;

const SVG_X = 477;
const SVG_Y = 421;
const SVG_W = 593.38;
const SVG_H = 318.29;

// Display dimensions (the map image rendered at this size)
const DISPLAY_W = 1920;
const DISPLAY_H = (DISPLAY_W / SVG_W) * SVG_H; // maintain aspect ratio

const projectPin = (lat: number, lon: number) => {
  // Geo to normalized [0,1]
  const nx = (lon - GEO_LEFT) / (GEO_RIGHT - GEO_LEFT);
  const ny = (GEO_TOP - lat) / (GEO_TOP - GEO_BOTTOM); // lat is inverted

  // Normalized to display pixels
  const x = nx * DISPLAY_W;
  const y = ny * DISPLAY_H;

  // Center vertically on screen
  const offsetY = (1080 - DISPLAY_H) / 2;

  return { x, y: y + offsetY };
};

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  pins,
  startFrame = 0,
  pinStaggerFrames = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Parallax zoom — slow zoom from 1.0 to 1.15
  const scale = interpolate(frame, [0, 200], [1.0, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Slight pan toward northeast as we zoom
  const panX = interpolate(frame, [0, 200], [0, -80], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const panY = interpolate(frame, [0, 200], [0, -40], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Map fade-in
  const mapOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const verticalOffset = (1080 - DISPLAY_H) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0C' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: '70% 35%', // Toward NE cluster
          position: 'relative',
        }}
      >
        {/* Real US map SVG — inverted to white then tinted to coffee caramel */}
        <div
          style={{
            position: 'absolute',
            top: verticalOffset,
            left: 0,
            width: DISPLAY_W,
            height: DISPLAY_H,
            opacity: mapOpacity * 0.25,
            // invert black→white, then sepia for warm brown tone
            filter:
              'invert(1) sepia(0.4) hue-rotate(-10deg) saturate(0.5) brightness(0.8)',
          }}
        >
          <Img
            src={staticFile('usa.svg')}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Brighter edge glow layer in amber */}
        <div
          style={{
            position: 'absolute',
            top: verticalOffset,
            left: 0,
            width: DISPLAY_W,
            height: DISPLAY_H,
            opacity: mapOpacity * 0.12,
            // invert then push toward amber/gold
            filter:
              'invert(1) sepia(1) hue-rotate(5deg) saturate(2) brightness(1.2) contrast(1.5)',
            mixBlendMode: 'screen',
          }}
        >
          <Img
            src={staticFile('usa.svg')}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Pins */}
        {pins.map((pin, i) => {
          const { x, y } = projectPin(pin.lat, pin.lon);
          const pinFrame = frame - startFrame - i * pinStaggerFrames;
          const s = spring({
            frame: pinFrame,
            fps,
            config: { damping: 12, stiffness: 200, mass: 0.4 },
          });

          if (pinFrame < -5) return null;

          // Pulse ring on landing
          const ringScale = interpolate(pinFrame, [0, 20], [1, 3], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const ringOpacity = interpolate(pinFrame, [0, 20], [0.6, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <React.Fragment key={i}>
              {/* Pulse ring */}
              {pinFrame > 0 && pinFrame < 20 && (
                <div
                  style={{
                    position: 'absolute',
                    left: x - 8,
                    top: y - 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    border: `1px solid ${COFFEE.amber}`,
                    transform: `scale(${ringScale})`,
                    opacity: ringOpacity,
                    pointerEvents: 'none',
                  }}
                />
              )}
              {/* Pin dot */}
              <div
                style={{
                  position: 'absolute',
                  left: x - 5,
                  top: y - 5,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: COFFEE.amber,
                  transform: `scale(${s})`,
                  boxShadow: `0 0 8px ${COFFEE.amber}60, 0 0 20px ${COFFEE.amber}20`,
                }}
              />
            </React.Fragment>
          );
        })}
      </div>

      {/* Vignette overlay — focus toward NE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 35%, transparent 35%, rgba(10,10,12,0.7) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
