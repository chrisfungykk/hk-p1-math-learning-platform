import { useCurrentFrame, AbsoluteFill, interpolate } from 'remotion';

/**
 * Shape Recognition Animation (認識形狀)
 * Shapes rotate and get labeled: 圓形, 正方形, 三角形, 長方形
 * Designed for 640×360, 30fps, ~150 frames.
 */

const shapes = [
  { name: '圓形', color: '#E53935', english: 'Circle' },
  { name: '正方形', color: '#1E88E5', english: 'Square' },
  { name: '三角形', color: '#43A047', english: 'Triangle' },
  { name: '長方形', color: '#FB8C00', english: 'Rectangle' },
];

const ShapeGraphic: React.FC<{ type: string; color: string; size: number }> = ({ type, color, size }) => {
  if (type === '圓形') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    );
  }
  if (type === '正方形') {
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: 4,
        }}
      />
    );
  }
  if (type === '三角形') {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }}
      />
    );
  }
  // 長方形
  return (
    <div
      style={{
        width: size * 1.5,
        height: size * 0.8,
        backgroundColor: color,
        borderRadius: 4,
      }}
    />
  );
};

export const ShapesAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const framesPerShape = 35;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFF3E0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, color: '#E65100', fontWeight: 'bold', marginBottom: 24 }}>
        認識形狀 Shapes
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {shapes.map((shape, i) => {
          const appearFrame = i * framesPerShape;
          const opacity = interpolate(frame, [appearFrame, appearFrame + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const rotation = interpolate(frame, [appearFrame, appearFrame + 20], [90, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const labelOpacity = interpolate(frame, [appearFrame + 12, appearFrame + 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={shape.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity,
              }}
            >
              <div style={{ transform: `rotate(${rotation}deg)` }}>
                <ShapeGraphic type={shape.name} color={shape.color} size={60} />
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: shape.color,
                  opacity: labelOpacity,
                }}
              >
                {shape.name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
