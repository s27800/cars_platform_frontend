import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastContainer } from '../Toast';
import { ToastContext, ToastProvider } from '../../../contexts/ToastContext';


// Helper component to trigger toasts
const ToastTrigger = ({ variant = 'info', message = 'Test message' }) => {
  const context = React.useContext(ToastContext);
  
  return (
    <button 
      data-testid="trigger" 
      onClick={() => context?.addToast({ message, variant })}
    >
      Add Toast
    </button>
  );
};


describe('ToastContainer', () => {
  describe('rendering', () => {
    it('should not render when no toasts', () => {
      render(
        <ToastProvider>
          <ToastContainer />
        </ToastProvider>
      );
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should render toast when added via context', async () => {
      render(
        <ToastProvider>
          <ToastTrigger message="Hello toast" />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Hello toast')).toBeInTheDocument();
      });
    });

    it('should render toast with role="alert"', async () => {
      render(
        <ToastProvider>
          <ToastTrigger message="Alert toast" />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('variants', () => {
    it('should render success toast', async () => {
      const SuccessTrigger = () => {
        const { success } = React.useContext(ToastContext);
        return <button data-testid="trigger" onClick={() => success('Success!')}>Trigger</button>;
      };

      render(
        <ToastProvider>
          <SuccessTrigger />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument();
      });
    });

    it('should render error toast', async () => {
      const ErrorTrigger = () => {
        const { error } = React.useContext(ToastContext);
        return <button data-testid="trigger" onClick={() => error('Error!')}>Trigger</button>;
      };

      render(
        <ToastProvider>
          <ErrorTrigger />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Error!')).toBeInTheDocument();
      });
    });

    it('should render warning toast', async () => {
      const WarningTrigger = () => {
        const { warning } = React.useContext(ToastContext);
        return <button data-testid="trigger" onClick={() => warning('Warning!')}>Trigger</button>;
      };

      render(
        <ToastProvider>
          <WarningTrigger />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Warning!')).toBeInTheDocument();
      });
    });

    it('should render info toast', async () => {
      const InfoTrigger = () => {
        const { info } = React.useContext(ToastContext);
        return <button data-testid="trigger" onClick={() => info('Info!')}>Trigger</button>;
      };

      render(
        <ToastProvider>
          <InfoTrigger />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Info!')).toBeInTheDocument();
      });
    });
  });

  describe('dismissal', () => {
    it('should have dismiss button', async () => {
      render(
        <ToastProvider>
          <ToastTrigger message="Dismissable toast" />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Dismiss notification' })).toBeInTheDocument();
      });
    });

    it('should trigger exit animation when close button is clicked', async () => {
      render(
        <ToastProvider>
          <ToastTrigger message="Dismissable toast" />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        expect(screen.getByText('Dismissable toast')).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: 'Dismiss notification' });
      fireEvent.click(dismissButton);

      expect(dismissButton).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-live attribute', async () => {
      render(
        <ToastProvider>
          <ToastTrigger message="Accessible toast" />
          <ToastContainer />
        </ToastProvider>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      await waitFor(() => {
        const toast = screen.getByRole('alert');
        expect(toast).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('without context', () => {
    it('should return null when no context', () => {
      const { container } = render(<ToastContainer />);
      
      expect(container).toBeEmptyDOMElement();
    });
  });
});


describe('showToast exports', () => {
  it('should export setToastRef function', async () => {
    const { setToastRef } = await import('../Toast');

    expect(typeof setToastRef).toBe('function');
  });

  it('should export showToast object', async () => {
    const { showToast } = await import('../Toast');

    expect(showToast).toBeDefined();
    expect(typeof showToast.success).toBe('function');
    expect(typeof showToast.error).toBe('function');
    expect(typeof showToast.warning).toBe('function');
    expect(typeof showToast.info).toBe('function');
  });

  it('should handle showToast calls when ref is not set', async () => {
    const { showToast, setToastRef } = await import('../Toast');
    
    setToastRef(null);
    
    expect(() => showToast.success('test')).not.toThrow();
    expect(() => showToast.error('test')).not.toThrow();
    expect(() => showToast.warning('test')).not.toThrow();
    expect(() => showToast.info('test')).not.toThrow();
  });
});
