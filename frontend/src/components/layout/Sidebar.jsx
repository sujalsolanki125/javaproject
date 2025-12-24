import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';

export function Sidebar() {
  const location = useLocation();
  const [profilePicture, setProfilePicture] = useState(null);
  const [userInitial, setUserInitial] = useState('U');

  const navItems = [
    { path: '/dashboard', icon: 'monitoring', label: 'Dashboard' },
    { path: '/survey', icon: 'assignment', label: 'Survey' },
    { path: '/logs', icon: 'timeline', label: 'Logs' },
    { path: '/goals', icon: 'emoji_events', label: 'Goals' },
    { path: '/marketplace', icon: 'storefront', label: 'Marketplace' }
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userService.getUserProfile();
        if (profile.profilePicture) {
          setProfilePicture(profile.profilePicture);
        }
        if (profile.fullName) {
          setUserInitial(profile.fullName.charAt(0).toUpperCase());
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, []);

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
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shadow-sm flex items-center justify-center text-white font-bold text-sm"
          style={{
            backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
            backgroundColor: profilePicture ? 'transparent' : '#0DF26C'
          }}
        >
          {!profilePicture && userInitial}
        </div>
      </div>
    </nav>
  );
}
