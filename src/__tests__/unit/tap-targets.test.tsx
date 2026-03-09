import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from '../../pages/HomeScreen';
import SemesterView from '../../pages/SemesterView';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual };
});

/** Tailwind min-h classes that are >= 48px (min-h-12 = 3rem = 48px). */
const MIN_H_PATTERN = /\bmin-h-(\d+)\b/;
const MIN_W_PATTERN = /\bmin-w-(\d+)\b/;

/**
 * Checks that every element has both min-h and min-w Tailwind classes
 * with values >= 12 (48px), satisfying the 48×48px minimum tap target.
 */
function expectTapTargets(elements: HTMLElement[]) {
  expect(elements.length).toBeGreaterThan(0);
  for (const el of elements) {
    const classes = el.className;

    const hMatch = classes.match(MIN_H_PATTERN);
    expect(hMatch, `Expected min-h-* class on: ${classes}`).not.toBeNull();
    expect(Number(hMatch![1])).toBeGreaterThanOrEqual(12);

    const wMatch = classes.match(MIN_W_PATTERN);
    expect(wMatch, `Expected min-w-* class on: ${classes}`).not.toBeNull();
    expect(Number(wMatch![1])).toBeGreaterThanOrEqual(12);
  }
}

describe('Minimum tap target sizes (48×48px)', () => {
  describe('HomeScreen', () => {
    it('all links have minimum 48px tap target classes', () => {
      render(
        <MemoryRouter>
          <HomeScreen />
        </MemoryRouter>,
      );

      const links = screen.getAllByRole('link');
      expectTapTargets(links);
    });
  });

  describe('SemesterView', () => {
    it('all links have minimum 48px tap target classes', () => {
      render(
        <MemoryRouter initialEntries={['/semester/sem1']}>
          <Routes>
            <Route path="/semester/:semesterId" element={<SemesterView />} />
          </Routes>
        </MemoryRouter>,
      );

      const links = screen.getAllByRole('link');
      expectTapTargets(links);
    });
  });
});
