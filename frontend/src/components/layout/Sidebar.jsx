import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: 'monitoring', label: 'Dashboard' },
    { path: '/survey', icon: 'assignment', label: 'Survey' },
    { path: '/logs', icon: 'timeline', label: 'Logs' },
    { path: '/goals', icon: 'emoji_events', label: 'Goals' },
    { path: '/marketplace', icon: 'storefront', label: 'Marketplace' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex w-20 flex-col items-center border-r border-gray-100 bg-white py-4 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="mb-8">
        <span className="material-symbols-outlined text-primary-dark text-3xl">
          energy_savings_leaf
        </span>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary-dark shadow-[0_0_15px_rgba(13,242,108,0.2)]'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <Link
          to="/profile"
          className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="material-symbols-outlined">account_circle</span>
        </Link>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCFCEith9oh_fJSbcZ3CR8Wn_pjqBRFC7Jo_KRmJdeZ1ZvDwAqMZ8RMe5NU5UBFG56yW46vB1pvlR0_URF7-3ehjj19Uvl-G65JVfkjw-f9ZaCbLctyPuQMwdkXfC7sxYiget7GoI9WfNMVwe6PkQRrMQ3veLBc9TswMFVjGZjzXRj3SvOcDJvNbapMtRczUgkka835LqhD1NfaEgCY3pq8rG3O6YfbxZPHYyUPvCSN8xo0ReTzku-twPw8ieAh-oP6WD9vCGiJFEg")'
          }}
        />
      </div>
    </nav>
  );
}
