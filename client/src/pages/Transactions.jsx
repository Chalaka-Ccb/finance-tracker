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

  if (loading) return (
    <div className="p-8">
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Loading transactions…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">Track all your income and expenses</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Add Transaction Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Transaction</h2>
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Filter Transactions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select value={filter.type}
              onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input type="number" placeholder="Filter by category ID"
              value={filter.category_id}
              onChange={e => setFilter(f => ({ ...f, category_id: e.target.value }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">All Transactions</h2>
          {transactions.length === 0
            ? (
              <div className="text-center py-12">
                <p className="text-slate-400">📭 No transactions found.</p>
              </div>
            )
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-600">Description</th>
                      <th className="text-right py-3 px-4 font-semibold text-slate-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(t => (
                      <tr key={t.transaction_id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-slate-700">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            t.type === 'income' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {t.type === 'income' ? '📥' : '📤'} {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{t.categories?.name || 'Uncategorized'}</td>
                        <td className="py-3 px-4 text-slate-600 text-sm">{t.description || '-'}</td>
                        <td className={`py-3 px-4 font-bold text-right ${
                          t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
