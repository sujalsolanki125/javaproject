import { useState, useEffect } from 'react';
import { userService } from '../../services/user.service';

export function DashboardHeader({ title = 'Analytics Dashboard' }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [userInitial, setUserInitial] = useState('U');

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
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-100 px-8 py-4 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4 text-text-main">
        <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">
          {title}
        </h2>
      </div>
      <div className="flex flex-1 justify-end gap-4">
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <span className="material-symbols-outlined text-xl">notifications</span>
        </button>
        <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary shadow-sm flex items-center justify-center text-white font-bold text-lg"
          style={{
            backgroundImage: profilePicture ? `url(${profilePicture})` : 'none',
            backgroundColor: profilePicture ? 'transparent' : '#0DF26C'
          }}
        >
          {!profilePicture && userInitial}
        </div>
      </div>
    </header>
  );
}
