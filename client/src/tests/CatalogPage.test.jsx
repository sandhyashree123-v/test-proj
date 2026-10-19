import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import CatalogPage from '../pages/CatalogPage';
import * as apiClient from '../api/apiClient';

vi.mock('../api/apiClient');

const sampleResult = {
  items: [
    {
      id: 'skill-1',
      name: 'Alpha Skill',
      description: 'Desc',
      category: 'Engineering',
      tags: ['testing'],
      owner: 'Team',
      status: 'Published',
    },
  ],
  total: 1,
  page: 1,
  pageSize: 12,
};

describe('CatalogPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders skills returned from the API', async () => {
    apiClient.listSkills.mockResolvedValue(sampleResult);

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Alpha Skill')).toBeInTheDocument());
  });

  test('renders the zero-catalog empty state when there are no skills and no filters', async () => {
    apiClient.listSkills.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 12 });

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/No skills in the catalog yet/)).toBeInTheDocument());
  });

  test('renders an error state when the API call fails', async () => {
    apiClient.listSkills.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Something went wrong/)).toBeInTheDocument());
  });
});
