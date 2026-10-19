const STATUS_STYLES = {
  Valid: 'bg-green-50 text-green-700 ring-green-600/20',
  Revoked: 'bg-red-50 text-red-700 ring-red-600/20',
  Expired: 'bg-amber-50 text-amber-700 ring-amber-600/20',
};

function formatDate(isoDate) {
  try {
    return new Date(isoDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return isoDate;
  }
}

function CertificateResultCard({ result }) {
  const statusStyle = STATUS_STYLES[result.status] || STATUS_STYLES.Expired;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-medium text-gray-900">{result.learnerName}</h2>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle}`}>
          {result.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">Completed: {result.skillName}</p>
      <p className="mt-1 text-sm text-gray-500">Completion date: {formatDate(result.completionDate)}</p>
    </div>
  );
}

export default CertificateResultCard;
