import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar, DollarSign, Award, TrendingUp, Printer, Mail, CheckCircle } from 'lucide-react';
import { useData } from '../hooks/useData';

export default function Reports() {
  const { bids, tenders } = useData();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('all');
  const [generating, setGenerating] = useState(false);

  const stats = useMemo(() => {
    const filteredBids = dateRange === 'all' ? bids : bids.filter(b => {
      const date = new Date(b.created_at || b.submission_deadline);
      const now = new Date();
      if (dateRange === 'month') return date.getMonth() === now.getMonth();
      if (dateRange === 'quarter') return date >= new Date(now.getFullYear(), now.getMonth() - 3, 1);
      if (dateRange === 'year') return date.getFullYear() === now.getFullYear();
      return true;
    });

    const total = filteredBids.length;
    const won = filteredBids.filter(b => b.result === 'Won').length;
    const lost = filteredBids.filter(b => b.result === 'Lost').length;
    const pending = filteredBids.filter(b => !b.result || b.result === 'Pending').length;
    const totalValue = filteredBids.reduce((sum, b) => sum + (b.bid_amount || 0), 0);
    const wonValue = filteredBids.filter(b => b.result === 'Won').reduce((sum, b) => sum + (b.bid_amount || 0), 0);

    return { total, won, lost, pending, winRate: total > 0 ? (won / total * 100).toFixed(1) : 0, totalValue, wonValue };
  }, [bids, dateRange]);

  const generateReport = async () => {
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGenerating(false);
    alert('Report generated successfully!');
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
          <p className="text-gray-500 mt-1">Generate and export tender reports</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportPDF}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
          <button 
            onClick={generateReport}
            disabled={generating}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            {generating ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Report Type</label>
            <select 
              value={reportType} 
              onChange={(e) => setReportType(e.target.value)}
              className="input w-full"
            >
              <option value="summary">Executive Summary</option>
              <option value="detailed">Detailed Bid Report</option>
              <option value="financial">Financial Analysis</option>
              <option value="performance">Performance Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={generateReport}
              disabled={generating}
              className="btn btn-primary w-full"
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="card print:shadow-none" id="report-content">
        {/* Report Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {reportType === 'summary' && 'Executive Summary Report'}
                {reportType === 'detailed' && 'Detailed Bid Report'}
                {reportType === 'financial' && 'Financial Analysis Report'}
                {reportType === 'performance' && 'Performance Report'}
              </h2>
              <p className="text-gray-500 mt-1">Business Watch Tender Management System</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Period: {dateRange === 'all' ? 'All Time' : dateRange}</p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Bids</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg text-center">
            <Award className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-700">{stats.winRate}%</p>
            <p className="text-sm text-gray-600">Win Rate</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-700">
              MVR {(stats.totalValue / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <CheckCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-700">{stats.won}</p>
            <p className="text-sm text-gray-600">Bids Won</p>
          </div>
        </div>

        {/* Detailed Tables */}
        {(reportType === 'detailed' || reportType === 'summary') && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Recent Bids</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Tender</th>
                    <th className="px-4 py-2 text-left">Authority</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.slice(0, 10).map((bid) => (
                    <tr key={bid.id} className="border-t">
                      <td className="px-4 py-2">{bid.tender_title || bid.title}</td>
                      <td className="px-4 py-2">{bid.authority}</td>
                      <td className="px-4 py-2 text-right">
                        MVR {(bid.bid_amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bid.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                          bid.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {bid.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bid.result === 'Won' ? 'bg-emerald-100 text-emerald-800' :
                          bid.result === 'Lost' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {bid.result || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Financial Analysis */}
        {(reportType === 'financial' || reportType === 'summary') && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Value Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bid Value:</span>
                    <span className="font-medium">MVR {stats.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Won Contracts:</span>
                    <span className="font-medium text-emerald-600">MVR {stats.wonValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium">{stats.winRate}%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Average Bid Value:</span>
                    <span className="font-medium">
                      MVR {stats.total > 0 ? (stats.totalValue / stats.total).toFixed(0) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Bid Status Distribution</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Won ({stats.won})</span>
                      <span>{stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500"
                        style={{ width: `${stats.total > 0 ? (stats.won / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lost ({stats.lost})</span>
                      <span>{stats.total > 0 ? ((stats.lost / stats.total) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${stats.total > 0 ? (stats.lost / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pending ({stats.pending})</span>
                      <span>{stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500"
                        style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {reportType === 'performance' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-700">{stats.won}</p>
                <p className="text-sm text-gray-600">Successful Bids</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-700">
                  {bids.filter(b => b.status === 'Submitted').length}
                </p>
                <p className="text-sm text-gray-600">Submitted Bids</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-700">
                  MVR {(stats.wonValue / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">Revenue Won</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <p>Business Watch - Tender Management System</p>
          <p>Generated on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
