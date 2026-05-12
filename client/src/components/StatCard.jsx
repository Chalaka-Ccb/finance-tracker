

export default function StatCard({ label, value, type }) {
  const colorMap = {
    income:  'bg-emerald-50 text-emerald-700',
    expense: 'bg-red-50 text-red-600',
    balance: value >= 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700',
  };

  return (
    <div className={`rounded-2xl p-5 shadow-sm ${colorMap[type]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-3xl font-bold">
        {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
      </p>
    </div>
  );
}