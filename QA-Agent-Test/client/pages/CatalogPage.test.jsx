// QA Agent generated suite — traces to artifacts/design/test-planning/unit-test-cases-3.md
// Covers: UTC-04, UTC-20
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import CatalogPage from '../../../client/src/pages/CatalogPage';
import * as apiClient from '../../../client/src/api/apiClient';

vi.mock('../../../client/src/api/apiClient');

describe('CatalogPage — loading state & active-filter indicator (QA Agent suite)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // UTC-04: Catalog listing exposes a loading state before resolution
  test('UTC-04: the catalog shows a loading indicator before the listing call resolves, then hides it once data arrives', async () => {
    let resolveListing;
    const pending = new Promise((resolve) => {
      resolveListing = resolve;
    });
    apiClient.listSkills.mockReturnValue(pending);

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('status', { name: /loading skills/i })).toBeInTheDocument();

    resolveListing({ items: [], total: 0, page: 1, pageSize: 12 });

    await waitFor(() =>
      expect(screen.queryByRole('status', { name: /loading skills/i })).not.toBeInTheDocument()
    );
  });

  // UTC-20: Active filter state is retrievable for UI indicators
  // NOTE: the mocked response below intentionally returns one non-empty skill item (rather
  // than an empty list) so that only the FilterPanel's own "Clear filters" button is present
  // in the DOM. An empty result list would ALSO surface the EmptyState component's separate
  // "no-results" "Clear filters" action button, which is unrelated application behavior (not
  // a bug) but makes a single getByRole('button', {name: /clear filters/i}) query ambiguous.
  // This avoids that test-setup ambiguity without changing what UTC-20 actually verifies
  // (the category select reflecting the active filter, plus a visible "Clear filters"
  // affordance).
  test('UTC-20: selecting a category filter updates the visible active-filter indicator (select value + Clear filters action)', async () => {
    apiClient.listSkills.mockResolvedValue({
      items: [
        {
          id: 'skill-qa-sample',
          name: 'QA Sample Skill',
          description: 'Sample skill used to keep the catalog non-empty for this test.',
          category: 'Engineering',
          tags: ['testing'],
          owner: 'QA Agent',
          status: 'Published',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 12,
    });

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(apiClient.listSkills).toHaveBeenCalled());

    const categorySelect = screen.getByLabelText(/filter by category/i);
    await userEvent.selectOptions(categorySelect, 'Engineering');

    await waitFor(() => expect(categorySelect).toHaveValue('Engineering'));
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });
});
