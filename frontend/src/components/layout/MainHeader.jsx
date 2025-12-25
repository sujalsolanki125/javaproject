import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';

export function MainHeader() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userInitial, setUserInitial] = useState('U');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
    };

    const loadProfile = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await userService.getUserProfile();
          if (profile.profilePicture) {
            setProfilePicture(profile.profilePicture);
          }
          if (profile.fullName) {
            setUserInitial(profile.fullName.charAt(0).toUpperCase());
          } else if (profile.email) {
            setUserInitial(profile.email.charAt(0).toUpperCase());
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      }
    };

    checkAuth();
    loadProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setProfilePicture(null);
    setUserInitial('U');
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-100 border-b border-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 text-[#111813] dark:text-white">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
          </div>
          <Link to="/" className="text-[#111813] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            CarbonCalc
          </Link>
        </div>
        
        <div className="hidden lg:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link to="/dashboard" className="text-[#111813] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
              Dashboard
            </Link>
            <Link to="/survey" className="text-[#111813] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
              Survey
            </Link>
            <Link to="/survey" className="text-[#111813] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
              Calculator
            </Link>
            <Link to="/marketplace" className="text-[#111813] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
              Marketplace
            </Link>
            <a href="#" className="text-[#111813] dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal">
              Learn
            </a>
          </div>
          
          {/* Authentication Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Profile Picture with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-primary shadow-sm flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
                        backgroundColor: profilePicture ? 'transparent' : '#0DF26C'
                      }}
                    >
                      {!profilePicture && userInitial}
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">person</span>
                        Profile
                      </button>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        Dashboard
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-primary text-[#111813] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Login</span>
              </button>
            )}
          </div>
        </div>
        
        <button className="lg:hidden p-2 rounded-md text-[#111813] dark:text-gray-300">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}