import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Addition within 10 Animation (基本加法)
 * Two groups of objects combine: e.g., 3 🔵 + 2 🔵 = 5 🔵
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const Addition10Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const groupA = 3;
  const groupB = 2;
  const total = groupA + groupB;

  // Phase 1: Group A appears (frames 0-30)
  const groupAOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Plus sign and Group B appear (frames 30-60)
  const plusOpacity = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupBOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Groups merge (frames 70-100)
  const mergeProgress = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 4: Show result (frames 100-150)
  const resultOpacity = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const groupAX = interpolate(mergeProgress, [0, 1], [-60, 0]);
  const groupBX = interpolate(mergeProgress, [0, 1], [60, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E3F2FD',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#1565C0', fontWeight: 'bold', marginBottom: 20 }}>
        基本加法 Addition
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            gap: 6,
            opacity: groupAOpacity,
            transform: `translateX(${groupAX}px)`,
          }}
        >
          {Array.from({ length: groupA }, (_, i) => (
            <span key={`a-${i}`} style={{ fontSize: 36 }}>🔵</span>
          ))}
        </div>

        <span style={{ fontSize: 36, fontWeight: 'bold', color: '#1565C0', opacity: plusOpacity }}>
          +
        </span>

        <div
          style={{
            display: 'flex',
            gap: 6,
            opacity: groupBOpacity,
            transform: `translateX(${groupBX}px)`,
          }}
        >
          {Array.from({ length: groupB }, (_, i) => (
            <span key={`b-${i}`} style={{ fontSize: 36 }}>🔵</span>
          ))}
        </div>
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: '#1565C0',
          opacity: resultOpacity,
        }}
      >
        {groupA} + {groupB} = {total}
      </div>
    </AbsoluteFill>
  );
};
