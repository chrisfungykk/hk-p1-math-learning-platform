import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { STORAGE_KEY } from '../../constants';

function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store,
  };
}

describe('TestingModule', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults difficulty to Easy when no previous selection exists in localStorage', async () => {
    // Ensure localStorage has no stored difficulty
    expect(mockStorage.getItem(STORAGE_KEY)).toBeNull();

    // Dynamically import to pick up the mocked localStorage
    const { default: TestingModule } = await import('../../pages/TestingModule');

    render(
      <MemoryRouter initialEntries={['/test/counting']}>
        <Routes>
          <Route path="/test/:topicId" element={<TestingModule />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    // The Easy button should be highlighted (aria-pressed="true")
    const easyButton = screen.getByRole('button', { name: /容易/ });
    expect(easyButton).toHaveAttribute('aria-pressed', 'true');

    // Medium and Hard should not be pressed
    const mediumButton = screen.getByRole('button', { name: /中等/ });
    const hardButton = screen.getByRole('button', { name: /困難/ });
    expect(mediumButton).toHaveAttribute('aria-pressed', 'false');
    expect(hardButton).toHaveAttribute('aria-pressed', 'false');
  });
});
