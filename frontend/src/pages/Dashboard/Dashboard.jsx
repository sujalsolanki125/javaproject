import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import { DashboardHeader } from '../../components/layout/DashboardHeader';
import AnalyticsCard from './AnalyticsCard';
import EmissionsTrendChart from '../../components/charts/EmissionsTrendChart';
import { carbonService } from '../../services/carbon.service';

export default function Dashboard() {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [trendData, setTrendData] = useState({});
  const [dashboardData, setDashboardData] = useState({
    todayEmissions: { value: 0, change: '+0%', trend: 'neutral', comparison: 'vs yesterday' },
    weeklyTrend: { value: 0, change: '0%', trend: 'neutral', comparison: 'vs last week' },
    monthlyTotal: { value: 0, change: 'On track', trend: 'neutral', comparison: 'for goal' },
    categories: [
      { name: 'Transport', value: 0, icon: 'directions_car', color: 'blue' },
      { name: 'Food', value: 0, icon: 'restaurant', color: 'orange' },
      { name: 'Energy', value: 0, icon: 'bolt', color: 'yellow' },
      { name: 'Other', value: 0, icon: 'more_horiz', color: 'purple' }
    ],
    goals: [],
    badges: []
  });

  const formatEmission = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return '0';
    return numeric.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    loadDashboardData();
    
    // Show message from navigation state (e.g., survey submission)
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage(''), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    loadTrendData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from backend
      const stats = await carbonService.getDashboardStats();
      
      if (stats) {
        setDashboardData({
          todayEmissions: {
            value: formatEmission(stats.todayEmissions),
            change: stats.todayChange || '+0%',
            trend: stats.todayTrend || 'neutral',
            comparison: 'vs yesterday'
          },
          weeklyTrend: {
            value: formatEmission(stats.weeklyEmissions),
            change: stats.weeklyChange || '0%',
            trend: stats.weeklyTrend || 'neutral',
            comparison: 'vs last week'
          },
          monthlyTotal: {
            value: formatEmission(stats.monthlyEmissions),
            change: stats.goalStatus || 'On track',
            trend: stats.monthlyTrend || 'neutral',
            comparison: 'for goal'
          },
          categories: [
            { 
              name: 'Transport', 
              value: formatEmission(stats.categoryBreakdown?.transportation), 
              icon: 'directions_car', 
              color: 'blue' 
            },
            { 
              name: 'Food', 
              value: formatEmission(stats.categoryBreakdown?.diet), 
              icon: 'restaurant', 
              color: 'orange' 
            },
            { 
              name: 'Energy', 
              value: formatEmission(stats.categoryBreakdown?.energy), 
              icon: 'bolt', 
              color: 'yellow' 
            },
            { 
              name: 'Other', 
              value: formatEmission(stats.categoryBreakdown?.lifestyle), 
              icon: 'more_horiz', 
              color: 'purple' 
            }
          ],
          goals: stats.goals || [],
          badges: stats.badges || []
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Keep default/empty state on error
    } finally {
      setLoading(false);
    }
  };

  const loadTrendData = async () => {
    try {
      const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const data = await carbonService.getTrendData(days);
      setTrendData(data);
    } catch (err) {
      console.error('Failed to load trend data:', err);
      setTrendData({});
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-background-light">
        <DashboardHeader title="Analytics Dashboard" />
        
        {/* Success Message from Survey */}
        {message && (
          <div className="mx-8 mt-4 rounded-lg bg-primary/10 p-4 text-center text-sm font-medium text-primary">
            {message}
          </div>
        )}
        
        <div className="flex">
          <div className="flex-1 p-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
              </div>
            ) : (
              <>
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
                  <p className="text-text-sub text-sm">
                    {timeRange === 'day' ? 'Today (Hourly)' : 
                     timeRange === 'week' ? 'Last 7 Days' : 
                     timeRange === 'month' ? 'Last 30 Days' : 
                     'Last 365 Days'}
                  </p>
                </div>
                <div className="flex gap-1 rounded-lg border border-gray-200 p-1 bg-white">
                  <button
                    onClick={() => setTimeRange('day')}
                    className={`px-3 py-1 text-xs rounded-md font-medium ${
                      timeRange === 'day'
                        ? 'text-primary-dark bg-primary/10'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    Today
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
                {Object.keys(trendData).length > 0 ? (
                  <EmissionsTrendChart trendData={trendData} timeRange={timeRange} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>No data available for this period</p>
                  </div>
                )}
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
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="w-96 border-l border-gray-100 p-8 hidden lg:block bg-background-light overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
            <div className="space-y-8">
              {/* Goals Progress */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-text-main text-base font-bold leading-tight mb-6">Goals Progress</h3>
                <div className="space-y-6">
                  {dashboardData.goals.map((goal, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-text-sub">{goal.title}</p>
                        <p className="text-sm font-bold text-primary">{goal.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary rounded-full h-2.5"
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
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-text-main text-base font-bold leading-tight mb-6">Recent Badges</h3>
                <div className="grid grid-cols-3 gap-5">
                  {dashboardData.badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center p-4 aspect-square rounded-2xl transition-all ${
                        badge.unlocked
                          ? 'bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30'
                          : 'bg-gray-100 border border-gray-200 text-gray-400'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-5xl ${
                        badge.unlocked ? 'text-yellow-500 drop-shadow-sm' : 'text-gray-300'
                      }`}>
                        {badge.icon}
                      </span>
                      <p className="text-xs text-center mt-2 font-semibold text-text-sub">{badge.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
