import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  Published: 'bg-green-50 text-green-700 ring-green-600/20',
  Deprecated: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Archived: 'bg-gray-100 text-gray-600 ring-gray-500/20',
};

function SkillCard({ skill }) {
  const statusStyle = STATUS_STYLES[skill.status] || STATUS_STYLES.Archived;

  return (
    <Link
      to={`/skills/${skill.id}`}
      className="group flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-brand-700">{skill.name}</h3>
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle}`}
        >
          {skill.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{skill.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {skill.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>{skill.category}</span>
        <span>{skill.owner}</span>
      </div>
    </Link>
  );
}

export default SkillCard;
