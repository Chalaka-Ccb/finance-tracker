import { useEffect, useState } from 'react';
import { transactionsApi } from '../services/api';
import TransactionForm from '../components/TransactionForm';

// Transactions page component that displays all user transactions with filtering and creation capabilities.
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ type: '', category_id: '' });

  useEffect(() => {
    loadTransactions();
  }, [filter]);

  async function loadTransactions() {
    try {
      setLoading(true);
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.category_id) params.category_id = filter.category_id;
      const data = await transactionsApi.getAll(params);
      setTransactions(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTransactionAdded() {
    await loadTransactions();
  }

  if (loading) return <div className="p-8 text-slate-400">Loading transactions…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      {/* Add Transaction Form */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Add Transaction</h2>
        <TransactionForm onTransactionAdded={handleTransactionAdded} />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select value={filter.type}
            onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" placeholder="Filter by category ID"
            value={filter.category_id}
            onChange={e => setFilter(f => ({ ...f, category_id: e.target.value }))}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">All Transactions</h2>
        {transactions.length === 0
          ? <p className="text-slate-400 text-sm">No transactions found.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Date</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Type</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.transaction_id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-3">{new Date(t.date).toLocaleDateString()}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-2 px-3">{t.categories?.name || 'Uncategorised'}</td>
                      <td className="py-2 px-3 font-semibold">${Number(t.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
