import {
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  FaceFrownIcon,
} from '@heroicons/react/24/outline';

const VARIANTS = {
  'zero-catalog': {
    icon: ArchiveBoxIcon,
    title: 'No skills in the catalog yet',
    description: 'Check back soon — new AI skills are added regularly.',
  },
  'no-results': {
    icon: MagnifyingGlassIcon,
    title: 'No skills match your search',
    description: 'Try a different keyword or clear your filters.',
    actionLabel: 'Clear filters',
  },
  'not-found': {
    icon: FaceFrownIcon,
    title: 'Skill not found',
    description: "This skill doesn't exist or may have been removed.",
  },
  'certificate-not-found': {
    icon: ShieldExclamationIcon,
    title: 'Certificate not found',
    description: 'Double-check the certificate ID and try again.',
  },
  error: {
    icon: ExclamationTriangleIcon,
    title: 'Something went wrong',
    description: 'We ran into a problem loading this. Please try again.',
    actionLabel: 'Retry',
  },
};

function EmptyState({ variant, onAction }) {
  const config = VARIANTS[variant] || VARIANTS.error;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <Icon className="h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-gray-900">{config.title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{config.description}</p>
      {config.actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center rounded-md bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          {config.actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
