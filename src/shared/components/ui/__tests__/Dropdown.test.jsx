import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dropdown from '../Dropdown';


describe('Dropdown', () => {
  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(<Dropdown isOpen={false}>Content</Dropdown>);

      expect(container).toBeEmptyDOMElement();
    });

    it('should render when isOpen is true', () => {
      render(<Dropdown isOpen={true}>Dropdown Content</Dropdown>);

      expect(screen.getByText('Dropdown Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Dropdown isOpen={true} className="custom-class">Content</Dropdown>);

      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('alignment', () => {
    it('should align right by default', () => {
      render(<Dropdown isOpen={true}>Content</Dropdown>);

      expect(document.querySelector('.right-0')).toBeInTheDocument();
    });

    it('should align left when specified', () => {
      render(<Dropdown isOpen={true} align="left">Content</Dropdown>);

      expect(document.querySelector('.left-0')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have proper dropdown styling', () => {
      const { container } = render(<Dropdown isOpen={true}>Content</Dropdown>);

      const dropdown = container.firstChild;
      expect(dropdown).toHaveClass('absolute');
      expect(dropdown).toHaveClass('rounded-xl');
      expect(dropdown).toHaveClass('shadow-lg');
    });
  });

  describe('Dropdown.Item', () => {
    describe('rendering', () => {
      it('should render as button by default', () => {
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item>Item</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      it('should render as custom element', () => {
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item as="a" href="/test">Link Item</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByRole('link')).toBeInTheDocument();
      });

      it('should render icon', () => {
        const TestIcon = () => <span data-testid="icon">Icon</span>;
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item icon={<TestIcon />}>Item with Icon</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByTestId('icon')).toBeInTheDocument();
      });
    });

    describe('variants', () => {
      it('should apply default variant', () => {
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item>Default Item</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByRole('button')).toHaveClass('text-neutral-700');
      });

      it('should apply danger variant', () => {
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item variant="danger">Danger Item</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByRole('button')).toHaveClass('text-red-600');
      });

      it('should apply primary variant', () => {
        render(
          <Dropdown isOpen={true}>
            <Dropdown.Item variant="primary">Primary Item</Dropdown.Item>
          </Dropdown>
        );

        expect(screen.getByRole('button')).toHaveClass('text-primary-600');
      });
    });
  });

  describe('Dropdown.Divider', () => {
    it('should render divider', () => {
      const { container } = render(
        <Dropdown isOpen={true}>
          <Dropdown.Item>Item 1</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Item 2</Dropdown.Item>
        </Dropdown>
      );

      expect(container.querySelector('.border-t')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Dropdown isOpen={true}>
          <Dropdown.Divider className="custom-divider" />
        </Dropdown>
      );

      expect(container.querySelector('.custom-divider')).toBeInTheDocument();
    });
  });

  describe('Dropdown.Header', () => {
    it('should render header', () => {
      render(
        <Dropdown isOpen={true}>
          <Dropdown.Header>Header Content</Dropdown.Header>
        </Dropdown>
      );

      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Dropdown isOpen={true}>
          <Dropdown.Header className="custom-header">Header</Dropdown.Header>
        </Dropdown>
      );

      expect(container.querySelector('.custom-header')).toBeInTheDocument();
    });
  });
});
