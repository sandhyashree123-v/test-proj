// Mirrors the categories/tags present in the fixed server-side seed data
// (server/src/seed/seedData.js) — this is a Simple-scope build with no "list distinct
// values" endpoint, so the known seed vocabulary is reused directly here.
const CATEGORIES = ['Productivity', 'Data & Analytics', 'Customer Support', 'Engineering'];

const TAGS = [
  'analytics',
  'anomaly-detection',
  'automation',
  'classification',
  'code-review',
  'email',
  'engineering',
  'forecasting',
  'logs',
  'meetings',
  'ml',
  'monitoring',
  'nlp',
  'planning',
  'productivity',
  'search',
  'sentiment',
  'sql',
  'summarization',
  'support',
  'testing',
];

function FilterPanel({ category, tag, onCategoryChange, onTagChange, onClear }) {
  const hasActiveFilters = Boolean(category || tag);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={category || ''}
        onChange={(event) => onCategoryChange(event.target.value || undefined)}
        aria-label="Filter by category"
        className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={tag || ''}
        onChange={(event) => onTagChange(event.target.value || undefined)}
        aria-label="Filter by tag"
        className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="">All tags</option>
        {TAGS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default FilterPanel;
