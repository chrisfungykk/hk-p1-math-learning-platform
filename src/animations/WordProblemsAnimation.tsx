import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

/**
 * Word Problems Animation (加減應用題)
 * Shows a shopping scenario: items appear, price tags show, then addition/subtraction.
 * Designed for 640×360, 30fps, ~150 frames (5 seconds).
 */
export const WordProblemsAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const items = [
    { emoji: '🍎', count: 5, label: '5個蘋果' },
    { emoji: '🍌', count: 3, label: '3條香蕉' },
  ];

  const phase1End = 40;
  const phase2End = 80;
  const phase3End = 120;

  // Phase 1: First group appears
  const group1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const group1Scale = interpolate(frame, [0, 15], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 2: Second group appears
  const group2Opacity = interpolate(frame, [phase1End, phase1End + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const group2Scale = interpolate(frame, [phase1End, phase1End + 15], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 3: Plus sign and equation
  const plusOpacity = interpolate(frame, [phase2End, phase2End + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phase 4: Answer
  const answerOpacity = interpolate(frame, [phase3End, phase3End + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const answerScale = interpolate(frame, [phase3End, phase3End + 15], [0.5, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

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
      <div style={{ fontSize: 26, color: '#E65100', fontWeight: 'bold', marginBottom: 16 }}>
        加減應用題 Word Problems
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, maxWidth: width * 0.9, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Group 1 */}
        <div style={{ opacity: group1Opacity, transform: `scale(${group1Scale})`, textAlign: 'center' }}>
          <div style={{ fontSize: 36 }}>{items[0].emoji.repeat(items[0].count)}</div>
          <div style={{ fontSize: 18, color: '#5D4037', marginTop: 4 }}>{items[0].label}</div>
        </div>

        {/* Plus sign */}
        <div style={{ fontSize: 40, fontWeight: 'bold', color: '#FF6F00', opacity: plusOpacity }}>＋</div>

        {/* Group 2 */}
        <div style={{ opacity: group2Opacity, transform: `scale(${group2Scale})`, textAlign: 'center' }}>
          <div style={{ fontSize: 36 }}>{items[1].emoji.repeat(items[1].count)}</div>
          <div style={{ fontSize: 18, color: '#5D4037', marginTop: 4 }}>{items[1].label}</div>
        </div>
      </div>

      {/* Equation and answer */}
      <div style={{ marginTop: 24, opacity: answerOpacity, transform: `scale(${answerScale})`, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1B5E20' }}>
          5 + 3 = 8
        </div>
        <div style={{ fontSize: 20, color: '#4E342E', marginTop: 4 }}>
          一共有 8 個水果 🎉
        </div>
      </div>
    </AbsoluteFill>
  );
};
