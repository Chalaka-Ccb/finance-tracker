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
      {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="number" placeholder="Amount" required step="0.01"
          value={form.amount}
          onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="number" placeholder="Category ID" required
          value={form.category_id}
          onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input type="date" required
          value={form.date}
          onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>

      <input type="text" placeholder="Description"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />

      <button type="submit" disabled={loading}
        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors">
        {loading ? 'Adding…' : 'Add Transaction'}
      </button>
    </form>
  );
}
