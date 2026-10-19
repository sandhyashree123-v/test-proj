import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const DEBOUNCE_MS = 300;

function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(newValue), DEBOUNCE_MS);
  };

  return (
    <div className="relative flex-1">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder="Search skills by name, description, or tag..."
        aria-label="Search skills"
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

export default SearchBar;
