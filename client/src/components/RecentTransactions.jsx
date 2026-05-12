
// Function to display a list of recent transactions, showing the title, category, date, and amount for each transaction. If there are no transactions, it shows a message indicating that.
export default function RecentTransactions({ transactions }) {
  if (!transactions.length) return <p className="text-slate-400 text-sm">No transactions yet.</p>;

  return (
    <ul className="divide-y divide-slate-100">
      {transactions.map(t => (
        <li key={t.id} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-800">{t.title}</p>
            <p className="text-xs text-slate-400">{t.categories?.name} · {t.date}</p>
          </div>
          <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
            {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
}