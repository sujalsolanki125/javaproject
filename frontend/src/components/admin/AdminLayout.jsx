import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        
        // Grant admin access to specific email for development
        const adminEmails = [
          'sujalkumarofficial2005@gmail.com',
          // Add more admin emails here as needed
        ];
        
        const isAdminEmail = adminEmails.includes(userData.email?.toLowerCase());
        const hasAdminRole = userData.role === 'ADMIN';
        
        if (!hasAdminRole && !isAdminEmail) {
          navigate('/');
          return;
        }
        
        // Set admin role for authorized emails
        if (isAdminEmail) {
          userData.role = 'ADMIN';
        }
        
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      path: '/admin',
      exact: true
    },
    {
      icon: 'inventory_2',
      label: 'Products',
      path: '/admin/products'
    },
    {
      icon: 'shopping_cart',
      label: 'Orders',
      path: '/admin/orders'
    },
    {
      icon: 'people',
      label: 'Users',
      path: '/admin/users'
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      path: '/admin/analytics'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed ? (
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          ) : (
            <span className="material-symbols-outlined text-2xl text-primary">admin_panel_settings</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                isActive(item.path, item.exact) ? 'bg-primary/10 text-primary border-r-4 border-primary' : ''
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="h-full px-6 flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                {isCollapsed ? 'menu' : 'menu_open'}
              </span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">{user.name?.charAt(0)}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Logout"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}