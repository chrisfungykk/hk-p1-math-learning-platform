import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

/**
 * Counting Animation (數數)
 * Objects (🍎) appear one by one, counting up to a target number.
 * Designed for 640×360, 30fps, ~150 frames (5 seconds).
 */
export const CountingAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const totalItems = 10;
  const framesPerItem = 12;

  const items = Array.from({ length: totalItems }, (_, i) => {
    const appearFrame = i * framesPerItem;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 8], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const scale = interpolate(frame, [appearFrame, appearFrame + 8], [0.3, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { opacity, scale, index: i };
  });

  const visibleCount = Math.min(
    totalItems,
    Math.floor(frame / framesPerItem) + (frame % framesPerItem > 0 ? 1 : 0)
  );

  const countOpacity = interpolate(frame, [0, 5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFF8E7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#E65100', fontWeight: 'bold', marginBottom: 16 }}>
        數數 Counting
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          maxWidth: width * 0.8,
          marginBottom: 20,
        }}
      >
        {items.map((item) => (
          <div
            key={item.index}
            style={{
              fontSize: 40,
              opacity: item.opacity,
              transform: `scale(${item.scale})`,
            }}
          >
            🍎
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: '#D32F2F',
          opacity: countOpacity,
          minHeight: height * 0.15,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {visibleCount}
      </div>
    </AbsoluteFill>
  );
};
