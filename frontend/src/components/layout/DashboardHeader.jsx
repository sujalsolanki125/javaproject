export default function DashboardHeader({ title = 'Analytics Dashboard' }) {
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
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary shadow-sm"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCLZgR817uN6kdLu2AU9JoZnujC6JSsQs8ymZFQs2uclvN7WXQNafwdWXIkhahdF3LCz3WbiIxL1Rn5rLDCAq_RSHZ2UVLsAeH-A9j9Ln59UMH3sP0W2oFhZg6uatjXTw6KTVZXxwrWp1AF5ALdbcQCMZfS5J33Dz4x6u3YDII1rsEtr3b2WFb75uCsOE-qqlU5IxciIZvzbbJMAR9RIsLgICW2nXQf4upGo7blR8QzKUcF_FjqP5Qly2cIWFjkSuuKpgvyJ6wqUrk")'
          }}
        />
      </div>
    </header>
  );
}
