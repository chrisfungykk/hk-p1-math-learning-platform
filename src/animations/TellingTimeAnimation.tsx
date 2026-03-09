import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Telling Time Animation (認識時間)
 * A clock face with hands moving to show different hours.
 * Designed for 640×360, 30fps, ~150 frames.
 */
export const TellingTimeAnimation: React.FC = () => {
  const frame = useCurrentFrame();

  const clockSize = 180;
  const center = clockSize / 2;

  // Hour hand rotates from 12 o'clock to 3 o'clock over the animation
  const hourAngle = interpolate(frame, [20, 120], [0, 90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Minute hand makes a full rotation
  const minuteAngle = interpolate(frame, [20, 120], [0, 360], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const clockOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const labelOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Hour numbers
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFDE7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#F57F17', fontWeight: 'bold', marginBottom: 20 }}>
        認識時間 Telling Time
      </div>

      <div
        style={{
          width: clockSize,
          height: clockSize,
          borderRadius: '50%',
          border: '4px solid #5D4037',
          backgroundColor: '#FFF',
          position: 'relative',
          opacity: clockOpacity,
        }}
      >
        {/* Hour numbers */}
        {hours.map((h) => {
          const angle = (h * 30 - 90) * (Math.PI / 180);
          const radius = center - 20;
          const x = center + radius * Math.cos(angle) - 8;
          const y = center + radius * Math.sin(angle) - 8;
          return (
            <span
              key={h}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#5D4037',
              }}
            >
              {h}
            </span>
          );
        })}

        {/* Center dot */}
        <div
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#5D4037',
            left: center - 4,
            top: center - 4,
          }}
        />

        {/* Hour hand */}
        <div
          style={{
            position: 'absolute',
            width: 4,
            height: 40,
            backgroundColor: '#5D4037',
            left: center - 2,
            top: center - 40,
            transformOrigin: 'bottom center',
            transform: `rotate(${hourAngle}deg)`,
            borderRadius: 2,
          }}
        />

        {/* Minute hand */}
        <div
          style={{
            position: 'absolute',
            width: 2,
            height: 55,
            backgroundColor: '#E53935',
            left: center - 1,
            top: center - 55,
            transformOrigin: 'bottom center',
            transform: `rotate(${minuteAngle}deg)`,
            borderRadius: 2,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#F57F17',
          marginTop: 16,
          opacity: labelOpacity,
        }}
      >
        3 時正 (3 o'clock)
      </div>
    </AbsoluteFill>
  );
};
