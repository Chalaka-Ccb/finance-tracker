import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { transactionsApi, budgetsApi } from '../services/api';
import StatCard          from '../components/StatCard';
import BudgetProgressBar from '../components/BudgetProgressBar';
import RecentTransactions from '../components/RecentTransactions';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];

// Utility function to get the date range for the current month
function getMonthRange() {
  const now   = new Date();
  const from  = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const to    = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  return { from, to };
}

// Main dashboard component that displays an overview of the user's financial data, including total income, expenses, net balance, charts for income vs expenses and expense distribution, budget progress bars, and recent transactions.
export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgetProgress, setBudgetProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { from, to } = getMonthRange();
      const [txns, budgets] = await Promise.all([
        transactionsApi.getAll({ from, to }),
        budgetsApi.getProgress(),
      ]);
      setTransactions(txns);
      setBudgetProgress(budgets);
      setLoading(false);
    }
    load();
  }, []);

  // Calculate total income, total expenses, and net balance for the current month.
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
  const netBalance   = totalIncome - totalExpense;

  // Expense distribution by category for Pie chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const name = t.categories?.name || 'Uncategorised';
      acc[name] = (acc[name] || 0) + Number(t.amount);
      return acc;
    }, {});
  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

  // Income vs Expense bar data (grouped by week for current month)
  const barData = [
    { label: 'This Month', Income: totalIncome, Expense: totalExpense },
  ];

  const recent = [...transactions].slice(0, 5);

  if (loading) return (
    <div className="p-8">
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium">Loading dashboard…</p>
      </div>
    </div>
  );

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Financial overview for {monthName}</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* ── Key Metrics ── */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard label="Total Income"   value={totalIncome}  type="income"  />
            <StatCard label="Total Expenses" value={totalExpense} type="expense" />
            <StatCard label="Net Balance"    value={netBalance}   type="balance" />
          </div>
        </div>

        {/* ── Analytics ── */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-6">Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <XAxis dataKey="label" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    formatter={(v) => `$${v.toFixed(2)}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Income"  fill="#10b981" radius={[6,6,0,0]} />
                  <Bar dataKey="Expense" fill="#ef4444" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-6">Expense Distribution</h3>
              {pieData.length === 0
                ? <div className="flex items-center justify-center h-64 text-slate-400">
                    <p>No expenses this month.</p>
                  </div>
                : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                )
              }
            </div>
          </div>
        </div>

        {/* ── Budget Progress ── */}
        {budgetProgress.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget Progress</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="space-y-5">
                {budgetProgress.map(b => <BudgetProgressBar key={b.budget_id} budget={b} />)}
              </div>
            </div>
          </div>
        )}

        {/* ── Recent Transactions ── */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <RecentTransactions transactions={recent} />
          </div>
        </div>
      </div>
    </div>
  );
}