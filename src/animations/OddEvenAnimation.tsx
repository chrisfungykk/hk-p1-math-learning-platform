import { AbsoluteFill } from 'remotion';

export const OddEvenAnimation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#FEF3C7', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div style={{ fontSize: 48, textAlign: 'center' }}>單數和雙數</div>
    </AbsoluteFill>
  );
};
