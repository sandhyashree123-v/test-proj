import { useState } from 'react';
import CertificateVerificationForm from '../components/CertificateVerificationForm';
import CertificateResultCard from '../components/CertificateResultCard';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import { verifyCertificate } from '../api/apiClient';

function CertificateVerificationPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (certificateId) => {
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setError(null);
    try {
      const response = await verifyCertificate(certificateId);
      if (!response) {
        setNotFound(true);
      } else {
        setResult(response);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Verify a Certificate</h1>
      <p className="mt-1 text-sm text-gray-600">
        Enter a certificate ID to confirm a learner&apos;s completion status. No login required.
      </p>

      <div className="mt-6">
        <CertificateVerificationForm onSubmit={handleSubmit} loading={loading} />
      </div>

      <div className="mt-8">
        {loading && <LoadingIndicator variant="detail" />}
        {!loading && notFound && <EmptyState variant="certificate-not-found" />}
        {!loading && error && <EmptyState variant="error" onAction={() => setError(null)} />}
        {!loading && result && <CertificateResultCard result={result} />}
      </div>
    </div>
  );
}

export default CertificateVerificationPage;
