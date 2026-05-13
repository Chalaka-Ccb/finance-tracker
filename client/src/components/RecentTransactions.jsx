
// Function to display a list of recent transactions, showing the title, category, date, and amount for each transaction. If there are no transactions, it shows a message indicating that.
export default function RecentTransactions({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 text-sm">📭 No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map(t => (
        <div key={t.transaction_id || t.id} className="flex items-center justify-between py-4 px-2 hover:bg-slate-50 rounded-lg transition-colors">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
              ${t.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {t.type === 'income' ? '📥' : '📤'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{t.title || t.description || 'Transaction'}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.categories?.name || 'Uncategorized'} • {new Date(t.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`text-sm font-bold whitespace-nowrap ml-4 ${
            t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}