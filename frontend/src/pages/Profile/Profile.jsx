import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { userService } from '../../services/user.service';
import { carbonService } from '../../services/carbon.service';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    location: '',
    ageGroup: '25-34',
    currentPassword: '',
    newPassword: '',
    weeklyReports: true,
    achievementNotifications: false
  });

  const [footprintData, setFootprintData] = useState({
    travel: 60,
    energy: 80,
    food: 45,
    goods: 30
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoadingData(true);
      
      // Load profile from backend
      const profile = await userService.getProfile();
      setProfileData(prev => ({
        ...prev,
        fullName: profile.fullName || '',
        email: profile.email || '',
        location: profile.location || '',
        ageGroup: profile.ageGroup || '25-34',
        weeklyReports: profile.weeklyReports !== undefined ? profile.weeklyReports : true,
        achievementNotifications: profile.achievementNotifications || false
      }));

      // Load carbon footprint summary
      const stats = await carbonService.getDashboardStats();
      if (stats && stats.categoryBreakdown) {
        setFootprintData({
          travel: stats.categoryBreakdown.transportation || 0,
          energy: stats.categoryBreakdown.energy || 0,
          food: stats.categoryBreakdown.diet || 0,
          goods: stats.categoryBreakdown.lifestyle || 0
        });
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
      // Fall back to local user data
      const user = authService.getCurrentUser();
      if (user) {
        setProfileData(prev => ({
          ...prev,
          fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username,
          email: user.email || user.username
        }));
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Update profile information
      await userService.updateProfile({
        fullName: profileData.fullName,
        location: profileData.location,
        ageGroup: profileData.ageGroup
      });

      // Update notification preferences
      await userService.updateNotificationPreferences({
        weeklyReports: profileData.weeklyReports,
        achievementNotifications: profileData.achievementNotifications
      });

      // Change password if provided
      if (profileData.currentPassword && profileData.newPassword) {
        await userService.changePassword({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        });
        
        // Clear password fields after successful change
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: ''
        }));
      }
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-solid border-black/10 px-4 py-4 dark:border-white/10 md:px-8 lg:px-16">
          <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
            <div className="h-8 w-8 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-800 dark:text-slate-200">
              CarbonTracker
            </h2>
          </div>
          <div className="hidden flex-1 justify-center gap-8 md:flex">
            <div className="flex items-center gap-9">
              <a
                href="/dashboard"
                className="text-sm font-medium leading-normal text-slate-600 hover:text-primary dark:text-slate-400"
              >
                Dashboard
              </a>
              <a
                href="/logs"
                className="text-sm font-medium leading-normal text-slate-600 hover:text-primary dark:text-slate-400"
              >
                Log Activity
              </a>
              <a
                href="/goals"
                className="text-sm font-medium leading-normal text-slate-600 hover:text-primary dark:text-slate-400"
              >
                Community
              </a>
              <a href="/profile" className="text-sm font-bold leading-normal text-primary">
                Profile
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-slate-600 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5">
              <span className="material-symbols-outlined text-2xl">settings</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-slate-600 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/5">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <div
              className="ml-2 aspect-square h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDpp4ekaI8phZkdYNzhlxi0EteMmm0u9m-00a1p7tPoEswY_r4PUGtP26B-SazGmDb3IoE3NaCyt2j2QDzRmjv7jkW13YgjugTOEp86MWTpJhLHGmiFjuKJRH6Aohk_CYgYK_HaUGzElC1kIFOXCPlPfAA2RhPZMJEtbnyV3GxIEB_Hmdp3hVRxO9j-pl3TULqQhnLQOMua48drMwOmXDEgiVm3yHab9JEEv5kyRPF1cKGFTKvWinLOjt8_5C__ISGFE3bpLTQmJxU")'
              }}
            ></div>
          </div>
        </header>

        <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
          <div className="layout-content-container flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
            {/* Left Column */}
            <aside className="w-full lg:w-1/3 lg:max-w-xs">
              <div className="sticky top-8 flex flex-col items-center rounded-xl bg-white p-6 shadow-sm dark:border dark:border-white/10 dark:bg-background-dark">
                <div className="relative mb-4">
                  <div
                    className="aspect-square h-32 w-32 rounded-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdqm6VUfIPBHpPQo7ZKSpPLmltvQY_dpL7TsOGsimQ0YLHhDT9pffS3LmcuV2_9ZcVSLadI44Usx59BnnY8fRDaXmgyQs_ix0-yx-vQyG9xNSEg_ADD6WUG0K1Nh-g780kERTOccsro1o47zGGUTtmzA8hvOfse5OUntEgBNuivUwbNxc5vBqMP3FdhXexIPMbgVL0xsuthfFKgTLGdstomUIEzPyfuYu_leLlANr0yfz6pSOuUrXaaZUuMgDCMbJk1evdfRWX_-w")'
                    }}
                  ></div>
                  <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background-dark hover:bg-primary/90">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-slate-800 dark:text-slate-100">
                    {profileData.fullName || 'User'}
                  </p>
                  <p className="text-base font-normal leading-normal text-slate-500 dark:text-slate-400">
                    {profileData.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 text-sm font-medium text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </aside>

            {/* Right Column */}
            <div className="flex flex-1 flex-col gap-8">
              {/* Message */}
              {message && (
                <div className="rounded-lg bg-primary/10 p-4 text-center text-sm font-medium text-primary">
                  {message}
                </div>
              )}
              
              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Personal Information Card */}
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:border dark:border-white/10 dark:bg-background-dark">
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-800 dark:text-slate-100">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">
                      Full Name
                    </p>
                    <input
                      className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-base font-normal leading-normal text-slate-800 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">
                      Location/City
                    </p>
                    <input
                      className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-base font-normal leading-normal text-slate-800 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">
                      Age Group
                    </p>
                    <select
                      className="form-select flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-base font-normal leading-normal text-slate-800 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      value={profileData.ageGroup}
                      onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                    >
                      <option>18-24</option>
                      <option>25-34</option>
                      <option>35-44</option>
                      <option>45+</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Carbon Footprint Summary Card */}
              <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm dark:border dark:border-white/10 dark:bg-background-dark">
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-800 dark:text-slate-100">
                  My Carbon Footprint Summary
                </h2>
                <div className="flex h-64 w-full items-end gap-4 border-b border-l border-slate-200 pb-4 pl-4 dark:border-slate-700">
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="w-full rounded bg-primary/20 dark:bg-primary/30" style={{ height: `${footprintData.travel}%` }}>
                      <div className="h-full w-full rounded bg-primary"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Travel</p>
                  </div>
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="w-full rounded bg-primary/20 dark:bg-primary/30" style={{ height: `${footprintData.energy}%` }}>
                      <div className="h-full w-full rounded bg-primary"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Energy</p>
                  </div>
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="w-full rounded bg-primary/20 dark:bg-primary/30" style={{ height: `${footprintData.food}%` }}>
                      <div className="h-full w-full rounded bg-primary"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Food</p>
                  </div>
                  <div className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <div className="w-full rounded bg-primary/20 dark:bg-primary/30" style={{ height: `${footprintData.goods}%` }}>
                      <div className="h-full w-full rounded bg-primary"></div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Goods</p>
                  </div>
                </div>
              </div>

              {/* Account Settings Card */}
              <div className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm dark:border dark:border-white/10 dark:bg-background-dark">
                <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-slate-800 dark:text-slate-100">
                  Account &amp; Notifications
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">
                      Current Password
                    </p>
                    <input
                      className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-base font-normal leading-normal text-slate-800 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      placeholder="••••••••"
                    />
                  </label>
                  <label className="flex flex-col">
                    <p className="pb-2 text-sm font-medium leading-normal text-slate-700 dark:text-slate-300">
                      New Password
                    </p>
                    <input
                      className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white px-4 text-base font-normal leading-normal text-slate-800 placeholder:text-slate-400 focus:outline-0 focus:ring-2 focus:ring-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                  </label>
                </div>
                <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Weekly Report Emails</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Get a summary of your carbon footprint every week.
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={profileData.weeklyReports}
                          onChange={(e) => handleInputChange('weeklyReports', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Achievement Notifications</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Get notified when you reach a new milestone.
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={profileData.achievementNotifications}
                          onChange={(e) => handleInputChange('achievementNotifications', e.target.checked)}
                        />
                        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-slate-600 dark:bg-slate-700"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 py-3 text-base font-bold leading-normal tracking-[0.015em] text-background-dark transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <span className="truncate">{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
