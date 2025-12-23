import { useState } from 'react';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for critical alerts
  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Emissions Detected',
      description: 'Transportation category exceeded threshold by 15% this week.',
      time: '2 minutes ago',
      icon: 'warning'
    },
    {
      id: 2,
      type: 'error',
      title: 'Data Anomaly Found',
      description: "Unusual energy consumption pattern detected in the 'Office' sector.",
      time: '1 hour ago',
      icon: 'error'
    }
  ]);

  // Mock data for general notifications
  const [notifications] = useState([
    {
      id: 1,
      type: 'badge',
      title: 'New Badge Unlocked!',
      description: "You earned the 'Energy Saver' badge.",
      time: '2h ago',
      icon: 'workspace_premium',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
      iconColor: 'text-green-600 dark:text-green-400',
      isNew: true
    },
    {
      id: 2,
      type: 'goal',
      title: 'Weekly Goal Achieved',
      description: "Congratulations! You've met your emission reduction goal for the week.",
      time: '1d ago',
      icon: 'flag',
      bgColor: 'bg-blue-100 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      isNew: true
    },
    {
      id: 3,
      type: 'marketplace',
      title: 'Purchase Confirmed',
      description: 'Your purchase receipt for Carbon Offsets is ready.',
      time: '3d ago',
      icon: 'receipt_long',
      bgColor: 'bg-purple-100 dark:bg-purple-900/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
      isNew: false
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update Scheduled',
      description: 'A system update is scheduled for this Sunday at 2 AM.',
      time: '5d ago',
      icon: 'update',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-300',
      isNew: false
    }
  ]);

  const dismissCriticalAlert = (id) => {
    setCriticalAlerts(criticalAlerts.filter(alert => alert.id !== id));
  };

  const clearAllAlerts = () => {
    setCriticalAlerts([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    return notif.type === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'goal', label: 'Goals' },
    { id: 'badge', label: 'Badges' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'system', label: 'System' }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-10 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 bg-white px-10 py-3 dark:border-b-gray-700 dark:bg-background-dark">
          <div className="flex items-center gap-4 text-[#111618] dark:text-white">
            <div className="h-6 w-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#111618] dark:text-white">
              Carbon Footprint Tracker
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllAlerts}
                className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold leading-normal tracking-[0.015em] text-white"
              >
                <span className="truncate">Clear All</span>
              </button>
              <button className="flex h-10 max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 px-3 text-sm font-bold leading-normal tracking-[0.015em] text-gray-800 dark:bg-white/10 dark:text-white">
                <span className="material-symbols-outlined text-xl">tune</span>
                <span>Filter</span>
              </button>
            </div>
            <div
              className="aspect-square h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDztI7sGaEPKWnWweS-c3AU_xK7A6M8lbYfZra5VO1J6AV7KmOzvz4GWx-2MJmqUwviKK3CY5jx2VO6TH3eDuTiabJ8iPtfUvBYiQ0Xq6-KoCIIQyibiiaR7mjAp2dzbrnxDbccw8ySUYM8yKvfRhyNMLH2U8Os3uBPhVC349JDQjNJJfxLmk1nEK47xmFPI4wtWIMTZEzMT51OUQORyhpvEfT0Z86jW28fKmNu7vrrr1CeZMJE76devUykQiq7ZTCpUekGvtVgeNY")'
              }}
            ></div>
          </div>
        </header>

        <main className="flex flex-1 justify-center px-4 py-5 sm:px-6 lg:px-10">
          <div className="layout-content-container flex max-w-4xl flex-1 flex-col">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="min-w-72 text-4xl font-black leading-tight tracking-[-0.033em] text-[#111618] dark:text-white">
                Alerts &amp; Notifications
              </p>
            </div>

            {/* Critical Alerts Section */}
            {criticalAlerts.length > 0 && (
              <section className="flex flex-col gap-4 px-4 py-5">
                <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-rose-600 dark:text-rose-400">
                  Critical Alerts
                </h2>
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-rose-500/50 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] dark:border-rose-400/30 dark:bg-background-dark"
                  >
                    <div className="flex flex-1 items-start gap-4">
                      <span className="material-symbols-outlined mt-1 text-2xl !font-light text-rose-500 dark:text-rose-400">
                        {alert.icon}
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-normal leading-normal text-[#60808a] dark:text-gray-400">
                          {alert.time}
                        </p>
                        <p className="text-base font-bold leading-tight text-[#111618] dark:text-white">
                          {alert.title}
                        </p>
                        <p className="text-sm font-normal leading-normal text-[#60808a] dark:text-gray-400">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex h-8 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-lg bg-gray-100 px-3 text-sm font-medium leading-normal text-[#111618] hover:bg-gray-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                        <span className="truncate">View Details</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </button>
                      <button
                        onClick={() => dismissCriticalAlert(alert.id)}
                        className="flex h-8 w-8 max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                      >
                        <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* General Notifications Section */}
            <section className="flex flex-col gap-4 px-4 py-5">
              <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#111618] dark:text-white">
                General Notifications
              </h2>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav aria-label="Tabs" className="-mb-px flex space-x-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Notification List */}
              <div className="flex flex-col gap-2">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex cursor-pointer items-center gap-4 rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-gray-50 dark:bg-background-dark dark:hover:bg-white/5"
                  >
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${notif.bgColor}`}
                    >
                      <span className={`material-symbols-outlined text-xl ${notif.iconColor}`}>
                        {notif.icon}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#111618] dark:text-white">
                        {notif.title}
                      </p>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {notif.description}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span className="whitespace-nowrap">{notif.time}</span>
                      {notif.isNew && <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
