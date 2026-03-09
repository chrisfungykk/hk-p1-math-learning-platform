import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Data Handling Animation (數據處理)
 * A simple bar chart / pictogram building up.
 * Designed for 640×360, 30fps, ~150 frames.
 */

const data = [
  { label: '🍎', value: 5, color: '#E53935' },
  { label: '🍌', value: 3, color: '#FDD835' },
  { label: '🍇', value: 7, color: '#7B1FA2' },
  { label: '🍊', value: 4, color: '#FB8C00' },
];

const maxValue = Math.max(...data.map((d) => d.value));
const maxBarHeight = 140;

export const DataHandlingAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F1F8E9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#33691E', fontWeight: 'bold', marginBottom: 8, opacity: titleOpacity }}>
        數據處理 Data Handling
      </div>

      <div style={{ fontSize: 16, color: '#558B2F', marginBottom: 20, opacity: titleOpacity }}>
        最喜歡的水果 Favourite Fruit
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 24,
          height: maxBarHeight + 40,
        }}
      >
        {data.map((item, i) => {
          const appearFrame = 20 + i * 25;
          const barHeight = interpolate(
            frame,
            [appearFrame, appearFrame + 20],
            [0, (item.value / maxValue) * maxBarHeight],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const labelOpacity = interpolate(frame, [appearFrame + 15, appearFrame + 22], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: item.color,
                  opacity: labelOpacity,
                }}
              >
                {item.value}
              </span>
              <div
                style={{
                  width: 48,
                  height: barHeight,
                  backgroundColor: item.color,
                  borderRadius: '6px 6px 0 0',
                  minHeight: 2,
                }}
              />
              <span style={{ fontSize: 24, opacity: labelOpacity }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
