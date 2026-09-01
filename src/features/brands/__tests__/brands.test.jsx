import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';


// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, isLoading: false }),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => params?.count !== undefined ? `${key} ${params.count}` : key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
  Trans: ({ children }) => children,
}));


describe('ModelsGrid', () => {
  it('should render models in alphabetical order', async () => {
    const { default: ModelsGrid } = await import('../ModelsGrid');
    const models = [
      { id: 1, name: 'Corolla', generationsCount: 3 },
      { id: 2, name: 'Avalon', generationsCount: 2 },
      { id: 3, name: 'Camry', generationsCount: 5 },
    ];

    render(
      <MemoryRouter>
        <ModelsGrid models={models} />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveTextContent('Avalon');
    expect(links[1]).toHaveTextContent('Camry');
    expect(links[2]).toHaveTextContent('Corolla');
  });

  it('should render model cards with correct links', async () => {
    const { default: ModelsGrid } = await import('../ModelsGrid');
    const models = [{ id: 42, name: 'Test Model', generationsCount: 1 }];

    render(
      <MemoryRouter>
        <ModelsGrid models={models} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', '/models/42');
  });

  it('should render empty grid when no models provided', async () => {
    const { default: ModelsGrid } = await import('../ModelsGrid');

    const { container } = render(
      <MemoryRouter>
        <ModelsGrid models={[]} />
      </MemoryRouter>
    );

    expect(container.querySelector('.grid')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
