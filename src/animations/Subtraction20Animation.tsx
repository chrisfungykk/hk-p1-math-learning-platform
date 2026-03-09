import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Subtraction within 20 Animation (20以內減法)
 * Objects disappear from a larger group: e.g., 15 - 7 = 8
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const Subtraction20Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const startCount = 15;
  const removeCount = 7;
  const result = startCount - removeCount;

  // Phase 1: All objects appear (frames 0-25)
  const allOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Equation appears (frames 30-40)
  const eqOpacity = interpolate(frame, [30, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Objects disappear (frames 50-100, staggered)
  const removeOpacities = Array.from({ length: removeCount }, (_, i) => {
    const disappearStart = 50 + i * 7;
    return interpolate(frame, [disappearStart, disappearStart + 6], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  // Phase 4: Result (frames 110-150)
  const resultOpacity = interpolate(frame, [110, 125], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FBE9E7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#BF360C', fontWeight: 'bold', marginBottom: 16 }}>
        20以內減法 Subtraction (20)
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          maxWidth: 400,
          justifyContent: 'center',
          marginBottom: 16,
          opacity: allOpacity,
        }}
      >
        {Array.from({ length: startCount }, (_, i) => {
          const isRemoved = i >= result;
          const itemOpacity = isRemoved ? (removeOpacities[i - result] ?? 0) : 1;
          return (
            <span key={i} style={{ fontSize: 28, opacity: itemOpacity }}>
              🌸
            </span>
          );
        })}
      </div>

      <div style={{ fontSize: 24, color: '#BF360C', opacity: eqOpacity, marginBottom: 12 }}>
        {startCount} − {removeCount}
      </div>

      <div
        style={{
          fontSize: 44,
          fontWeight: 'bold',
          color: '#BF360C',
          opacity: resultOpacity,
        }}
      >
        = {result}
      </div>
    </AbsoluteFill>
  );
};
