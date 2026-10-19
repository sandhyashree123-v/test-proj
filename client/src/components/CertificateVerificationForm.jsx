import { useState } from 'react';

const MAX_LENGTH = 100;

function CertificateVerificationForm({ onSubmit, loading }) {
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleChange = (event) => {
    const next = event.target.value.slice(0, MAX_LENGTH);
    setValue(next);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Please enter a certificate ID.');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <label htmlFor="certificateId" className="block text-sm font-medium text-gray-700">
          Certificate ID
        </label>
        <input
          id="certificateId"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="e.g. CERT-2024-00101"
          className="mt-1 w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        {validationError && <p className="mt-1 text-sm text-red-600">{validationError}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {loading ? 'Verifying…' : 'Verify'}
      </button>
    </form>
  );
}

export default CertificateVerificationForm;
