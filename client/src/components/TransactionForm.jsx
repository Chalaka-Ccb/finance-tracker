import { useState } from 'react';
import { transactionsApi } from '../services/api';

// Component that provides a form for users to add new transactions (income or expense).
export default function TransactionForm({ onTransactionAdded }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission for adding a new transaction. It calls the transaction API, resets the form on success, and handles errors.
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await transactionsApi.create(form);
      setForm({
        type: 'expense',
        amount: '',
        category_id: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Transaction Type</label>
          <select value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Amount</label>
          <input type="number" placeholder="0.00" required step="0.01"
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Category ID</label>
          <input type="number" placeholder="Enter category ID" required
            value={form.category_id}
            onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Date</label>
          <input type="date" required
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
        <input type="text" placeholder="e.g., Grocery shopping"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg px-4 py-2.5 font-semibold text-sm hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
        {loading ? '✓ Adding…' : '+ Add Transaction'}
      </button>
    </form>
  );
}
