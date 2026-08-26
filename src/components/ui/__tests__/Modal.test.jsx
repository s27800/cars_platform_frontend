import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Modal from '../Modal';


describe('Modal', () => {
  beforeEach(() => {

    // Create a portal container
    const portalRoot = document.createElement('div');

    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {

    // Clean up portal container
    const portalRoot = document.getElementById('portal-root');

    if (portalRoot)
      document.body.removeChild(portalRoot);

    document.body.style.overflow = '';
  });

  describe('rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(<Modal isOpen={true} onClose={() => {}}>Modal Content</Modal>);
      
      expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should render title', () => {
      render(<Modal isOpen={true} onClose={() => {}} title="Modal Title">Content</Modal>);
      
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
      
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should apply custom className', () => {
      render(<Modal isOpen={true} onClose={() => {}} className="custom-class">Content</Modal>);
      
      expect(document.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
      
      expect(document.querySelector('.max-w-lg')).toBeInTheDocument();
    });

    it('should apply small size', () => {
      render(<Modal isOpen={true} onClose={() => {}} size="sm">Content</Modal>);
      
      expect(document.querySelector('.max-w-md')).toBeInTheDocument();
    });

    it('should apply large size', () => {
      render(<Modal isOpen={true} onClose={() => {}} size="lg">Content</Modal>);
      
      expect(document.querySelector('.max-w-2xl')).toBeInTheDocument();
    });

    it('should apply xl size', () => {
      render(<Modal isOpen={true} onClose={() => {}} size="xl">Content</Modal>);
      
      expect(document.querySelector('.max-w-4xl')).toBeInTheDocument();
    });
  });

  describe('close button', () => {
    it('should show close button by default', () => {
      render(<Modal isOpen={true} onClose={() => {}} title="Title">Content</Modal>);
      
      expect(screen.getByRole('button', { name: 'Close modal' })).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(<Modal isOpen={true} onClose={() => {}} showCloseButton={false}>Content</Modal>);
      
      expect(screen.queryByRole('button', { name: 'Close modal' })).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} title="Title">Content</Modal>);
      
      fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('overlay click', () => {
    it('should close on overlay click by default', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);
      
      const overlay = screen.getByRole('dialog');
      fireEvent.click(overlay);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on overlay click when closeOnOverlayClick is false', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>Content</Modal>);
      
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay);
      
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should not close when clicking modal content', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);
      
      fireEvent.click(screen.getByText('Content'));
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('escape key', () => {
    it('should close on Escape key by default', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose}>Content</Modal>);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close on Escape key when closeOnEscape is false', () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} closeOnEscape={false}>Content</Modal>);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('body scroll lock', () => {
    it('should lock body scroll when open', () => {
      render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
      
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock body scroll when closed', () => {
      const { rerender } = render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>);
      
      rerender(<Modal isOpen={false} onClose={() => {}}>Content</Modal>);
      
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Modal.Footer', () => {
    it('should render footer', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer>Footer Content</Modal.Footer>
        </Modal>
      );
      
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('should apply custom className to footer', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Footer className="custom-footer">Footer</Modal.Footer>
        </Modal>
      );
      
      expect(document.querySelector('.custom-footer')).toBeInTheDocument();
    });
  });
});
