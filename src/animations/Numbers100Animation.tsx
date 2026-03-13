import { AbsoluteFill } from 'remotion';

export const Numbers100Animation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#EDE9FE', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div style={{ fontSize: 48, textAlign: 'center' }}>100以內的數</div>
    </AbsoluteFill>
  );
};
