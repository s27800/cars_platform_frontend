import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';


vi.mock('react-i18next', () => ({
  withTranslation: () => (Component) => (props) => <Component {...props} t={(key) => key} />,
  useTranslation: () => ({ t: (key) => key, i18n: { language: 'en', changeLanguage: vi.fn() } }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));


const Boom = ({ message = 'render exploded' }) => {
  throw new Error(message);
};

const Fine = () => <div>All good</div>;


describe('ErrorBoundary', () => {
  let consoleError;
  let originalLocation;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '/cars', reload: vi.fn() };
  });

  afterEach(() => {
    consoleError.mockRestore();
    window.location = originalLocation;
  });


  describe('without an error', () => {
    it('should render its children', () => {
      render(
        <ErrorBoundary>
          <Fine />
        </ErrorBoundary>
      );

      expect(screen.getByText('All good')).toBeInTheDocument();
    });

    it('should not show the fallback UI', () => {
      render(
        <ErrorBoundary>
          <Fine />
        </ErrorBoundary>
      );

      expect(screen.queryByText('errorBoundary.title')).not.toBeInTheDocument();
    });
  });


  describe('when a child throws', () => {
    it('should show the fallback UI instead of crashing', () => {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      );

      expect(screen.getByText('errorBoundary.title')).toBeInTheDocument();
      expect(screen.getByText('errorBoundary.description')).toBeInTheDocument();
    });

    it('should not render the child that threw', () => {
      render(
        <ErrorBoundary>
          <Boom />
          <Fine />
        </ErrorBoundary>
      );

      expect(screen.queryByText('All good')).not.toBeInTheDocument();
    });

    it('should offer a way to retry, reload and go home', () => {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      );

      expect(screen.getByRole('button', { name: 'errorBoundary.tryAgain' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'errorBoundary.reload' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'errorBoundary.goHome' })).toBeInTheDocument();
    });

    it('should render a custom fallback when one is given', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <Boom />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
      expect(screen.queryByText('errorBoundary.title')).not.toBeInTheDocument();
    });
  });


  describe('recovery actions', () => {
    it('should render the children again after a retry that succeeds', () => {
      let shouldThrow = true;
      const Flaky = () => {
        if (shouldThrow)
          throw new Error('render exploded');

        return <div>Recovered</div>;
      };

      render(
        <ErrorBoundary>
          <Flaky />
        </ErrorBoundary>
      );

      expect(screen.getByText('errorBoundary.title')).toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'errorBoundary.tryAgain' }));

      expect(screen.getByText('Recovered')).toBeInTheDocument();
    });

    it('should show the fallback again if the retry throws once more', () => {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'errorBoundary.tryAgain' }));

      expect(screen.getByText('errorBoundary.title')).toBeInTheDocument();
    });

    it('should reload the page on reload', () => {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'errorBoundary.reload' }));

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should navigate home on go home', () => {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: 'errorBoundary.goHome' }));

      expect(window.location.href).toBe('/');
    });
  });
});
