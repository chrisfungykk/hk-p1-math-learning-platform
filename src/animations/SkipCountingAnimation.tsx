import { AbsoluteFill } from 'remotion';

export const SkipCountingAnimation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div style={{ fontSize: 48, textAlign: 'center' }}>2、5、10的倍數</div>
    </AbsoluteFill>
  );
};
