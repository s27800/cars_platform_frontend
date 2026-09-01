import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ConfirmModal from '../ConfirmModal';


describe('ConfirmModal', () => {
  let onClose;
  let onConfirm;

  beforeEach(() => {
    onClose = vi.fn();
    onConfirm = vi.fn();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  const renderModal = (props = {}) => render(
    <ConfirmModal
      isOpen={true}
      onClose={onClose}
      onConfirm={onConfirm}
      message="Delete this review?"
      {...props}
    />
  );


  describe('rendering', () => {
    it('should not render when closed', () => {
      renderModal({ isOpen: false });

      expect(screen.queryByText('Delete this review?')).not.toBeInTheDocument();
    });

    it('should show the message when open', () => {
      renderModal();

      expect(screen.getByText('Delete this review?')).toBeInTheDocument();
    });

    it('should use the default title when none is given', () => {
      renderModal();

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    it('should show the title it was given', () => {
      renderModal({ title: 'Delete account' });

      expect(screen.getByText('Delete account')).toBeInTheDocument();
    });

    it('should use the default button labels', () => {
      renderModal();

      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should show the button labels it was given', () => {
      renderModal({ confirmText: 'Yes, delete', cancelText: 'Keep it' });

      expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep it' })).toBeInTheDocument();
    });
  });


  describe('danger variant', () => {
    it('should warn that the action cannot be undone by default', () => {
      renderModal();

      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('should keep the warning for an explicit danger variant', () => {
      renderModal({ variant: 'danger' });

      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('should drop the warning for a non-danger variant', () => {
      renderModal({ variant: 'warning' });

      expect(screen.queryByText('This action cannot be undone.')).not.toBeInTheDocument();
    });
  });


  describe('interaction', () => {
    it('should confirm when the confirm button is pressed', () => {
      renderModal();

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should not close by itself on confirm, so the caller controls the modal', () => {
      renderModal();

      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should close when the cancel button is pressed', () => {
      renderModal();

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('should close on escape', () => {
      renderModal();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });
  });


  describe('loading state', () => {
    it('should disable cancel while the action is running', () => {
      renderModal({ isLoading: true });

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    });

    it('should not close on escape while the action is running', () => {
      renderModal({ isLoading: true });

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should disable confirm so the action cannot be submitted twice', () => {
      renderModal({ isLoading: true, confirmText: 'Delete' });

      const confirmButton = screen.getByRole('button', { name: /Delete/ });

      expect(confirmButton).toBeDisabled();

      fireEvent.click(confirmButton);

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });
});
