import { useState, useEffect, useMemo, useCallback } from 'react';
import { leaderboardService } from '../../services/leaderboard.service';
import { userService } from '../../services/user.service';
import { goalService } from '../../services/goal.service';
import { Sidebar } from '../../components/layout/Sidebar';

const categoryConfig = {
  TRANSPORT: {
    label: 'Transport',
    accent: 'text-sky-500',
    chip: 'bg-sky-50 text-sky-600',
    bar: 'bg-sky-400',
    unit: 'km reduced'
  },
  ENERGY: {
    label: 'Energy',
    accent: 'text-amber-500',
    chip: 'bg-amber-50 text-amber-600',
    bar: 'bg-amber-400',
    unit: 'kWh saved'
  },
  FOOD: {
    label: 'Food Choices',
    accent: 'text-emerald-500',
    chip: 'bg-emerald-50 text-emerald-600',
    bar: 'bg-emerald-400',
    unit: 'days completed'
  },
  LIFESTYLE: {
    label: 'Lifestyle',
    accent: 'text-purple-500',
    chip: 'bg-purple-50 text-purple-600',
    bar: 'bg-purple-400',
    unit: 'actions logged'
  }
};

const initialFormState = {
  title: '',
  description: '',
  category: 'LIFESTYLE',
  targetValue: '',
  targetDate: ''
};

const normalizeCategory = (value) => (value ? value.toUpperCase() : 'LIFESTYLE');

const getCategoryMeta = (value) => categoryConfig[normalizeCategory(value)] ?? categoryConfig.LIFESTYLE;

const formatNumber = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '0';
  return numeric.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

