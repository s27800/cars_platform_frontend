import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../Badge';


describe('Badge', () => {
  describe('rendering', () => {
    it('should render badge with children', () => {
      render(<Badge>Test Badge</Badge>);
      
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Badge className="custom-class">Test</Badge>);
      
      expect(screen.getByText('Test')).toHaveClass('custom-class');
    });

    it('should render as inline-flex span', () => {
      render(<Badge>Test</Badge>);
      
      const badge = screen.getByText('Test');
      expect(badge.tagName).toBe('SPAN');
      expect(badge).toHaveClass('inline-flex');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      
      expect(screen.getByText('Default')).toHaveClass('bg-neutral-100');
    });

    it('should render primary variant', () => {
      render(<Badge variant="primary">Primary</Badge>);
      
      expect(screen.getByText('Primary')).toHaveClass('bg-primary-100');
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      
      expect(screen.getByText('Success')).toHaveClass('bg-green-100');
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      
      expect(screen.getByText('Warning')).toHaveClass('bg-yellow-100');
    });

    it('should render danger variant', () => {
      render(<Badge variant="danger">Danger</Badge>);
      
      expect(screen.getByText('Danger')).toHaveClass('bg-red-100');
    });

    it('should render info variant', () => {
      render(<Badge variant="info">Info</Badge>);
      
      expect(screen.getByText('Info')).toHaveClass('bg-blue-100');
    });
  });

  describe('sizes', () => {
    it('should render medium size by default', () => {
      render(<Badge>Medium</Badge>);
      
      expect(screen.getByText('Medium')).toHaveClass('text-sm');
    });

    it('should render small size', () => {
      render(<Badge size="sm">Small</Badge>);
      
      expect(screen.getByText('Small')).toHaveClass('text-xs');
    });
  });

  describe('rounded', () => {
    it('should be rounded by default', () => {
      render(<Badge>Rounded</Badge>);
      
      expect(screen.getByText('Rounded')).toHaveClass('rounded-full');
    });

    it('should not be fully rounded when rounded=false', () => {
      render(<Badge rounded={false}>Not Rounded</Badge>);
      
      expect(screen.getByText('Not Rounded')).toHaveClass('rounded-md');
      expect(screen.getByText('Not Rounded')).not.toHaveClass('rounded-full');
    });
  });

  describe('props spreading', () => {
    it('should pass additional props to span element', () => {
      render(<Badge data-testid="custom-badge">Test</Badge>);
      
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    });
  });
});
