import { useCallback, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import SkillCardGrid from '../components/SkillCardGrid';
import EmptyState from '../components/EmptyState';
import { listSkills } from '../api/apiClient';

function CatalogPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState(undefined);
  const [tag, setTag] = useState(undefined);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listSkills({ q, category, tag, page });
      setItems(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
    } catch (err) {
      setError(err.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, [q, category, tag, page]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSearchChange = (value) => {
    setQ(value);
    setPage(1);
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setPage(1);
  };

  const handleTagChange = (value) => {
    setTag(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setQ('');
    setCategory(undefined);
    setTag(undefined);
    setPage(1);
  };

  const hasActiveFilters = Boolean(q || category || tag);
  const emptyVariant = hasActiveFilters ? 'no-results' : 'zero-catalog';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">AI Skills Catalog</h1>
      <p className="mt-1 text-sm text-gray-600">Discover reusable AI skills contributed across the organization.</p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <SearchBar value={q} onChange={handleSearchChange} />
        <FilterPanel
          category={category}
          tag={tag}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onClear={handleClearFilters}
        />
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState variant="error" onAction={fetchSkills} />
        ) : (
          <SkillCardGrid
            items={items}
            loading={loading}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            emptyVariant={emptyVariant}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}

export default CatalogPage;
