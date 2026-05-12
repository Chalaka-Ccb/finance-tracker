
// function to display a progress bar for a budget category, showing how much has been spent vs the total budget amount.
export default function BudgetProgressBar({ budget }) {
  const pct      = Math.min(Number(budget.progress_pct) || 0, 100);
  const isOver   = Number(budget.progress_pct) > 100;
  const barColor = isOver ? 'bg-red-500' : pct > 75 ? 'bg-amber-400' : 'bg-indigo-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-slate-700">{budget.category_name}</span>
        <span className={isOver ? 'text-red-600 font-semibold' : 'text-slate-500'}>
          ${Number(budget.spent_amount).toFixed(2)} / ${Number(budget.budget_amount).toFixed(2)}
          {isOver && ' ⚠ Over budget!'}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}