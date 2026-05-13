

export default function StatCard({ label, value, type }) {
  const getStyles = () => {
    switch(type) {
      case 'income':
        return 'bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700 border-l-4 border-emerald-500';
      case 'expense':
        return 'bg-gradient-to-br from-red-50 to-orange-50 text-red-700 border-l-4 border-red-500';
      case 'balance':
        return value >= 0
          ? 'bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-700 border-l-4 border-indigo-500'
          : 'bg-gradient-to-br from-orange-50 to-red-50 text-orange-700 border-l-4 border-orange-500';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'income':
        return '📈';
      case 'expense':
        return '📉';
      case 'balance':
        return value >= 0 ? '💰' : '⚠️';
      default:
        return '💵';
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-sm border border-opacity-20 border-current ${getStyles()} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-tight">
            {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
          </p>
        </div>
        <span className="text-3xl">{getIcon()}</span>
      </div>
    </div>
  );
}