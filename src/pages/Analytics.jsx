import React, { useState, useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Award, Clock, Calendar } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { bids, tenders } = useData();
  const [timeRange, setTimeRange] = useState('all');

  const stats = useMemo(() => {
    const totalBids = bids.length;
    const wonBids = bids.filter(b => b.result === 'Won').length;
    const lostBids = bids.filter(b => b.result === 'Lost').length;
    const pendingBids = bids.filter(b => b.result === 'Pending' || !b.result).length;
    const winRate = totalBids > 0 ? (wonBids / totalBids * 100).toFixed(1) : 0;
    
    const totalValue = bids.reduce((sum, b) => sum + (b.bid_amount || 0), 0);
    const wonValue = bids.filter(b => b.result === 'Won').reduce((sum, b) => sum + (b.bid_amount || 0), 0);
    
    return { totalBids, wonBids, lostBids, pendingBids, winRate, totalValue, wonValue };
  }, [bids]);

  const categoryData = useMemo(() => {
    const categories = {};
    bids.forEach(bid => {
      const cat = bid.category || 'Other';
      if (!categories[cat]) {
        categories[cat] = { name: cat, total: 0, won: 0, value: 0 };
      }
      categories[cat].total++;
      if (bid.result === 'Won') categories[cat].won++;
      categories[cat].value += bid.bid_amount || 0;
    });
    return Object.values(categories).sort((a, b) => b.total - a.total);
  }, [bids]);

  const monthlyData = useMemo(() => {
    const months = {};
    bids.forEach(bid => {
      const date = new Date(bid.created_at || bid.submission_deadline);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) {
        months[key] = { month: key, bids: 0, won: 0, value: 0 };
      }
      months[key].bids++;
      if (bid.result === 'Won') months[key].won++;
      months[key].value += bid.bid_amount || 0;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  }, [bids]);

  const statusData = [
    { name: 'Won', value: stats.wonBids, color: '#10b981' },
    { name: 'Lost', value: stats.lostBids, color: '#ef4444' },
    { name: 'Pending', value: stats.pendingBids, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tender Analytics</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="input w-40"
        >
          <option value="all">All Time</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.winRate}%</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Bid Value</p>
              <p className="text-2xl font-bold text-blue-700">MVR {(stats.totalValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Won Value</p>
              <p className="text-2xl font-bold text-purple-700">MVR {(stats.wonValue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Bids</p>
              <p className="text-2xl font-bold text-amber-700">{stats.pendingBids}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Bid Results Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Bids" fill="#6366f1" />
              <Bar dataKey="won" name="Won" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Monthly Bid Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bids" name="Total Bids" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="won" name="Won" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Details Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-right">Total Bids</th>
                <th className="px-4 py-2 text-right">Won</th>
                <th className="px-4 py-2 text-right">Win Rate</th>
                <th className="px-4 py-2 text-right">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((cat) => (
                <tr key={cat.name} className="border-t">
                  <td className="px-4 py-2 font-medium">{cat.name}</td>
                  <td className="px-4 py-2 text-right">{cat.total}</td>
                  <td className="px-4 py-2 text-right text-emerald-600">{cat.won}</td>
                  <td className="px-4 py-2 text-right">
                    {cat.total > 0 ? ((cat.won / cat.total) * 100).toFixed(1) : 0}%
                  </td>
                  <td className="px-4 py-2 text-right">
                    MVR {cat.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
