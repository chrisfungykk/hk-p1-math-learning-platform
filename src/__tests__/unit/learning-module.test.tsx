import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { AnimationErrorBoundary } from '../../components/RemotionAnimationPlayer';

// A component that throws on render to trigger the error boundary
function ThrowingComponent(): JSX.Element {
  throw new Error('Remotion Player render failure');
}

describe('RemotionAnimationPlayer - Error Boundary', () => {
  it('renders fallback image when the Remotion Player throws an error', () => {
    // Suppress console.error from the error boundary
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <AnimationErrorBoundary
          fallbackImage="/fallbacks/counting.png"
          topicName="數數"
        >
          <ThrowingComponent />
        </AnimationErrorBoundary>
      </MemoryRouter>
    );

    const fallbackImg = screen.getByRole('img');
    expect(fallbackImg).toBeInTheDocument();
    expect(fallbackImg).toHaveAttribute('src', '/fallbacks/counting.png');
    expect(fallbackImg).toHaveAttribute('alt', '數數 動畫');

    consoleSpy.mockRestore();
  });

  it('renders children normally when no error occurs', () => {
    render(
      <MemoryRouter>
        <AnimationErrorBoundary
          fallbackImage="/fallbacks/counting.png"
          topicName="數數"
        >
          <div data-testid="child-content">正常內容</div>
        </AnimationErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
