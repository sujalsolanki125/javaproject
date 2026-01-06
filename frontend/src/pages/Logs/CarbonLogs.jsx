import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/layout/Sidebar';
import CalendarMonth from '../../components/ui/CalendarMonth';
import EmissionsTrendChart from '../../components/charts/EmissionsTrendChart';
import { carbonService } from '../../services/carbon.service';

export default function CarbonLogs() {
  const navigate = useNavigate();
  const [monthDate, setMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('card');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trendData, setTrendData] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    category: 'transportation',
    activity: '',
    amount: '',
    description: '',
    logDate: new Date().toISOString().slice(0, 10)
  });

  const formatKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await carbonService.getLogs();
      const normalized = (data || []).map((log) => ({
        ...log,
        logDate: log.logDate || (log.createdAt ? log.createdAt.split('T')[0] : null)
      }));
      const sorted = normalized.sort((a, b) => new Date(b.logDate || b.createdAt) - new Date(a.logDate || a.createdAt));
      setLogs(sorted);
    } catch (err) {
      console.error('Failed to load carbon logs', err);
      setError('Could not load your carbon logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadTrend = async () => {
    try {
      const data = await carbonService.getTrendData(30);
      setTrendData(data || {});
    } catch (err) {
      console.error('Failed to load trend data', err);
      setTrendData({});
    }
  };

  useEffect(() => {
    loadLogs();
    loadTrend();
  }, []);

  const logsThisMonth = useMemo(() => {
    return logs.filter((log) => {
      if (!log.logDate) return false;
      const date = new Date(log.logDate);
      return (
        date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear()
      );
    });
  }, [logs, monthDate]);

  const highlightMap = useMemo(() => {
    return logsThisMonth.reduce((acc, log) => {
      const key = formatKey(log.logDate);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [logsThisMonth]);

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return logs
      .filter((log) => {
        if (!log.logDate) return false;
        
        // If a specific date is selected, filter by that exact date
        if (selectedDate) {
          const selectedKey = formatKey(selectedDate);
          const logKey = formatKey(log.logDate);
          if (logKey !== selectedKey) return false;
        } else {
          // Otherwise, filter by month
          const date = new Date(log.logDate);
          const sameMonth =
            date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
          if (!sameMonth) return false;
        }
        
        // Apply search query filter
        if (query) {
          return (
            log.activity?.toLowerCase().includes(query) ||
            log.category?.toLowerCase().includes(query) ||
            log.description?.toLowerCase().includes(query) ||
            formatKey(log.logDate).includes(query)
          );
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.logDate) - new Date(a.logDate));
  }, [logs, searchQuery, monthDate, selectedDate]);

  const handleMonthChange = (delta) => {
    setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddLog = () => {
    setEditingLog(null);
    setFormData({
      category: 'transportation',
      activity: '',
      amount: '',
      description: '',
      logDate: formatKey(selectedDate)
    });
    setShowEditor(true);
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      category: log.category || 'transportation',
      activity: log.activity || '',
      amount: log.amount ?? '',
      description: log.description || '',
      logDate: log.logDate || formatKey(new Date())
    });
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this log?')) return;
    try {
      await carbonService.deleteLog(id);
      await loadLogs();
    } catch (err) {
      console.error('Failed to delete log', err);
      setError('Could not delete log. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        category: formData.category,
        activity: formData.activity,
        amount: formData.amount ? Number(formData.amount) : null,
        logDate: formData.logDate,
        description: formData.description
      };

      if (editingLog) {
        await carbonService.updateLog(editingLog.id, payload);
      } else {
        await carbonService.createLog(payload);
      }

      setShowEditor(false);
      setEditingLog(null);
      await loadLogs();
    } catch (err) {
      console.error('Failed to save log', err);
      setError('Could not save log. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center px-4 py-5 sm:px-8 md:px-16 lg:px-24 xl:px-40">
            <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">
              {/* Top Nav Bar */}
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-background-light px-6 py-3 dark:border-slate-700 dark:bg-background-dark sm:px-10">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-6 text-primary">
                    <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] dark:text-white">
                    Logs History Page
                  </h2>
                </div>
                <button
                  onClick={() => navigate('/survey')}
                  className="flex h-10 min-w-[140px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary/80 px-5 py-2 text-sm font-bold leading-normal tracking-[0.015em] text-white shadow-lg hover:shadow-primary/50 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 transform hover:scale-105"
                  title="Complete the 5-step onboarding survey to track your carbon footprint"
                >
                  <span className="material-symbols-outlined !text-xl">quiz</span>
                  <span className="truncate">Onboarding Survey</span>
                </button>
              </header>

            <main className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
              {/* Page Heading */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-4xl font-black leading-tight tracking-[-0.033em] dark:text-white">
                    Carbon Emission Logs
                  </p>
                  {selectedDate && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Viewing logs for: <span className="font-semibold text-primary">{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </p>
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="flex items-center gap-1 rounded-lg bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined !text-sm">close</span>
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Click a date in the calendar to view logs for that day.
                </p>
              </div>

              {/* Main Content: Calendar, Chart and Logs */}
              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Left Column: Calendar & Chart */}
                <div className="flex w-full flex-col gap-8 lg:w-1/3 lg:max-w-xs">
                  <CalendarMonth
                    monthDate={monthDate}
                    selectedDate={selectedDate}
                    onMonthChange={handleMonthChange}
                    onSelectDate={handleDateSelect}
                    highlights={highlightMap}
                  />

                  <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-background-dark/50">
                    <p className="text-base font-medium leading-normal dark:text-white">
                      Emissions: Last 30 Days
                    </p>
                    <div className="h-48 w-full">
                      {Object.keys(trendData).length ? (
                        <EmissionsTrendChart trendData={trendData} timeRange="month" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-500 dark:text-slate-400">
                          No data yet. Complete onboarding or add a log.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Toolbar & Logs List */}
                <div className="flex flex-1 flex-col gap-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-background-dark/50">
                    <div className="flex min-w-[200px] flex-1 items-center gap-2">
                      <div className="relative w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          search
                        </span>
                        <input
                          className="h-10 w-full rounded-lg border-slate-300 bg-background-light pl-10 pr-4 focus:border-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
                          placeholder="Search logs..."
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-700" title="Filters coming soon">
                        <span className="material-symbols-outlined">filter_list</span>
                      </button>
                      <button
                        onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
                        className="flex h-10 min-w-0 max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary/20 px-4 text-sm font-bold leading-normal tracking-[0.015em] text-primary hover:bg-primary/30 dark:bg-primary/30 dark:text-primary dark:hover:bg-primary/40"
                      >
                        <span className="material-symbols-outlined !text-xl">grid_view</span>
                        <span className="truncate">{viewMode === 'card' ? 'Card View' : 'List View'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Emission Logs List */}
                  <div className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    {loading ? (
                      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-background-dark/50">
                        Loading your logs...
                      </div>
                    ) : filteredLogs.length ? (
                      filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary/50 hover:shadow-md dark:border-slate-700 dark:bg-background-dark/50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(log.logDate).toLocaleDateString()}
                              </p>
                              <p className="text-2xl font-bold dark:text-white">
                                {log.carbonEmission?.toFixed(2) || '0.00'} kg{' '}
                                <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                                  CO₂e
                                </span>
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-300">
                                {log.activity}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{log.category}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(log)}
                                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="Edit log"
                              >
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(log.id)}
                                className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                                title="Delete log"
                              >
                                <span className="material-symbols-outlined">delete</span>
                              </button>
                            </div>
                          </div>
                          {log.description && (
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{log.description}</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="mt-4 rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-600 dark:bg-background-dark/50">
                        <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                          calendar_month
                        </span>
                        <p className="mt-4 text-xl font-bold dark:text-white">
                          {selectedDate ? 'No logs on this date' : 'No logs this month'}
                        </p>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                          {selectedDate 
                            ? 'No carbon logs recorded for this date. Complete the onboarding survey to get started and track your carbon footprint.'
                            : 'No logs recorded this month. Complete the onboarding survey to track your carbon footprint.'
                          }
                        </p>
                        <button
                          onClick={() => navigate('/survey')}
                          className="mx-auto mt-6 flex h-10 items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-5 text-sm font-bold leading-normal tracking-[0.015em] text-slate-900 hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined !text-xl">quiz</span>
                          <span className="truncate">Complete Survey Now</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingLog ? 'Edit Carbon Log' : 'Add Carbon Log'}
              </h3>
              <button
                onClick={() => setShowEditor(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Date
                <input
                  type="date"
                  value={formData.logDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, logDate: e.target.value }))}
                  className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="transportation">Transportation</option>
                  <option value="food">Food</option>
                  <option value="energy">Energy</option>
                  <option value="waste">Waste</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Activity
                <input
                  type="text"
                  value={formData.activity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, activity: e.target.value }))}
                  placeholder="e.g., Daily commute, groceries"
                  className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Amount (unit depends on activity)
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  required
                />
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                Description (optional)
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Add notes about this activity"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="h-10 rounded-lg px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-primary px-4 text-sm font-bold text-slate-900"
                >
                  {editingLog ? 'Update Log' : 'Create Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
