import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import CertificateVerificationPage from '../pages/CertificateVerificationPage';
import * as apiClient from '../api/apiClient';

vi.mock('../api/apiClient');

describe('CertificateVerificationPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('shows certificate details when a match is found, including a revoked status', async () => {
    apiClient.verifyCertificate.mockResolvedValue({
      certificateId: 'CERT-2024-00103',
      learnerName: 'Carla Nguyen',
      skillName: 'Ticket Auto-Classifier',
      completionDate: '2026-05-20',
      status: 'Revoked',
    });

    render(<CertificateVerificationPage />);

    await userEvent.type(screen.getByLabelText(/Certificate ID/i), 'CERT-2024-00103');
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => expect(screen.getByText('Carla Nguyen')).toBeInTheDocument());
    expect(screen.getByText('Revoked')).toBeInTheDocument();
  });

  test('shows the not-found state when no certificate matches', async () => {
    apiClient.verifyCertificate.mockResolvedValue(null);

    render(<CertificateVerificationPage />);

    await userEvent.type(screen.getByLabelText(/Certificate ID/i), 'CERT-2024-99999');
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => expect(screen.getByText('Certificate not found')).toBeInTheDocument());
  });

  test('shows a validation message and does not call the API for an empty submission', async () => {
    render(<CertificateVerificationPage />);

    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    expect(await screen.findByText(/Please enter a certificate ID/)).toBeInTheDocument();
    expect(apiClient.verifyCertificate).not.toHaveBeenCalled();
  });
});
