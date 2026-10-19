import SkillCard from './SkillCard';
import LoadingIndicator from './LoadingIndicator';
import EmptyState from './EmptyState';

function SkillCardGrid({ items, loading, total, page, pageSize, onPageChange, emptyVariant, onClearFilters }) {
  if (loading) {
    return <LoadingIndicator variant="grid" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState variant={emptyVariant} onAction={emptyVariant === 'no-results' ? onClearFilters : undefined} />
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? 'page' : undefined}
              className={`h-9 w-9 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                pageNumber === page
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default SkillCardGrid;
