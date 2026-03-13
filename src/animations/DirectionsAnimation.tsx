import { AbsoluteFill } from 'remotion';

export const DirectionsAnimation: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#E0E7FF', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
      <div style={{ fontSize: 48, textAlign: 'center' }}>方向</div>
    </AbsoluteFill>
  );
};
