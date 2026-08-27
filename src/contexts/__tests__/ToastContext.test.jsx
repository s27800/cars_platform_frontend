import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { ToastProvider, ToastContext } from '../ToastContext';
import { useContext } from 'react';


// Test component to access context
const TestConsumer = () => {
  const context = useContext(ToastContext);

  return (
    <div>
      <span data-testid="toasts-count">{context.toasts.length}</span>
      <ul data-testid="toasts-list">
        {context.toasts.map(toast => (
          <li key={toast.id} data-testid={`toast-${toast.id}`}>
            {toast.message} - {toast.variant}
          </li>
        ))}
      </ul>
      <button onClick={() => context.addToast({ message: 'Test', variant: 'info' })} data-testid="add-toast">
        Add Toast
      </button>
      <button onClick={() => context.success('Success!')} data-testid="add-success">
        Add Success
      </button>
      <button onClick={() => context.error('Error!')} data-testid="add-error">
        Add Error
      </button>
      <button onClick={() => context.warning('Warning!')} data-testid="add-warning">
        Add Warning
      </button>
      <button onClick={() => context.info('Info!')} data-testid="add-info">
        Add Info
      </button>
      <button onClick={() => context.clearAll()} data-testid="clear-all">
        Clear All
      </button>
      <button onClick={() => context.removeToast(1)} data-testid="remove-toast">
        Remove Toast 1
      </button>
    </div>
  );
};


describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide empty toasts array initially', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
    });
  });

  describe('addToast', () => {
    it('should add a toast with default variant', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-toast'));

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');
    });

    it('should add multiple toasts', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-toast'));
      fireEvent.click(screen.getByTestId('add-toast'));
      fireEvent.click(screen.getByTestId('add-toast'));

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('3');
    });

    it('should auto-remove toast after duration', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-toast'));
      expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');

      act(() => {
        vi.advanceTimersByTime(3500);
      });

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
    });
  });

  describe('convenience methods', () => {
    it('should add success toast', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-success'));

      const toastsList = screen.getByTestId('toasts-list');

      expect(toastsList).toHaveTextContent('Success! - success');
    });

    it('should add error toast', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-error'));

      const toastsList = screen.getByTestId('toasts-list');

      expect(toastsList).toHaveTextContent('Error! - error');
    });

    it('should add warning toast', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-warning'));

      const toastsList = screen.getByTestId('toasts-list');

      expect(toastsList).toHaveTextContent('Warning! - warning');
    });

    it('should add info toast', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-info'));

      const toastsList = screen.getByTestId('toasts-list');

      expect(toastsList).toHaveTextContent('Info! - info');
    });
  });

  describe('removeToast', () => {
    it('should add and display multiple toasts', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-success'));
      fireEvent.click(screen.getByTestId('add-error'));
      
      expect(screen.getByTestId('toasts-count')).toHaveTextContent('2');
    });
  });

  describe('clearAll', () => {
    it('should clear all toasts', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-success'));
      fireEvent.click(screen.getByTestId('add-error'));
      fireEvent.click(screen.getByTestId('add-warning'));
      
      expect(screen.getByTestId('toasts-count')).toHaveTextContent('3');

      fireEvent.click(screen.getByTestId('clear-all'));
      
      expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
    });
  });

  describe('toast properties', () => {
    it('should create toast with correct properties', () => {
      const ToastPropsConsumer = () => {
        const context = useContext(ToastContext);
        const lastToast = context.toasts[context.toasts.length - 1];

        return (
          <div>
            <span data-testid="has-id">{lastToast?.id ? 'yes' : 'no'}</span>
            <span data-testid="has-message">{lastToast?.message || 'none'}</span>
            <span data-testid="has-variant">{lastToast?.variant || 'none'}</span>
            <span data-testid="has-duration">{lastToast?.duration ? 'yes' : 'no'}</span>
            <button onClick={() => context.success('Test Success')} data-testid="add-success">
              Add
            </button>
          </div>
        );
      };

      render(
        <ToastProvider>
          <ToastPropsConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-success'));

      expect(screen.getByTestId('has-id')).toHaveTextContent('yes');
      expect(screen.getByTestId('has-message')).toHaveTextContent('Test Success');
      expect(screen.getByTestId('has-variant')).toHaveTextContent('success');
      expect(screen.getByTestId('has-duration')).toHaveTextContent('yes');
    });
  });

  describe('toast durations', () => {
    it('should use different durations for different variants', () => {
      render(
        <ToastProvider>
          <TestConsumer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('add-success'));
      fireEvent.click(screen.getByTestId('add-error'));

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('2');

      act(() => {
        vi.advanceTimersByTime(3500);
      });

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('1');
      expect(screen.getByTestId('toasts-list')).toHaveTextContent('Error!');

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByTestId('toasts-count')).toHaveTextContent('0');
    });
  });
});
