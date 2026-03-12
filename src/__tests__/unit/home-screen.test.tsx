import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import HomeScreen from '../../pages/HomeScreen';

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe('HomeScreen', () => {
  it('renders school name and topic cards', () => {
    renderWithRouter(<HomeScreen />);

    expect(screen.getByText('📚 小一數學')).toBeInTheDocument();
    expect(screen.getByText('聖公會青衣主恩小學')).toBeInTheDocument();
    expect(screen.getByText('數數')).toBeInTheDocument();
    expect(screen.getByText('基本加法')).toBeInTheDocument();
  });

  it('renders exam prep and past paper links', () => {
    renderWithRouter(<HomeScreen />);

    const examLink = screen.getByText('📝 考試準備').closest('a');
    expect(examLink).toHaveAttribute('href', '/exam/sem1');

    const pastPaperLink = screen.getByText('📄 模擬試卷').closest('a');
    expect(pastPaperLink).toHaveAttribute('href', '/past-paper');
  });

  it('renders a score history link pointing to /scores', () => {
    renderWithRouter(<HomeScreen />);

    const scoresLink = screen.getByText('📊 成績記錄').closest('a');
    expect(scoresLink).toHaveAttribute('href', '/scores');
  });
});