const daysUntil = (dateString) => {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return null;
  const diff = Math.ceil((target - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

export default function GoalsPage() {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [userProfile, setUserProfile] = useState({ profilePicture: null, fullName: '' });
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [goalsError, setGoalsError] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [savingGoal, setSavingGoal] = useState(false);
  const [progressDrafts, setProgressDrafts] = useState({});
  const [savingProgressId, setSavingProgressId] = useState(null);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  const loadGoals = useCallback(async () => {
    setGoalsLoading(true);
    setGoalsError('');
    try {
      const data = await goalService.getGoals();
      setGoals(data);
      setProgressDrafts(
        data.reduce((acc, goal) => {
          acc[goal.id] = goal.currentValue ?? 0;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error('Failed to load goals:', error);
      setGoalsError('Unable to load your goals. Please try again.');
    } finally {
      setGoalsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

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
        console.error('Failed to load leaderboard:', error);
        setLeaderboardData([]);
      }
    };

    loadData();
  }, []);

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status !== 'COMPLETED'), [goals]);
  const completedGoals = useMemo(() => goals.filter((goal) => goal.status === 'COMPLETED'), [goals]);
  const goalsGridCols = useMemo(() => (goals.length > 1 ? 'lg:grid-cols-2' : ''), [goals.length]);

  const heroMetrics = useMemo(() => {
    const completionRate = goals.length ? Math.round((completedGoals.length / goals.length) * 100) : 0;
    const totalImpact = goals.reduce((sum, goal) => sum + (goal.currentValue || 0), 0);
    const nextDeadline = goals
      .filter((goal) => goal.targetDate)
      .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))[0];

    return {
      completionRate,
      totalImpact: formatNumber(totalImpact),
      nextDeadlineLabel: nextDeadline ? new Date(nextDeadline.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No deadlines',
      nextDeadlineTitle: nextDeadline?.title ?? 'Set a target date to stay focused'
    };
  }, [goals, completedGoals]);

  const dynamicBadges = useMemo(() => {
    const completedCount = completedGoals.length;
    const impactThreshold = goals.some((goal) => (goal.currentValue || 0) >= (goal.targetValue || 0));
    const activeStreak = activeGoals.length >= 3;

    return [
      {
        id: 1,
        icon: 'emoji_events',
        title: 'Goal Crusher',
        description: 'Complete at least one goal',
        unlocked: completedCount > 0,
        color: 'text-amber-400'
      },
      {
        id: 2,
        icon: 'bolt',
        title: 'Energy Saver',
        description: 'Hit 100% of any target',
        unlocked: impactThreshold,
        color: 'text-emerald-400'
      },
      {
        id: 3,
        icon: 'timeline',
        title: 'Momentum Builder',
        description: 'Track 3+ active goals',
        unlocked: activeStreak,
        color: 'text-sky-400'
      },
      {
        id: 4,
        icon: 'public',
        title: 'Planet Hero',
        description: 'Complete five goals',
        unlocked: completedCount >= 5,
        color: 'text-purple-400'
      }
    ];
  }, [goals, activeGoals, completedGoals]);

  const handleProgressDraftChange = (goalId, value) => {
    setProgressDrafts((prev) => ({ ...prev, [goalId]: value }));
  };

  const handleProgressSave = async (goalId) => {
    const goal = goals.find((item) => item.id === goalId);
    if (!goal) return;

    const numericValue = Math.max(0, Number(progressDrafts[goalId] ?? goal.currentValue ?? 0));
    if (!Number.isFinite(numericValue)) return;

    const status = numericValue >= (goal.targetValue || 0) && goal.targetValue ? 'COMPLETED' : 'ACTIVE';

    setSavingProgressId(goalId);
    setGoalsError('');
    try {
      await goalService.updateGoal(goalId, {
        title: goal.title,
        description: goal.description,
        targetValue: goal.targetValue,
        currentValue: numericValue,
        status
      });
      await loadGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
      setGoalsError('Unable to update progress. Please try again.');
    } finally {
      setSavingProgressId(null);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    setDeletingGoalId(goalId);
    setGoalsError('');
    try {
      await goalService.deleteGoal(goalId);
      await loadGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
      setGoalsError('Unable to delete goal. Please try again.');
    } finally {
      setDeletingGoalId(null);
    }
  };

  const handleModalClose = () => {
    setShowAddGoal(false);
    setFormData(initialFormState);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGoal = async (event) => {
    event.preventDefault();
    setSavingGoal(true);
    setGoalsError('');

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        targetValue: Number(formData.targetValue) || 0,
        targetDate: formData.targetDate || null,
        status: 'ACTIVE'
      };

      await goalService.createGoal(payload);
      handleModalClose();
      await loadGoals();
    } catch (error) {
      console.error('Failed to create goal:', error);
      setGoalsError('Unable to create goal. Please check your input.');
    } finally {
      setSavingGoal(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full max-w-6xl flex-1 flex-col px-4 md:px-10">
                {/* Page Title */}
                <div className="mb-8 flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-5 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-[0_8px_24px_rgba(13,242,89,0.2)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 backdrop-blur">
                    <svg className="h-7 w-7 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17 3H7a1 1 0 0 0-1 1v3a4 4 0 0 0 3.25 3.92A5 5 0 0 0 11 14.9V17H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.1a5 5 0 0 0 1.75-3.98A4 4 0 0 0 18 7V4a1 1 0 0 0-1-1Zm-9 4V5h8v2a2 2 0 0 1-2 2h-1V7a1 1 0 1 0-2 0v2h-1a2 2 0 0 1-2-2Z" />
                      <path d="M6 6H4a1 1 0 1 0 0 2h1.05A4.01 4.01 0 0 0 9 10.92 3.99 3.99 0 0 1 6 7V6Z" />
                      <path d="M18 6h2a1 1 0 1 1 0 2h-1.05A4.01 4.01 0 0 1 15 10.92 3.99 3.99 0 0 0 18 7V6Z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                      Goals and Gamification
                    </h1>
                    <p className="mt-1 text-sm font-medium text-primary">
                      Track your progress, earn achievements, climb the leaderboard
                    </p>
                  </div>
                </div>

            {/* Main Content */}
            <main className="flex-1 space-y-10 pb-12">
              {/* Hero Section */}
              <section>
                <div className="rounded-3xl border border-border-light bg-white/95 p-6 shadow-sm backdrop-blur transition hover:shadow-[0_12px_30px_rgba(13,242,108,0.15)] dark:border-border-dark dark:bg-card-dark">
                  <div className="grid gap-6 lg:grid-cols-[2fr_1.6fr_1.2fr]">
                    <div className="space-y-3">
                      <p className="text-4xl font-black leading-tight tracking-[-0.033em] text-text-main">
                        Your Sustainability Journey
                      </p>
                      <p className="text-base text-text-muted-light">
                        Track live goals, celebrate milestones, and keep building climate-positive habits.
                      </p>
                      <div className="flex flex-wrap gap-3 text-xs font-semibold text-text-muted-light">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                          <span className="material-symbols-outlined text-base">schedule</span>
                          Weekly check-ins
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-600">
                          <span className="material-symbols-outlined text-base">auto_graph</span>
                          Momentum streaks
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border-light/80 bg-white p-4 text-sm shadow-sm">
                        <p className="text-text-muted-light">Completion rate</p>
                        <p className="mt-2 text-3xl font-bold text-primary">{heroMetrics.completionRate}%</p>
                      </div>
                      <div className="rounded-2xl border border-border-light/80 bg-gradient-to-br from-primary/10 via-emerald-50 to-sky-50 p-4 text-sm shadow-sm">
                        <p className="text-text-muted-light">Total impact logged</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-600">{heroMetrics.totalImpact} units</p>
                      </div>
                      <div className="rounded-2xl border border-border-light/80 bg-white p-4 text-sm shadow-sm">
                        <p className="text-text-muted-light">Next deadline</p>
                        <p className="mt-2 text-lg font-semibold text-text-main">{heroMetrics.nextDeadlineLabel}</p>
                        <p className="text-xs text-text-muted-light">{heroMetrics.nextDeadlineTitle}</p>
                      </div>
                      <div className="rounded-2xl border border-border-light/80 bg-white p-4 text-sm shadow-sm">
                        <p className="text-text-muted-light">Goals completed</p>
                        <p className="mt-2 text-3xl font-bold text-emerald-500">{completedGoals.length}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-text-muted-light">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Action plan</p>
                        <p className="mt-1 text-base font-semibold text-text-main">Finish the week with intent</p>
                        <p className="mt-1">Pick one transport and one lifestyle habit to update before Sunday night.</p>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold shadow-sm">
                        <span className="text-text-muted-light">Current streak</span>
                        <span className="text-lg text-primary">{activeGoals.length} goals</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold shadow-sm">
                        <span className="text-text-muted-light">Next milestone</span>
                        <span className="text-lg text-emerald-600">Goal Crusher</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 px-4 text-sm md:grid-cols-3">
                  <div className="flex gap-3 rounded-2xl border border-border-light bg-white/90 p-4 shadow-sm transition hover:shadow-[0_8px_22px_rgba(13,242,108,0.18)]">
                    <span className="material-symbols-outlined text-2xl text-primary">check_circle</span>
                    <div>
                      <p className="text-base font-semibold text-text-main">Log consistent actions</p>
                      <p className="text-text-muted-light">Update your goals weekly so Momentum Builder unlocks faster.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl border border-border-light bg-white/90 p-4 shadow-sm transition hover:shadow-[0_8px_22px_rgba(13,242,108,0.18)]">
                    <span className="material-symbols-outlined text-2xl text-emerald-500">emoji_events</span>
                    <div>
                      <p className="text-base font-semibold text-text-main">Finish what you start</p>
                      <p className="text-text-muted-light">Complete any goal to earn Goal Crusher and boost your leaderboard rank.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-2xl border border-border-light bg-white/90 p-4 shadow-sm transition hover:shadow-[0_8px_22px_rgba(13,242,108,0.18)]">
                    <span className="material-symbols-outlined text-2xl text-sky-500">bolt</span>
                    <div>
                      <p className="text-base font-semibold text-text-main">Hit targeted milestones</p>
                      <p className="text-text-muted-light">Reach 100% of any target to unlock Energy Saver and inspire your team.</p>
                    </div>
                  </div>
                </div>
                {goalsError && (
                  <div className="mx-4 mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {goalsError}
                  </div>
                )}
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
                <div className="grid items-stretch gap-8 px-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
                  <div className={`grid grid-cols-1 gap-6 ${goalsGridCols}`}>
                    {goalsLoading ? (
                      [...Array(2)].map((_, index) => (
                        <div
                          key={index}
                          className="h-48 animate-pulse rounded-2xl border border-border-light bg-card-light/60 p-6 dark:border-border-dark"
                        >
                          <div className="mb-6 h-4 w-1/2 rounded bg-gray-200" />
                          <div className="mb-3 h-3 rounded bg-gray-100" />
                          <div className="mb-3 h-3 rounded bg-gray-100" />
                          <div className="h-10 rounded bg-gray-100" />
                        </div>
                      ))
                    ) : goals.length ? (
                      goals.map((goal) => {
                        const meta = getCategoryMeta(goal.category);
                        const progress = goal.targetValue
                          ? Math.min(100, Math.round(((goal.currentValue || 0) / goal.targetValue) * 100))
                          : 0;
                        const dueIn = daysUntil(goal.targetDate);
                        const isCompleted = goal.status === 'COMPLETED';

                        return (
                          <div
                            key={goal.id}
                            className="flex flex-col gap-4 rounded-2xl border border-border-light bg-card-light p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(13,242,108,0.18)] dark:border-border-dark dark:bg-card-dark"
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div>
                                <p className={`text-xs font-semibold uppercase tracking-wide ${meta.accent}`}>{meta.label}</p>
                                <h3 className="mt-1 text-xl font-semibold">{goal.title}</h3>
                                {goal.description && (
                                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{goal.description}</p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2 text-right">
                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'}`}>
                                  {isCompleted ? 'Completed' : 'In progress'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                  className="text-sm text-text-muted-light transition hover:text-red-500"
                                  disabled={deletingGoalId === goal.id}
                                >
                                  {deletingGoalId === goal.id ? 'Deleting...' : 'Remove'}
                                </button>
                              </div>
                            </div>
                            <div className="rounded-full bg-background-light dark:bg-background-dark">
                              <div
                                className={`h-2 rounded-full ${meta.bar}`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-text-muted-light dark:text-text-muted-dark">
                              <span>
                                {formatNumber(goal.currentValue)} / {formatNumber(goal.targetValue)} {meta.unit}
                              </span>
                              <span>
                                {goal.targetDate && dueIn !== null
                                  ? dueIn > 0
                                    ? `${dueIn} days left`
                                    : 'Target reached'
                                  : 'No deadline'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border-light/80 bg-white/60 p-3 dark:bg-card-dark">
                              <input
                                type="number"
                                min="0"
                                name={`progress-${goal.id}`}
                                className="flex-1 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                                value={progressDrafts[goal.id] ?? goal.currentValue ?? 0}
                                onChange={(event) => handleProgressDraftChange(goal.id, event.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleProgressSave(goal.id)}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-text-light disabled:opacity-50"
                                disabled={savingProgressId === goal.id}
                              >
                                {savingProgressId === goal.id ? 'Saving...' : 'Update progress'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-2xl border border-dashed border-primary/40 bg-white/80 p-8 text-center shadow-sm transition hover:shadow-[0_10px_26px_rgba(13,242,108,0.16)] dark:bg-card-dark">
                        <p className="text-lg font-semibold">No goals yet</p>
                        <p className="mt-2 text-sm text-text-muted-light">
                          Set a measurable goal to start tracking your progress and unlock achievements.
                        </p>
                        <button
                          className="mt-4 rounded-full border border-primary px-6 py-2 text-sm font-semibold text-primary"
                          onClick={() => setShowAddGoal(true)}
                        >
                          Create your first goal
                        </button>
                      </div>
                    )}
                  </div>
                  <aside className="flex h-full flex-col gap-4 rounded-2xl border border-border-light bg-white/80 p-5 shadow-sm transition hover:shadow-[0_14px_30px_rgba(13,242,108,0.2)] dark:border-border-dark dark:bg-card-dark">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">How to unlock badges</p>
                      <ul className="mt-3 space-y-3 text-sm text-text-muted-light">
                        <li>
                          <span className="font-semibold text-text-main">Goal Crusher</span> — close any active goal.
                        </li>
                        <li>
                          <span className="font-semibold text-text-main">Momentum Builder</span> — keep three goals active with weekly updates.
                        </li>
                        <li>
                          <span className="font-semibold text-text-main">Energy Saver</span> — reach 100% on an Energy or Transport goal.
                        </li>
                        <li>
                          <span className="font-semibold text-text-main">Planet Hero</span> — celebrate after completing five goals.
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-emerald-50 to-white p-4 text-sm text-text-muted-light">
                      <p className="text-base font-semibold text-text-main">Quick motivation</p>
                      <p className="mt-2">
                        Batch your updates on Fridays and set small weekend challenges. Small streaks fuel faster badge unlocks.
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs font-semibold">
                        <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                          <p className="text-text-muted-light">Streak</p>
                          <p className="text-lg text-primary">{activeGoals.length}</p>
                        </div>
                        <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                          <p className="text-text-muted-light">Completed</p>
                          <p className="text-lg text-emerald-600">{completedGoals.length}</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </section>

              {/* Achievements & Badges Section */}
              <section className="space-y-6">
                <h2 className="px-4 text-2xl font-bold leading-tight tracking-[-0.015em]">
                  Achievements &amp; Badges
                </h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {dynamicBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-3 rounded-xl border border-border-light bg-card-light p-4 text-center shadow-sm transition hover:shadow-[0_12px_28px_rgba(13,242,108,0.14)] dark:border-border-dark dark:bg-card-dark ${
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
                  <a href="/dashboard" className="text-sm font-bold text-primary">
                    View Full Leaderboard
                  </a>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-white via-emerald-50 to-sky-50 p-6 shadow-xl transition hover:shadow-[0_18px_38px_rgba(13,242,108,0.25)] dark:bg-card-dark">
                  <div className="pointer-events-none absolute -right-6 top-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" aria-hidden="true"></div>
                  <div className="relative flow-root">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-white/70 text-sm text-text-main dark:divide-border-dark">
                        <thead className="bg-white/70 text-xs font-semibold uppercase tracking-wide text-text-muted-light dark:bg-card-dark/70">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-0">Rank</th>
                            <th scope="col" className="px-3 py-3.5 text-left">Username</th>
                            <th scope="col" className="px-3 py-3.5 text-right">CO2 Saved</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/60 dark:divide-border-dark/60">
                          {leaderboardData.length > 0 ? (
                            leaderboardData.map((entry) => {
                              const isCurrentUser = currentUserRank && entry.username === currentUserRank.username;
                              const userInitial = entry.fullName ? entry.fullName.charAt(0).toUpperCase() : 'U';

                              return (
                                <tr
                                  key={entry.rank}
                                  className={`transition hover:bg-white/70 dark:hover:bg-card-dark/60 ${
                                    isCurrentUser ? 'bg-primary/10 ring-1 ring-primary/20' : 'bg-white/40'
                                  }`}
                                >
                                  <td
                                    className={`whitespace-nowrap py-4 pl-4 pr-3 sm:pl-0 ${
                                      isCurrentUser ? 'font-bold text-primary' : 'font-medium'
                                    }`}
                                  >
                                    {entry.rank}
                                  </td>
                                  <td
                                    className={`whitespace-nowrap px-3 py-4 ${
                                      isCurrentUser ? 'font-bold text-primary' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="aspect-square h-9 w-9 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-xs font-bold"
                                        style={{
                                          backgroundImage: entry.profilePicture ? `url(${entry.profilePicture})` : 'none',
                                          backgroundColor: entry.profilePicture ? 'transparent' : '#0DF26C'
                                        }}
                                      >
                                        {!entry.profilePicture && userInitial}
                                      </div>
                                      <div>
                                        <p className="text-sm font-semibold text-text-main">{entry.fullName}</p>
                                        <p className="text-xs text-text-muted-light">{entry.username}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className={`whitespace-nowrap px-3 py-4 text-right ${
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
                              <td colSpan="3" className="py-8 text-center text-sm text-text-muted-light">
                                No leaderboard data available yet. Start logging your carbon emissions!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
      </div>
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-card-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">New Goal</p>
                <h3 className="text-xl font-bold">Add a measurable target</h3>
              </div>
              <button type="button" onClick={handleModalClose} className="text-text-muted-light hover:text-text-main">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form className="space-y-4" onSubmit={handleCreateGoal}>
              <div>
                <label className="text-sm font-medium text-text-muted-light">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="e.g., Bike to work 3x per week"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-text-muted-light">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Add context or a milestone"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-text-muted-light">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="TRANSPORT">Transport</option>
                    <option value="ENERGY">Energy</option>
                    <option value="FOOD">Food</option>
                    <option value="LIFESTYLE">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-muted-light">Target value</label>
                  <input
                    type="number"
                    min="1"
                    name="targetValue"
                    value={formData.targetValue}
                    onChange={handleFormChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-muted-light">Target date</label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleFormChange}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="rounded-lg border border-border-light px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-text-light disabled:opacity-50"
                  disabled={savingGoal}
                >
                  {savingGoal ? 'Saving...' : 'Create goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
