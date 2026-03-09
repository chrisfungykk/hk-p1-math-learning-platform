import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Compare Length/Height Animation (比較長短和高矮)
 * Bars of different lengths appear for comparison.
 * Designed for 640×360, 30fps, ~150 frames.
 */

const bars = [
  { label: '短', width: 120, color: '#42A5F5' },
  { label: '中', width: 220, color: '#66BB6A' },
  { label: '長', width: 340, color: '#EF5350' },
];

export const CompareLengthAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F3E5F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#7B1FA2', fontWeight: 'bold', marginBottom: 28 }}>
        比較長短 Compare Length
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
        {bars.map((bar, i) => {
          const appearFrame = i * 30 + 10;
          const barWidth = interpolate(frame, [appearFrame, appearFrame + 25], [0, bar.width], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const labelOpacity = interpolate(frame, [appearFrame + 20, appearFrame + 30], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  height: 36,
                  width: barWidth,
                  backgroundColor: bar.color,
                  borderRadius: 8,
                  minWidth: 4,
                }}
              />
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  color: bar.color,
                  opacity: labelOpacity,
                }}
              >
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 20,
          color: '#7B1FA2',
          marginTop: 24,
          opacity: interpolate(frame, [110, 125], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        哪一條最長？ Which is longest?
      </div>
    </AbsoluteFill>
  );
};
