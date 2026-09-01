import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../Card';


describe('Card', () => {
  describe('rendering', () => {
    it('should render card with children', () => {
      render(<Card>Card Content</Card>);

      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Card className="custom-class" data-testid="card">Test</Card>);

      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    it('should have rounded-2xl class', () => {
      render(<Card data-testid="card">Test</Card>);

      expect(screen.getByTestId('card')).toHaveClass('rounded-2xl');
    });
  });

  describe('variants', () => {
    it('should render default variant', () => {
      render(<Card data-testid="card" variant="default">Default</Card>);

      expect(screen.getByTestId('card')).toHaveClass('bg-white');
    });

    it('should render elevated variant', () => {
      render(<Card data-testid="card" variant="elevated">Elevated</Card>);

      expect(screen.getByTestId('card')).toHaveClass('shadow-lg');
    });

    it('should render bordered variant', () => {
      render(<Card data-testid="card" variant="bordered">Bordered</Card>);

      expect(screen.getByTestId('card')).toHaveClass('border');
    });
  });

  describe('padding', () => {
    it('should apply medium padding by default', () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId('card')).toHaveClass('p-6');
    });

    it('should apply small padding', () => {
      render(<Card data-testid="card" padding="sm">Content</Card>);

      expect(screen.getByTestId('card')).toHaveClass('p-4');
    });

    it('should apply large padding', () => {
      render(<Card data-testid="card" padding="lg">Content</Card>);

      expect(screen.getByTestId('card')).toHaveClass('p-8');
    });

    it('should apply no padding', () => {
      render(<Card data-testid="card" padding="none">Content</Card>);

      const card = screen.getByTestId('card');
      expect(card).not.toHaveClass('p-4');
      expect(card).not.toHaveClass('p-6');
      expect(card).not.toHaveClass('p-8');
    });
  });

  describe('hoverable', () => {
    it('should not be hoverable by default', () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId('card')).not.toHaveClass('hover:shadow-lg');
    });

    it('should be hoverable when prop is true', () => {
      render(<Card data-testid="card" hoverable>Content</Card>);

      expect(screen.getByTestId('card')).toHaveClass('hover:shadow-lg');
      expect(screen.getByTestId('card')).toHaveClass('cursor-pointer');
    });
  });

  describe('subcomponents', () => {
    describe('Card.Header', () => {
      it('should render header', () => {
        render(
          <Card>
            <Card.Header>Header Content</Card.Header>
          </Card>
        );

        expect(screen.getByText('Header Content')).toBeInTheDocument();
      });

      it('should have margin bottom', () => {
        render(
          <Card>
            <Card.Header data-testid="header">Header</Card.Header>
          </Card>
        );

        expect(screen.getByTestId('header')).toHaveClass('mb-4');
      });
    });

    describe('Card.Title', () => {
      it('should render title as h3 by default', () => {
        render(
          <Card>
            <Card.Title>Card Title</Card.Title>
          </Card>
        );

        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card Title');
      });

      it('should render title as custom tag', () => {
        render(
          <Card>
            <Card.Title as="h2">Card Title</Card.Title>
          </Card>
        );

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Card Title');
      });
    });

    describe('Card.Description', () => {
      it('should render description', () => {
        render(
          <Card>
            <Card.Description>Description text</Card.Description>
          </Card>
        );

        expect(screen.getByText('Description text')).toBeInTheDocument();
      });
    });

    describe('Card.Content', () => {
      it('should render content', () => {
        render(
          <Card>
            <Card.Content>Main content</Card.Content>
          </Card>
        );

        expect(screen.getByText('Main content')).toBeInTheDocument();
      });
    });

    describe('Card.Footer', () => {
      it('should render footer', () => {
        render(
          <Card>
            <Card.Footer>Footer content</Card.Footer>
          </Card>
        );

        expect(screen.getByText('Footer content')).toBeInTheDocument();
      });

      it('should have border and margin top', () => {
        render(
          <Card>
            <Card.Footer data-testid="footer">Footer</Card.Footer>
          </Card>
        );

        expect(screen.getByTestId('footer')).toHaveClass('mt-4');
        expect(screen.getByTestId('footer')).toHaveClass('pt-4');
        expect(screen.getByTestId('footer')).toHaveClass('border-t');
      });
    });
  });

  describe('props spreading', () => {
    it('should pass additional props to div element', () => {
      render(<Card data-testid="custom-card" role="article">Test</Card>);

      expect(screen.getByTestId('custom-card')).toHaveAttribute('role', 'article');
    });
  });
});
