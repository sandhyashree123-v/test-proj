import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import LoadingIndicator from '../components/LoadingIndicator';
import EmptyState from '../components/EmptyState';
import { getSkillById } from '../api/apiClient';

const STATUS_STYLES = {
  Published: 'bg-green-50 text-green-700 ring-green-600/20',
  Deprecated: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Archived: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

function SkillDetailPage() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setError(null);
    setSkill(null);

    getSkillById(id)
      .then((result) => {
        if (!active) return;
        if (!result) {
          setNotFound(true);
        } else {
          setSkill(result);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load skill');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        Back to catalog
      </Link>

      <div className="mt-6">
        {loading && <LoadingIndicator variant="detail" />}
        {!loading && notFound && <EmptyState variant="not-found" />}
        {!loading && error && <EmptyState variant="error" />}
        {!loading && skill && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{skill.name}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                  STATUS_STYLES[skill.status] || STATUS_STYLES.Archived
                }`}
              >
                {skill.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-700">{skill.description}</p>

            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-gray-900">{skill.category}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Owner</dt>
                <dd className="mt-1 text-gray-900">{skill.owner}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Version</dt>
                <dd className="mt-1 text-gray-900">{skill.version}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Last updated</dt>
                <dd className="mt-1 text-gray-900">{skill.lastUpdated}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-medium text-gray-500">Repository</dt>
                <dd className="mt-1">
                  <a href={skill.repoUrl} className="text-brand-600 hover:text-brand-700 break-all">
                    {skill.repoUrl}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {skill.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillDetailPage;
