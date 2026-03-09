import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Coins and Notes Animation (認識貨幣)
 * Coins and notes appear with their values displayed.
 * Designed for 640×360, 30fps, ~150 frames.
 */

const currency = [
  { label: '1角', value: '$0.10', color: '#8D6E63', shape: 'coin' as const },
  { label: '5角', value: '$0.50', color: '#FFB300', shape: 'coin' as const },
  { label: '1元', value: '$1', color: '#FDD835', shape: 'coin' as const },
  { label: '2元', value: '$2', color: '#66BB6A', shape: 'coin' as const },
  { label: '10元', value: '$10', color: '#42A5F5', shape: 'note' as const },
  { label: '20元', value: '$20', color: '#AB47BC', shape: 'note' as const },
];

export const CoinsNotesAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFF8E1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#E65100', fontWeight: 'bold', marginBottom: 24 }}>
        認識貨幣 Coins & Notes
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {currency.map((item, i) => {
          const appearFrame = i * 20 + 10;
          const opacity = interpolate(frame, [appearFrame, appearFrame + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const scale = interpolate(frame, [appearFrame, appearFrame + 12], [0.5, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const isCoin = item.shape === 'coin';

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                opacity,
                transform: `scale(${scale})`,
              }}
            >
              <div
                style={{
                  width: isCoin ? 52 : 72,
                  height: isCoin ? 52 : 40,
                  borderRadius: isCoin ? '50%' : 6,
                  backgroundColor: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isCoin ? 14 : 13,
                  fontWeight: 'bold',
                  color: '#FFF',
                  border: '2px solid rgba(0,0,0,0.15)',
                }}
              >
                {item.value}
              </div>
              <span style={{ fontSize: 14, fontWeight: 'bold', color: '#5D4037' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
