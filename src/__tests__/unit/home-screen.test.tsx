import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomeScreen from '../../pages/HomeScreen';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('HomeScreen', () => {
  it('renders two semester cards with correct Chinese labels', () => {
    renderWithRouter(<HomeScreen />);

    expect(screen.getByText('上學期')).toBeInTheDocument();
    expect(screen.getByText('下學期')).toBeInTheDocument();
  });

  it('semester cards link to correct routes', () => {
    renderWithRouter(<HomeScreen />);

    const sem1Link = screen.getByText('上學期').closest('a');
    const sem2Link = screen.getByText('下學期').closest('a');

    expect(sem1Link).toHaveAttribute('href', '/semester/sem1');
    expect(sem2Link).toHaveAttribute('href', '/semester/sem2');
  });

  it('renders a score history link pointing to /scores', () => {
    renderWithRouter(<HomeScreen />);

    const scoresLink = screen.getByText('📊 成績記錄').closest('a');
    expect(scoresLink).toHaveAttribute('href', '/scores');
  });
});
