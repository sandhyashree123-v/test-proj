import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import SkillDetailPage from '../pages/SkillDetailPage';
import * as apiClient from '../api/apiClient';

vi.mock('../api/apiClient');

function renderWithRoute(id) {
  return render(
    <MemoryRouter initialEntries={[`/skills/${id}`]}>
      <Routes>
        <Route path="/skills/:id" element={<SkillDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SkillDetailPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders full skill details on success', async () => {
    apiClient.getSkillById.mockResolvedValue({
      id: 'skill-1',
      name: 'Alpha Skill',
      description: 'Desc',
      category: 'Engineering',
      tags: ['testing'],
      owner: 'Team',
      version: '1.0.0',
      status: 'Published',
      lastUpdated: '2026-01-01',
      repoUrl: 'https://example.com',
    });

    renderWithRoute('skill-1');

    await waitFor(() => expect(screen.getByText('Alpha Skill')).toBeInTheDocument());
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  test('renders the not-found state when the skill does not exist', async () => {
    apiClient.getSkillById.mockResolvedValue(null);

    renderWithRoute('does-not-exist');

    await waitFor(() => expect(screen.getByText('Skill not found')).toBeInTheDocument());
  });
});
