import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Users, 
  Printer,
  Layers,
  FileText,
  TrendingUp,
  Wallet,
  TrendingDown,
  CreditCard,
  X,
  Calendar,
  PieChart
} from 'lucide-react';
import { 
  collection, 
  query, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { format } from 'date-fns';

const StaffExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // User-defined expense types persisted in localStorage
  const [userDefinedTypes, setUserDefinedTypes] = useState(() => {
    const saved = localStorage.getItem('userDefinedExpenseTypes');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    type: 'Salary',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    staffName: '',
    notes: ''
  });

  // Predefined expense types + user-defined
  const predefinedTypes = [
    'Salary',
    'Printing Charge',
    'Binding',
    'Laminating',
    'Transport',
    'Meals',
    'Office Supplies',
    'Utilities',
    'Maintenance',
    ...userDefinedTypes
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const snapshot = await getDocs(
        query(collection(db, 'staffExpenses'), orderBy('date', 'desc'))
      );
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const thisMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  const expensesByType = predefinedTypes.reduce((acc, type) => {
    acc[type] = expenses.filter(e => e.type === type).reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    return acc;
  }, {});

  const uniqueStaff = [...new Set(expenses.map(e => e.staffName).filter(Boolean))];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        updatedAt: serverTimestamp()
      };

      if (editingExpense) {
        await updateDoc(doc(db, 'staffExpenses', editingExpense.id), expenseData);
      } else {
        expenseData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'staffExpenses'), expenseData);
      }

      setShowModal(false);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await deleteDoc(doc(db, 'staffExpenses', id));
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'Salary',
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      staffName: '',
      notes: ''
    });
  };

  const openAddModal = () => {
    setEditingExpense(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setFormData({
      type: expense.type || 'Salary',
      description: expense.description || '',
      amount: expense.amount || '',
      date: expense.date || format(new Date(), 'yyyy-MM-dd'),
      staffName: expense.staffName || '',
      notes: expense.notes || ''
    });
    setShowModal(true);
  };

  // Save user-defined type
  const saveUserDefinedType = (type) => {
    if (!type || predefinedTypes.includes(type)) return;
    const updated = [...userDefinedTypes, type];
    setUserDefinedTypes(updated);
    localStorage.setItem('userDefinedExpenseTypes', JSON.stringify(updated));
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      (expense.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.staffName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || expense.type === filterType;
    return matchesSearch && matchesType;
  });

  // Stat Cards Data
  const statCards = [
    { 
      title: 'Total Expenses', 
      value: `MVR ${totalExpenses.toLocaleString()}`, 
      icon: Wallet, 
      color: 'red',
      subtitle: 'All time'
    },
    { 
      title: 'This Month', 
      value: `MVR ${thisMonthExpenses.toLocaleString()}`, 
      icon: Calendar, 
      color: 'blue',
      subtitle: 'Current month'
    },
    { 
      title: 'Staff Count', 
      value: uniqueStaff.length, 
      icon: Users, 
      color: 'green',
      subtitle: 'Unique staff'
    },
    { 
      title: 'Expense Entries', 
      value: expenses.length, 
      icon: FileText, 
      color: 'purple',
      subtitle: 'Total records'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="/illustrations/At%20the%20office-amico.svg" 
            alt="Staff Expense" 
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Staff Expenses</h1>
            <p className="text-gray-500 mt-1 text-sm">Track and manage all staff-related expenses</p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`card bg-${stat.color}-50 border-${stat.color}-200 p-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense by Type Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          Expenses by Type
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(expensesByType)
            .filter(([_, amount]) => amount > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([type, amount]) => (
              <div key={type} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">{type}</p>
                <p className="text-sm font-semibold text-gray-900">
                  MVR {amount.toLocaleString()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 sm:pl-10 text-sm w-full"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input w-full sm:w-48 text-sm"
        >
          <option value="All">All Types</option>
          {predefinedTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Expenses Table */}
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No expenses found</p>
          <p className="text-sm mt-1">Add your first expense to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{expense.staffName || '-'}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    MVR {parseFloat(expense.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(expense)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="4" className="px-4 py-3 text-right font-semibold text-gray-700">
                  Total:
                </td>
                <td className="px-4 py-3 text-right font-bold text-gray-900">
                  MVR {filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0).toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingExpense ? 'Edit Expense' : 'Add Expense'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Expense Type */}
                <div>
                  <label className="label">Expense Type</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Salary', 'Printing Charge', 'Binding', 'Laminating', 'Transport'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          formData.type === type 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, type: e.target.value }));
                      if (e.target.value && !predefinedTypes.includes(e.target.value)) {
                        saveUserDefinedType(e.target.value);
                      }
                    }}
                    placeholder="Or enter custom type"
                    className="input text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="label">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Monthly salary, Printing tender documents"
                    className="input"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="label">Amount (MVR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">MVR</span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="input pl-12"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="input"
                    required
                  />
                </div>

                {/* Staff Name */}
                <div>
                  <label className="label">Staff Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.staffName}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffName: e.target.value }))}
                    placeholder="e.g., Ahmed Mohamed"
                    className="input"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information..."
                    className="input h-20"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffExpense;
