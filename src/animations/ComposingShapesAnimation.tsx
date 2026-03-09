import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Composing Shapes Animation (圖形拼砌)
 * Two shapes combine into a new composite shape.
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const ComposingShapesAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Two triangles appear (frames 0-30)
  const shape1Opacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shape2Opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Shapes slide together (frames 40-80)
  const slideProgress = interpolate(frame, [40, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shape1X = interpolate(slideProgress, [0, 1], [-80, -1]);
  const shape2X = interpolate(slideProgress, [0, 1], [80, 1]);

  // Phase 3: Combined shape label (frames 90-150)
  const resultOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const arrowOpacity = interpolate(frame, [80, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E0F7FA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#00695C', fontWeight: 'bold', marginBottom: 24 }}>
        圖形拼砌 Composing Shapes
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        {/* Triangle 1 */}
        <div
          style={{
            opacity: shape1Opacity,
            transform: `translateX(${shape1X}px)`,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: '70px solid #26A69A',
            }}
          />
        </div>

        {/* Triangle 2 (flipped) */}
        <div
          style={{
            opacity: shape2Opacity,
            transform: `translateX(${shape2X}px) scaleX(-1)`,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: '70px solid #80CBC4',
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: 28, opacity: arrowOpacity, marginBottom: 12 }}>⬇️</div>

      <div
        style={{
          opacity: resultOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Combined: a rectangle-like shape */}
        <div
          style={{
            width: 80,
            height: 70,
            backgroundColor: '#26A69A',
            borderRadius: 4,
          }}
        />
        <span style={{ fontSize: 20, fontWeight: 'bold', color: '#00695C' }}>
          正方形！Square!
        </span>
      </div>
    </AbsoluteFill>
  );
};
