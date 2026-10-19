import { NavLink } from 'react-router-dom';
import { Squares2X2Icon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function NavBar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
      isActive ? 'text-brand-700 underline underline-offset-4 decoration-2' : 'text-gray-600 hover:text-brand-600'
    }`;

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">AI Skills Catalog</span>
        <div className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
            Catalog
          </NavLink>
          <NavLink to="/verify-certificate" className={linkClass}>
            <ShieldCheckIcon className="h-5 w-5" aria-hidden="true" />
            Verify Certificate
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
