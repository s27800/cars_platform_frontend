import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import QuickStat from '../QuickStat';


describe('QuickStat', () => {
  it('should show the figure', () => {
    render(<QuickStat icon={<span />} label="Models" value={42} />);

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should show the caption', () => {
    render(<QuickStat icon={<span />} label="Models" value={42} />);

    expect(screen.getByText('Models')).toBeInTheDocument();
  });

  it('should show the icon it was given', () => {
    render(<QuickStat icon={<span data-testid="stat-icon" />} label="Models" value={42} />);

    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('should render a value that is itself a node', () => {
    render(<QuickStat icon={<span />} label="Founded" value={<em>1937</em>} />);

    expect(screen.getByText('1937')).toBeInTheDocument();
  });

  it('should render a zero figure rather than hiding it', () => {
    render(<QuickStat icon={<span />} label="Generations" value={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
