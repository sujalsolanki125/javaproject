export default function AnalyticsCard({ title, value, unit, change, trend, comparison }) {
  const getTrendIcon = () => {
    if (trend === 'up') return 'trending_up';
    if (trend === 'down') return 'trending_down';
    return 'horizontal_rule';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-100 bg-card-light hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(13,242,108,0.1)] transition-all shadow-sm">
      <p className="text-text-sub text-base font-medium leading-normal">{title}</p>
      <p className="text-text-main tracking-light text-3xl font-bold leading-tight">
        {value} <span className="text-xl font-medium text-text-sub">{unit}</span>
      </p>
      <div className="flex items-center mt-1">
        <span className={`material-symbols-outlined ${getTrendColor()} text-lg mr-1`}>
          {getTrendIcon()}
        </span>
        <p className={`${getTrendColor()} text-sm font-medium leading-normal`}>
          {change} {comparison}
        </p>
      </div>
    </div>
  );
}
