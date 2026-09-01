import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Avatar from '../Avatar';


describe('Avatar', () => {
  describe('rendering with image', () => {
    it('should render image when src is provided', () => {
      render(<Avatar src="/avatar.jpg" alt="User avatar" />);

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'User avatar');
    });

    it('should use name as alt if alt is not provided', () => {
      render(<Avatar src="/avatar.jpg" name="John Doe" />);

      expect(screen.getByRole('img')).toHaveAttribute('alt', 'John Doe');
    });

    it('should apply size classes to image', () => {
      const { container } = render(<Avatar src="/avatar.jpg" size="lg" />);

      const img = container.querySelector('img');
      expect(img.className).toContain('w-12');
      expect(img.className).toContain('h-12');
    });
  });

  describe('rendering with initials', () => {
    it('should render initials when no src is provided', () => {
      render(<Avatar name="John Doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should render single initial for single name', () => {
      render(<Avatar name="John" />);

      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should render U for empty name', () => {
      render(<Avatar name="" />);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('should render U when no name is provided', () => {
      render(<Avatar />);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('should handle names with multiple spaces', () => {
      render(<Avatar name="John Michael Smith" />);

      expect(screen.getByText('JS')).toBeInTheDocument();
    });

    it('should handle lowercase names', () => {
      render(<Avatar name="john doe" />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Avatar name="John" data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('w-10');
      expect(avatar).toHaveClass('h-10');
    });

    it('should apply extra small size', () => {
      render(<Avatar name="John" size="xs" data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('w-6');
      expect(avatar).toHaveClass('h-6');
    });

    it('should apply small size', () => {
      render(<Avatar name="John" size="sm" data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('w-8');
      expect(avatar).toHaveClass('h-8');
    });

    it('should apply large size', () => {
      render(<Avatar name="John" size="lg" data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('w-12');
      expect(avatar).toHaveClass('h-12');
    });

    it('should apply extra large size', () => {
      render(<Avatar name="John" size="xl" data-testid="avatar" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('w-16');
      expect(avatar).toHaveClass('h-16');
    });
  });

  describe('styling', () => {
    it('should have rounded-full class', () => {
      render(<Avatar name="John" data-testid="avatar" />);

      expect(screen.getByTestId('avatar')).toHaveClass('rounded-full');
    });

    it('should apply custom className', () => {
      render(<Avatar name="John" className="custom-class" data-testid="avatar" />);

      expect(screen.getByTestId('avatar')).toHaveClass('custom-class');
    });
  });

  describe('props spreading', () => {
    it('should pass additional props to element', () => {
      render(<Avatar name="John" data-testid="avatar" title="User" />);

      expect(screen.getByTestId('avatar')).toHaveAttribute('title', 'User');
    });
  });
});
