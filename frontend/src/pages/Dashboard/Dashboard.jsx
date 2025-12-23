import { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import DashboardHeader from '../../components/layout/DashboardHeader';
import AnalyticsCard from './AnalyticsCard';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [dashboardData, setDashboardData] = useState({
    todayEmissions: { value: 5.2, change: '+5%', trend: 'up', comparison: 'vs yesterday' },
    weeklyTrend: { value: 38.5, change: '-15%', trend: 'down', comparison: 'vs last week' },
    monthlyTotal: { value: 162.1, change: 'On track', trend: 'neutral', comparison: 'for goal' },
    categories: [
      { name: 'Transport', value: 45.2, icon: 'directions_car', color: 'blue' },
      { name: 'Food', value: 67.8, icon: 'restaurant', color: 'orange' },
      { name: 'Energy', value: 31.1, icon: 'bolt', color: 'yellow' },
      { name: 'Other', value: 18.0, icon: 'more_horiz', color: 'purple' }
    ],
    goals: [
      { title: 'Reduce transport by 10%', progress: 65 },
      { title: '3 Meatless Days a Week', progress: 80 },
      { title: 'Lower Energy Use', progress: 40 }
    ],
    badges: [
      { name: 'Eco-Commuter', icon: 'military_tech', color: 'yellow-500', unlocked: true },
      { name: 'Meatless Week', icon: 'eco', color: 'green-500', unlocked: true },
      { name: 'Recycle Pro', icon: 'recycling', color: 'blue-500', unlocked: true },
      { name: 'Energy Saver', icon: 'lock', color: 'gray-400', unlocked: false },
      { name: 'Green Shopper', icon: 'lock', color: 'gray-400', unlocked: false },
      { name: 'First Month', icon: 'lock', color: 'gray-400', unlocked: false }
    ]
  });

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-background-light">
        <DashboardHeader title="Analytics Dashboard" />
        
        <div className="flex">
          <div className="flex-1 p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnalyticsCard
                title="Today's Emissions"
                value={dashboardData.todayEmissions.value}
                unit="kg CO2e"
                change={dashboardData.todayEmissions.change}
                trend={dashboardData.todayEmissions.trend}
                comparison={dashboardData.todayEmissions.comparison}
              />
              <AnalyticsCard
                title="Weekly Trend"
                value={dashboardData.weeklyTrend.value}
                unit="kg CO2e"
                change={dashboardData.weeklyTrend.change}
                trend={dashboardData.weeklyTrend.trend}
                comparison={dashboardData.weeklyTrend.comparison}
              />
              <AnalyticsCard
                title="Monthly Total"
                value={dashboardData.monthlyTotal.value}
                unit="kg CO2e"
                change={dashboardData.monthlyTotal.change}
                trend={dashboardData.monthlyTotal.trend}
                comparison={dashboardData.monthlyTotal.comparison}
              />
            </div>

            {/* Emissions Trend Chart */}
            <div className="mt-8 flex flex-col gap-4 rounded-xl border border-gray-100 bg-card-light p-6 shadow-sm hover:shadow-[0_4px_20px_rgba(13,242,108,0.05)] transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-text-main text-lg font-semibold leading-normal">Emissions Trend</h3>
                  <p className="text-text-sub text-sm">Last 30 Days</p>
                </div>
                <div className="flex gap-1 rounded-lg border border-gray-200 p-1 bg-white">
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 text-xs rounded-md font-medium ${
                      timeRange === 'month'
                        ? 'text-primary-dark bg-primary/10'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 text-xs rounded-md font-medium ${
                      timeRange === 'week'
                        ? 'text-primary-dark bg-primary/10'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange('year')}
                    className={`px-3 py-1 text-xs rounded-md font-medium ${
                      timeRange === 'year'
                        ? 'text-primary-dark bg-primary/10'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <div className="h-72 w-full">
                <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_1131_5935)"></path>
                  <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#0df26c" strokeLinecap="round" strokeWidth="3"></path>
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1131_5935" x1="236" x2="236" y1="1" y2="149">
                      <stop stopColor="#0df26c" stopOpacity="0.2"></stop>
                      <stop offset="1" stopColor="#0df26c" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Carbon Categories */}
            <div className="mt-8">
              <h2 className="text-text-main text-xl font-bold leading-tight tracking-[-0.015em] mb-4">
                Carbon Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardData.categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl p-4 border border-gray-100 bg-card-light shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-${category.color}-50 text-${category.color}-600`}>
                      <span className="material-symbols-outlined">{category.icon}</span>
                    </div>
                    <div>
                      <p className="text-text-sub text-sm">{category.name}</p>
                      <p className="text-text-main font-bold text-lg">{category.value} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-80 border-l border-gray-100 p-6 space-y-8 hidden lg:block bg-card-light/50">
            {/* Goals Progress */}
            <div>
              <h3 className="text-text-main text-lg font-semibold leading-tight mb-4">Goals Progress</h3>
              <div className="space-y-5">
                {dashboardData.goals.map((goal, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-text-sub">{goal.title}</p>
                      <p className="text-sm font-bold text-primary-dark">{goal.progress}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{
                          width: `${goal.progress}%`,
                          boxShadow: '0 0 6px rgba(13,242,108,0.5)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Badges */}
            <div>
              <h3 className="text-text-main text-lg font-semibold leading-tight mb-4">Recent Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                {dashboardData.badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-center p-3 aspect-square rounded-xl ${
                      badge.unlocked
                        ? 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow'
                        : 'bg-gray-100 border border-gray-200 text-gray-400'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-${badge.color} text-4xl ${
                      badge.unlocked ? 'drop-shadow-sm' : ''
                    }`}>
                      {badge.icon}
                    </span>
                    <p className="text-xs text-center mt-1 font-medium">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
