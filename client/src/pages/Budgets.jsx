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

  if (loading) return (
    <div className="p-8">
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Loading budgets…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Budgets</h1>
          <p className="text-slate-500 text-sm mt-1">Set and track your spending limits</p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Add Budget Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Budget</h2>
          <form onSubmit={handleAddBudget} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Category ID</label>
                <input type="number" placeholder="Enter category ID" required
                  value={form.category_id}
                  onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Budget Limit</label>
                <input type="number" placeholder="0.00" required step="0.01"
                  value={form.limit}
                  onChange={e => setForm(f => ({ ...f, limit: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Period</label>
                <select value={form.period}
                  onChange={e => setForm(f => ({ ...f, period: e.target.value }))}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <button type="submit"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg px-6 py-2 font-semibold text-sm hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
              Add Budget
            </button>
          </form>
        </div>

        {/* Budgets List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Budgets</h2>
          {budgets.length === 0
            ? (
              <div className="text-center py-12">
                <p className="text-slate-400">🎯 No budgets yet. Create one to get started!</p>
              </div>
            )
            : (
              <div className="space-y-6">
                {budgets.map(budget => <BudgetProgressBar key={budget.budget_id} budget={budget} />)}
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
