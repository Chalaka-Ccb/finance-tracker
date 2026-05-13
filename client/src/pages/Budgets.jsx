import { useEffect, useState } from 'react';
import { budgetsApi } from '../services/api';
import BudgetProgressBar from '../components/BudgetProgressBar';

// Budgets page component that displays all user budgets and their progress towards spending limits.
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category_id: '', limit: '', period: 'monthly' });

  useEffect(() => {
    loadBudgets();
  }, []);

  async function loadBudgets() {
    try {
      setLoading(true);
      const data = await budgetsApi.getAll();
      setBudgets(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddBudget(e) {
    e.preventDefault();
    try {
      await budgetsApi.create(form);
      setForm({ category_id: '', limit: '', period: 'monthly' });
      await loadBudgets();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading budgets…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Budgets</h1>

      {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

      {/* Add Budget Form */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Create Budget</h2>
        <form onSubmit={handleAddBudget} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="number" placeholder="Category ID" required
              value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <input type="number" placeholder="Limit" required step="0.01"
              value={form.limit}
              onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <select value={form.period}
              onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button type="submit"
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold text-sm hover:bg-indigo-700 transition-colors">
            Add Budget
          </button>
        </form>
      </div>

      {/* Budgets List */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Your Budgets</h2>
        {budgets.length === 0
          ? <p className="text-slate-400 text-sm">No budgets yet.</p>
          : (
            <div className="space-y-3">
              {budgets.map(budget => <BudgetProgressBar key={budget.budget_id} budget={budget} />)}
            </div>
          )
        }
      </div>
    </div>
  );
}
