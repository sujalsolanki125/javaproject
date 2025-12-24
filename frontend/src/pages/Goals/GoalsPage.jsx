import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '../../services/leaderboard.service';
import { userService } from '../../services/user.service';

export default function GoalsPage() {
  const navigate = useNavigate();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [userProfile, setUserProfile] = useState({ profilePicture: null, fullName: '' });

  // Mock data for active goals
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Reduce Driving',
      current: 15,
      target: 20,
      unit: 'miles reduced',
      progress: 75
    },
    {
      id: 2,
      title: 'Meat-Free Days',
      current: 3,
      target: 6,
      unit: 'days completed',
      progress: 50
    },
    {
      id: 3,
      title: 'Reduce Energy Use',
      current: 18,
      target: 20,
      unit: 'kWh saved',
      progress: 90
    }
  ]);

  // Mock data for badges/achievements
  const badges = [
    {
      id: 1,
      icon: 'directions_bike',
      title: 'Eco-Commuter',
      description: 'Cycle 50 miles',
      unlocked: true,
      color: 'text-yellow-400'
    },
    {
      id: 2,
      icon: 'bolt',
      title: 'Energy Saver',
      description: 'Save 100 kWh',
      unlocked: true,
      color: 'text-green-400'
    },
    {
      id: 3,
      icon: 'recycling',
      title: 'Recycling Champion',
      description: 'Recycle 100 items',
      unlocked: false,
      color: ''
    },
    {
      id: 4,
      icon: 'public',
      title: 'Planet Hero',
      description: 'Complete 10 goals',
      unlocked: false,
      color: ''
    },
    {
      id: 5,
      icon: 'local_florist',
      title: 'Green Thumb',
      description: 'Plant a tree',
      unlocked: false,
      color: ''
    }
  ];

  // Fetch leaderboard data and user profile
  useEffect(() => {
    const loadData = async () => {
      try {
        const [topData, userData, profile] = await Promise.all([
          leaderboardService.getTopLeaderboard(10),
          leaderboardService.getUserLeaderboard(),
          userService.getUserProfile()
        ]);

        setLeaderboardData(topData);
        setCurrentUserRank(userData);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to load data:', error);
        setLeaderboardData([]);
      }
    };

    loadData();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full max-w-6xl flex-1 flex-col px-4 md:px-10">
            {/* Header */}
            <header className="mb-8 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light px-0 py-3 dark:border-border-dark">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_6_543)">
                      <path
                        d="M42.1739 20.1739L27.8261 5.82609C29.1366 7.13663 28.3989 10.1876 26.2002 13.7654C24.8538 15.9564 22.9595 18.3449 20.6522 20.6522C18.3449 22.9595 15.9564 24.8538 13.7654 26.2002C10.1876 28.3989 7.13663 29.1366 5.82609 27.8261L20.1739 42.1739C21.4845 43.4845 24.5355 42.7467 28.1133 40.548C30.3042 39.2016 32.6927 37.3073 35 35C37.3073 32.6927 39.2016 30.3042 40.548 28.1133C42.7467 24.5355 43.4845 21.4845 42.1739 20.1739Z"
                        fill="currentColor"
                      ></path>
                      <path
                        clipRule="evenodd"
                        d="M7.24189 26.4066C7.31369 26.4411 7.64204 26.5637 8.52504 26.3738C9.59462 26.1438 11.0343 25.5311 12.7183 24.4963C14.7583 23.2426 17.0256 21.4503 19.238 19.238C21.4503 17.0256 23.2426 14.7583 24.4963 12.7183C25.5311 11.0343 26.1438 9.59463 26.3738 8.52504C26.5637 7.64204 26.4411 7.31369 26.4066 7.24189C26.345 7.21246 26.143 7.14535 25.6664 7.1918C24.9745 7.25925 23.9954 7.5498 22.7699 8.14278C20.3369 9.32007 17.3369 11.4915 14.4142 14.4142C11.4915 17.3369 9.32007 20.3369 8.14278 22.7699C7.5498 23.9954 7.25925 24.9745 7.1918 25.6664C7.14534 26.143 7.21246 26.345 7.24189 26.4066ZM29.9001 10.7285C29.4519 12.0322 28.7617 13.4172 27.9042 14.8126C26.465 17.1544 24.4686 19.6641 22.0664 22.0664C19.6641 24.4686 17.1544 26.465 14.8126 27.9042C13.4172 28.7617 12.0322 29.4519 10.7285 29.9001L21.5754 40.747C21.6001 40.7606 21.8995 40.931 22.8729 40.7217C23.9424 40.4916 25.3821 39.879 27.0661 38.8441C29.1062 37.5904 31.3734 35.7982 33.5858 33.5858C35.7982 31.3734 37.5904 29.1062 38.8441 27.0661C39.879 25.3821 40.4916 23.9425 40.7216 22.8729C40.931 21.8995 40.7606 21.6001 40.747 21.5754L29.9001 10.7285ZM29.2403 4.41187L43.5881 18.7597C44.9757 20.1473 44.9743 22.1235 44.6322 23.7139C44.2714 25.3919 43.4158 27.2666 42.252 29.1604C40.8128 31.5022 38.8165 34.012 36.4142 36.4142C34.012 38.8165 31.5022 40.8128 29.1604 42.252C27.2666 43.4158 25.3919 44.2714 23.7139 44.6322C22.1235 44.9743 20.1473 44.9757 18.7597 43.5881L4.41187 29.2403C3.29027 28.1187 3.08209 26.5973 3.21067 25.2783C3.34099 23.9415 3.8369 22.4852 4.54214 21.0277C5.96129 18.0948 8.43335 14.7382 11.5858 11.5858C14.7382 8.43335 18.0948 5.9613 21.0277 4.54214C22.4852 3.8369 23.9415 3.34099 25.2783 3.21067C26.5973 3.08209 28.1187 3.29028 29.2403 4.41187Z"
                        fill="currentColor"
                        fillRule="evenodd"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_6_543">
                        <rect fill="white" height="48" width="48"></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">CarbonTracker</h2>
              </div>
              <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
                <div className="flex items-center gap-9">
                  <a href="/dashboard" className="text-sm font-medium leading-normal">
                    Dashboard
                  </a>
                  <a href="/goals" className="text-sm font-bold leading-normal text-primary">
                    Goals
                  </a>
                  <a href="/logs" className="text-sm font-medium leading-normal">
                    Community
                  </a>
                  <a href="/profile" className="text-sm font-medium leading-normal">
                    Learn
                  </a>
                </div>
                <div
                  className="aspect-square h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    backgroundImage: userProfile.profilePicture ? `url(${userProfile.profilePicture})` : 'none',
                    backgroundColor: userProfile.profilePicture ? 'transparent' : '#0DF26C'
                  }}
                >
                  {!userProfile.profilePicture && (userProfile.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U')}
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 space-y-12">
              {/* Hero Section */}
              <section>
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-4xl font-black leading-tight tracking-[-0.033em]">
                      Your Sustainability Journey
                    </p>
                    <p className="text-base font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">
                      Track your progress and earn rewards for making a difference.
                    </p>
                  </div>
                </div>
              </section>

              {/* Active Goals Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">Your Active Goals</h2>
                  <button
                    onClick={() => setShowAddGoal(true)}
                    className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-text-light"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                    <span className="truncate">Add New Goal</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex flex-col gap-4 rounded-xl border border-border-light bg-card-light p-6 dark:border-border-dark dark:bg-card-dark"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <p className="text-base font-medium leading-normal">{goal.title}</p>
                        <span className="material-symbols-outlined cursor-pointer text-text-muted-light dark:text-text-muted-dark">
                          edit
                        </span>
                      </div>
                      <div className="rounded-full bg-background-light dark:bg-background-dark">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm font-normal leading-normal text-text-muted-light dark:text-text-muted-dark">
                        {goal.current}/{goal.target} {goal.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Achievements & Badges Section */}
              <section className="space-y-6">
                <h2 className="px-4 text-2xl font-bold leading-tight tracking-[-0.015em]">
                  Achievements &amp; Badges
                </h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-3 rounded-xl border border-border-light bg-card-light p-4 text-center dark:border-border-dark dark:bg-card-dark ${
                        !badge.unlocked ? 'opacity-40' : ''
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-5xl ${badge.color}`}
                        style={{
                          fontVariationSettings: badge.unlocked ? "'FILL' 1" : "'FILL' 0"
                        }}
                      >
                        {badge.icon}
                      </span>
                      <p className="text-sm font-bold">{badge.title}</p>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        {badge.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Weekly Challenge Leaderboard Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">
                    Weekly Challenge Leaderboard
                  </h2>
                  <a href="#" className="text-sm font-bold text-primary">
                    View Full Leaderboard
                  </a>
                </div>
                <div className="rounded-xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
                  <div className="flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto">
                      <div className="inline-block min-w-full py-2 align-middle">
                        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                              >
                                Rank
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Username
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold">
                                CO2 Saved
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {leaderboardData.length > 0 ? (
                              leaderboardData.map((entry) => {
                                const isCurrentUser = currentUserRank && entry.username === currentUserRank.username;
                                const userInitial = entry.fullName ? entry.fullName.charAt(0).toUpperCase() : 'U';
                                
                                return (
                                  <tr
                                    key={entry.rank}
                                    className={isCurrentUser ? 'bg-primary/10' : ''}
                                  >
                                    <td
                                      className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0 ${
                                        isCurrentUser ? 'font-bold text-primary' : 'font-medium'
                                      }`}
                                    >
                                      {entry.rank}
                                    </td>
                                    <td
                                      className={`whitespace-nowrap px-3 py-4 text-sm ${
                                        isCurrentUser ? 'font-bold text-primary' : ''
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="aspect-square h-8 w-8 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-xs font-bold"
                                          style={{
                                            backgroundImage: entry.profilePicture ? `url(${entry.profilePicture})` : 'none',
                                            backgroundColor: entry.profilePicture ? 'transparent' : '#0DF26C'
                                          }}
                                        >
                                          {!entry.profilePicture && userInitial}
                                        </div>
                                        <span>{entry.fullName}</span>
                                      </div>
                                    </td>
                                    <td
                                      className={`whitespace-nowrap px-3 py-4 text-right text-sm ${
                                        isCurrentUser ? 'font-bold text-primary' : ''
                                      }`}
                                    >
                                      {(entry.totalCarbonSaved || 0).toFixed(2)} kg
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="3" className="py-8 text-center text-sm text-gray-500">
                                  No leaderboard data available yet. Start logging your carbon emissions!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
