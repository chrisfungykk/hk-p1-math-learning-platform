import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Ordering and Sequences Animation (排列和序列)
 * Numbers appear in sequence: 1, 2, 3, 4, 5...
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const OrderingAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  const framesPerNumber = 15;

  const colors = ['#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA', '#F06292', '#00ACC1'];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#E8EAF6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#283593', fontWeight: 'bold', marginBottom: 28 }}>
        排列和序列 Ordering
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {numbers.map((num, i) => {
          const appearFrame = i * framesPerNumber + 5;
          const opacity = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const translateY = interpolate(frame, [appearFrame, appearFrame + 10], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={num}
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                backgroundColor: colors[i],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 'bold',
                color: '#fff',
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {num}
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 20,
          color: '#283593',
          marginTop: 24,
          opacity: interpolate(frame, [125, 140], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        1, 2, 3, 4, 5, 6, 7, 8 ✓
      </div>
    </AbsoluteFill>
  );
};
