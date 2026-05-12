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

  if (loading) return <div className="p-8 text-slate-400">Loading dashboard…</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Income"   value={totalIncome}  type="income"  />
        <StatCard label="Total Expenses" value={totalExpense} type="expense" />
        <StatCard label="Net Balance"    value={netBalance}   type="balance" />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Income"  fill="#10b981" radius={[6,6,0,0]} />
              <Bar dataKey="Expense" fill="#ef4444" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Expense Distribution</h2>
          {pieData.length === 0
            ? <p className="text-slate-400 text-sm">No expenses this month.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </div>

      {/* ── Budget Progress ── */}
      {budgetProgress.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Budget Progress</h2>
          <div className="space-y-3">
            {budgetProgress.map(b => <BudgetProgressBar key={b.budget_id} budget={b} />)}
          </div>
        </div>
      )}

      {/* ── Recent Transactions ── */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-slate-500 uppercase mb-4">Recent Transactions</h2>
        <RecentTransactions transactions={recent} />
      </div>
    </div>
  );
}