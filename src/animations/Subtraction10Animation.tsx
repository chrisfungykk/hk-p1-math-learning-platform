import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Subtraction within 10 Animation (基本減法)
 * Objects disappear from a group: e.g., 5 🟢 - 2 🟢 = 3 🟢
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const Subtraction10Animation: React.FC = () => {
  const frame = useCurrentFrame();
  const startCount = 5;
  const removeCount = 2;
  const result = startCount - removeCount;

  // Phase 1: All objects appear (frames 0-30)
  const allOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 2: Minus sign appears (frames 35-45)
  const minusOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Phase 3: Objects disappear one by one (frames 55-85)
  const removeOpacities = Array.from({ length: removeCount }, (_, i) => {
    const disappearStart = 55 + i * 15;
    return interpolate(frame, [disappearStart, disappearStart + 10], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  });

  // Phase 4: Show result (frames 95-150)
  const resultOpacity = interpolate(frame, [95, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E8F5E9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#2E7D32', fontWeight: 'bold', marginBottom: 20 }}>
        基本減法 Subtraction
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, opacity: allOpacity }}>
        {Array.from({ length: startCount }, (_, i) => {
          const isRemoved = i >= result;
          const itemOpacity = isRemoved ? (removeOpacities[i - result] ?? 0) : 1;
          return (
            <span
              key={i}
              style={{
                fontSize: 40,
                opacity: itemOpacity,
                transition: 'opacity 0.2s',
              }}
            >
              🟢
            </span>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: minusOpacity, marginBottom: 16 }}>
        <span style={{ fontSize: 28, color: '#666' }}>
          {startCount} − {removeCount}
        </span>
      </div>

      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: '#2E7D32',
          opacity: resultOpacity,
        }}
      >
        = {result}
      </div>
    </AbsoluteFill>
  );
};
