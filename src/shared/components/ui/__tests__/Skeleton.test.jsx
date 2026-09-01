import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton from '../Skeleton';


describe('Skeleton', () => {
  describe('rendering', () => {
    it('should render skeleton element', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should have aria-hidden', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should have role presentation', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toHaveAttribute('role', 'presentation');
    });
  });

  describe('variants', () => {
    it('should render rectangular variant by default', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toHaveClass('rounded-lg');
    });

    it('should render text variant', () => {
      const { container } = render(<Skeleton variant="text" />);

      expect(container.firstChild).toHaveClass('rounded');
      expect(container.firstChild).toHaveClass('h-4');
    });

    it('should render circular variant', () => {
      const { container } = render(<Skeleton variant="circular" />);

      expect(container.firstChild).toHaveClass('rounded-full');
    });

    it('should render rounded variant', () => {
      const { container } = render(<Skeleton variant="rounded" />);

      expect(container.firstChild).toHaveClass('rounded-xl');
    });
  });

  describe('dimensions', () => {
    it('should apply width as number', () => {
      const { container } = render(<Skeleton width={100} />);

      expect(container.firstChild).toHaveStyle({ width: '100px' });
    });

    it('should apply width as string', () => {
      const { container } = render(<Skeleton width="50%" />);

      expect(container.firstChild).toHaveStyle({ width: '50%' });
    });

    it('should apply height as number', () => {
      const { container } = render(<Skeleton height={50} />);

      expect(container.firstChild).toHaveStyle({ height: '50px' });
    });

    it('should apply height as string', () => {
      const { container } = render(<Skeleton height="2rem" />);

      expect(container.firstChild).toHaveStyle({ height: '2rem' });
    });
  });

  describe('animation', () => {
    it('should have pulse animation by default', () => {
      const { container } = render(<Skeleton />);

      expect(container.firstChild).toHaveClass('animate-pulse');
    });

    it('should have shimmer animation when specified', () => {
      const { container } = render(<Skeleton animation="shimmer" />);

      expect(container.firstChild).toHaveClass('animate-shimmer');
    });

    it('should not have animation when disabled', () => {
      const { container } = render(<Skeleton animation="none" />);

      expect(container.firstChild).not.toHaveClass('animate-pulse');
      expect(container.firstChild).not.toHaveClass('animate-shimmer');
    });
  });

  describe('Skeleton.Text', () => {
    it('should render single line by default', () => {
      const { container } = render(<Skeleton.Text />);

      expect(container.querySelectorAll('[role="presentation"]')).toHaveLength(1);
    });

    it('should render multiple lines', () => {
      const { container } = render(<Skeleton.Text lines={3} />);

      expect(container.querySelectorAll('[role="presentation"]')).toHaveLength(3);
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton.Text className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Skeleton.Avatar', () => {
    it('should render circular skeleton', () => {
      const { container } = render(<Skeleton.Avatar />);

      expect(container.firstChild).toHaveClass('rounded-full');
    });

    it('should apply medium size by default', () => {
      const { container } = render(<Skeleton.Avatar />);

      expect(container.firstChild).toHaveClass('w-10');
      expect(container.firstChild).toHaveClass('h-10');
    });

    it('should apply small size', () => {
      const { container } = render(<Skeleton.Avatar size="sm" />);

      expect(container.firstChild).toHaveClass('w-8');
      expect(container.firstChild).toHaveClass('h-8');
    });

    it('should apply large size', () => {
      const { container } = render(<Skeleton.Avatar size="lg" />);

      expect(container.firstChild).toHaveClass('w-12');
      expect(container.firstChild).toHaveClass('h-12');
    });

    it('should apply extra large size', () => {
      const { container } = render(<Skeleton.Avatar size="xl" />);

      expect(container.firstChild).toHaveClass('w-16');
      expect(container.firstChild).toHaveClass('h-16');
    });
  });

  describe('Skeleton.Button', () => {
    it('should render rounded skeleton', () => {
      const { container } = render(<Skeleton.Button />);

      expect(container.firstChild).toHaveClass('rounded-xl');
    });

    it('should apply medium size by default', () => {
      const { container } = render(<Skeleton.Button />);

      expect(container.firstChild).toHaveClass('h-10');
      expect(container.firstChild).toHaveClass('w-24');
    });

    it('should apply small size', () => {
      const { container } = render(<Skeleton.Button size="sm" />);

      expect(container.firstChild).toHaveClass('h-8');
      expect(container.firstChild).toHaveClass('w-20');
    });

    it('should apply large size', () => {
      const { container } = render(<Skeleton.Button size="lg" />);

      expect(container.firstChild).toHaveClass('h-12');
      expect(container.firstChild).toHaveClass('w-32');
    });
  });

  describe('Skeleton.Image', () => {
    it('should render with default aspect ratio', () => {
      const { container } = render(<Skeleton.Image />);

      expect(container.firstChild).toHaveStyle({ aspectRatio: '16/9' });
    });

    it('should render with custom aspect ratio', () => {
      const { container } = render(<Skeleton.Image aspectRatio="4/3" />);

      expect(container.firstChild).toHaveStyle({ aspectRatio: '4/3' });
    });

    it('should apply custom className', () => {
      const { container } = render(<Skeleton.Image className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
