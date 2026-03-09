import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Addition within 20 Animation (20以內加法)
 * Two groups of objects combine with larger numbers: e.g., 8 + 5 = 13
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const Addition20Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const groupA = 8;
  const groupB = 5;
  const total = groupA + groupB;

  // Phase 1: Group A appears (frames 0-25)
  const groupAOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Plus and Group B (frames 25-55)
  const plusOpacity = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const groupBOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Merge (frames 65-95)
  const mergeProgress = interpolate(frame, [65, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 4: Result (frames 100-150)
  const resultOpacity = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const groupAX = interpolate(mergeProgress, [0, 1], [-40, 0]);
  const groupBX = interpolate(mergeProgress, [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E1F5FE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#0277BD', fontWeight: 'bold', marginBottom: 16 }}>
        20以內加法 Addition (20)
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            maxWidth: 200,
            opacity: groupAOpacity,
            transform: `translateX(${groupAX}px)`,
          }}
        >
          {Array.from({ length: groupA }, (_, i) => (
            <span key={`a-${i}`} style={{ fontSize: 24 }}>⭐</span>
          ))}
        </div>

        <span style={{ fontSize: 32, fontWeight: 'bold', color: '#0277BD', opacity: plusOpacity }}>
          +
        </span>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            maxWidth: 140,
            opacity: groupBOpacity,
            transform: `translateX(${groupBX}px)`,
          }}
        >
          {Array.from({ length: groupB }, (_, i) => (
            <span key={`b-${i}`} style={{ fontSize: 24 }}>⭐</span>
          ))}
        </div>
      </div>

      <div
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: '#0277BD',
          opacity: resultOpacity,
        }}
      >
        {groupA} + {groupB} = {total}
      </div>
    </AbsoluteFill>
  );
};
