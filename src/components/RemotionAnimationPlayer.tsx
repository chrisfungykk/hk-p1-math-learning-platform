import React, { useCallback, useRef, useState } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { TOPIC_REGISTRY } from '../data/topicRegistry';

interface RemotionAnimationPlayerProps {
  topicId: string;
  onComplete?: () => void;
}

interface ErrorBoundaryProps {
  fallbackImage: string;
  topicName: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React class component error boundary that catches render errors
 * from the Remotion Player and displays a static fallback image.
 */
export class AnimationErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Animation render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-8 w-full max-w-[640px] aspect-video">
          <img
            src={this.props.fallbackImage}
            alt={`${this.props.topicName} 動畫`}
            className="max-w-full max-h-full object-contain"
          />
          <p className="text-gray-500 mt-4 text-lg">動畫載入失敗，顯示靜態圖片</p>
        </div>
      );
    }
    return this.props.children;
  }
}


/**
 * Wrapper around Remotion's <Player> component that provides
 * play/pause/restart controls and an error boundary fallback.
 */
export default function RemotionAnimationPlayer({ topicId, onComplete }: RemotionAnimationPlayerProps) {
  const topic = TOPIC_REGISTRY[topicId];
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(() => {
    playerRef.current?.play();
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    playerRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const handleRestart = useCallback(() => {
    playerRef.current?.seekTo(0);
    playerRef.current?.play();
    setIsPlaying(true);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onComplete?.();
  }, [onComplete]);

  if (!topic) {
    return (
      <div className="text-center text-red-500 text-xl p-8">
        找不到此主題的動畫
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <AnimationErrorBoundary fallbackImage={topic.fallbackImage} topicName={topic.name}>
        <Player
          ref={playerRef}
          component={topic.animationComposition}
          compositionWidth={640}
          compositionHeight={360}
          durationInFrames={150}
          fps={30}
          style={{ width: '100%', maxWidth: 640, borderRadius: '1rem' }}
          onEnded={handleEnded}
        />
      </AnimationErrorBoundary>

      <div className="flex gap-4">
        {isPlaying ? (
          <button
            onClick={handlePause}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-2xl px-6 py-3 font-bold shadow-md transition-colors"
            aria-label="暫停"
          >
            ⏸️ 暫停
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-green-400 hover:bg-green-500 text-2xl px-6 py-3 font-bold shadow-md transition-colors"
            aria-label="播放"
          >
            ▶️ 播放
          </button>
        )}
        <button
          onClick={handleRestart}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-blue-400 hover:bg-blue-500 text-2xl px-6 py-3 font-bold shadow-md transition-colors"
          aria-label="重新開始"
        >
          🔄 重新開始
        </button>
      </div>
    </div>
  );
}
