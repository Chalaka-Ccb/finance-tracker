
// function to display a progress bar for a budget category, showing how much has been spent vs the total budget amount.
export default function BudgetProgressBar({ budget }) {
  const pct      = Math.min(Number(budget.progress_pct) || 0, 100);
  const isOver   = Number(budget.progress_pct) > 100;
  const barColor = isOver ? 'bg-gradient-to-r from-red-500 to-red-600' : pct > 75 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600';
  const statusColor = isOver ? 'text-red-600' : pct > 75 ? 'text-amber-600' : 'text-slate-600';

  return (
    <div className="group">
      <div className="flex items-end justify-between gap-3 mb-2">
        <div>
          <h3 className="font-semibold text-slate-900">{budget.category_name}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {pct.toFixed(0)}% of budget used
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-bold ${statusColor}`}>
            ${Number(budget.spent_amount).toFixed(2)}
          </p>
          <p className="text-xs text-slate-500">
            of ${Number(budget.budget_amount).toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Warning */}
      {isOver && (
        <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
          ⚠️ Over budget by ${(Number(budget.spent_amount) - Number(budget.budget_amount)).toFixed(2)}
        </p>
      )}
    </div>
  );
}