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
  PieChart,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank
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
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' or 'capital'
  
  // Expenses state
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Capital state
  const [capitalEntries, setCapitalEntries] = useState([]);
  const [capitalLoading, setCapitalLoading] = useState(false);
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [editingCapital, setEditingCapital] = useState(null);
  const [capitalSearchTerm, setCapitalSearchTerm] = useState('');
  
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

  // Capital form data
  const [capitalFormData, setCapitalFormData] = useState({
    borrowedAmount: '',
    borrowedDate: format(new Date(), 'yyyy-MM-dd'),
    paidAmount: '',
    paidDate: '',
    hasInterest: false,
    purpose: '',
    source: '',
    sourceType: 'Other Party', // 'Company Staff' or 'Other Party'
    notes: ''
  });

  // Predefined company staff/directors
  const companyStaff = [
    { name: 'Abobakuru Qasim', position: 'Managing Director' },
    { name: 'Abdul Rasheed Ali', position: 'Director' },
    { name: 'Ziyad Rashadh', position: 'Director' }
  ];

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
    fetchCapital();
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

  const fetchCapital = async () => {
    setCapitalLoading(true);
    try {
      const snapshot = await getDocs(
        query(collection(db, 'capital'), orderBy('borrowedDate', 'desc'))
      );
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));
      setCapitalEntries(data);
    } catch (error) {
      console.error('Error fetching capital:', error);
    } finally {
      setCapitalLoading(false);
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

  // Capital calculations
  const totalBorrowed = capitalEntries.reduce((sum, e) => sum + (parseFloat(e.borrowedAmount) || 0), 0);
  const totalPaid = capitalEntries.reduce((sum, e) => sum + (parseFloat(e.paidAmount) || 0), 0);
  const outstandingBalance = totalBorrowed - totalPaid;

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

  // Capital CRUD functions
  const handleCapitalSubmit = async (e) => {
    e.preventDefault();
    try {
      const capitalData = {
        ...capitalFormData,
        borrowedAmount: parseFloat(capitalFormData.borrowedAmount) || 0,
        paidAmount: parseFloat(capitalFormData.paidAmount) || 0,
        updatedAt: serverTimestamp()
      };

      if (editingCapital) {
        await updateDoc(doc(db, 'capital', editingCapital.id), capitalData);
      } else {
        capitalData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'capital'), capitalData);
      }

      setShowCapitalModal(false);
      setEditingCapital(null);
      resetCapitalForm();
      fetchCapital();
    } catch (error) {
      console.error('Error saving capital entry:', error);
      alert('Error saving capital entry. Please try again.');
    }
  };

  const handleCapitalDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this capital entry?')) return;
    
    try {
      await deleteDoc(doc(db, 'capital', id));
      fetchCapital();
    } catch (error) {
      console.error('Error deleting capital entry:', error);
      alert('Error deleting capital entry. Please try again.');
    }
  };

  const resetCapitalForm = () => {
    setCapitalFormData({
      borrowedAmount: '',
      borrowedDate: format(new Date(), 'yyyy-MM-dd'),
      paidAmount: '',
      paidDate: '',
      hasInterest: false,
      purpose: '',
      source: '',
      sourceType: 'Other Party',
      notes: ''
    });
  };

  const openAddCapitalModal = () => {
    setEditingCapital(null);
    resetCapitalForm();
    setShowCapitalModal(true);
  };

  const openEditCapitalModal = (entry) => {
    setEditingCapital(entry);
    setCapitalFormData({
      borrowedAmount: entry.borrowedAmount || '',
      borrowedDate: entry.borrowedDate || format(new Date(), 'yyyy-MM-dd'),
      paidAmount: entry.paidAmount || '',
      paidDate: entry.paidDate || '',
      hasInterest: entry.hasInterest || false,
      purpose: entry.purpose || '',
      source: entry.source || '',
      sourceType: entry.sourceType || 'Other Party',
      notes: entry.notes || ''
    });
    setShowCapitalModal(true);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      (expense.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.staffName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.type || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || expense.type === filterType;
    return matchesSearch && matchesType;
  });

  // Filtered capital entries
  const filteredCapital = capitalEntries.filter(entry => {
    const matchesSearch = 
      (entry.purpose || '').toLowerCase().includes(capitalSearchTerm.toLowerCase()) ||
      (entry.source || '').toLowerCase().includes(capitalSearchTerm.toLowerCase());
    return matchesSearch;
  });

  // Stat Cards Data - dynamic based on active tab
  const expenseStatCards = [
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

  const capitalStatCards = [
    { 
      title: 'Total Borrowed', 
      value: `MVR ${totalBorrowed.toLocaleString()}`, 
      icon: ArrowDownLeft, 
      color: 'blue',
      subtitle: 'From all sources'
    },
    { 
      title: 'Total Paid', 
      value: `MVR ${totalPaid.toLocaleString()}`, 
      icon: ArrowUpRight, 
      color: 'green',
      subtitle: 'Amount returned'
    },
    { 
      title: 'Outstanding', 
      value: `MVR ${outstandingBalance.toLocaleString()}`, 
      icon: PiggyBank, 
      color: outstandingBalance > 0 ? 'orange' : 'gray',
      subtitle: 'Remaining balance'
    },
    { 
      title: 'Capital Entries', 
      value: capitalEntries.length, 
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
            <p className="text-gray-500 mt-1 text-sm">Track expenses and capital investments</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('expenses')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'expenses' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-1" />
            Expenses
          </button>
          <button 
            onClick={() => setActiveTab('capital')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'capital' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PiggyBank className="w-4 h-4 inline mr-1" />
            Capital
          </button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(activeTab === 'expenses' ? expenseStatCards : capitalStatCards).map((stat, index) => (
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

      {/* Add Button */}
      <div className="flex justify-end">
        {activeTab === 'expenses' ? (
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Expense</span>
          </button>
        ) : (
          <button onClick={openAddCapitalModal} className="btn-primary bg-purple-600 hover:bg-purple-700 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Add Capital Entry</span>
          </button>
        )}
      </div>

      {/* EXPENSES TAB CONTENT */}
      {activeTab === 'expenses' && (
        <>
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
        </>
      )}

      {/* CAPITAL TAB CONTENT */}
      {activeTab === 'capital' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search capital entries..."
                value={capitalSearchTerm}
                onChange={(e) => setCapitalSearchTerm(e.target.value)}
                className="input pl-9 sm:pl-10 text-sm w-full"
              />
            </div>
          </div>

          {/* Capital Table */}
          {capitalLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : filteredCapital.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <PiggyBank className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No capital entries found</p>
              <p className="text-sm mt-1">Add your first capital entry to track borrowed/paid amounts</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50 border-b border-purple-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Borrowed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Interest</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCapital.map((entry) => {
                    const borrowed = parseFloat(entry.borrowedAmount) || 0;
                    const paid = parseFloat(entry.paidAmount) || 0;
                    const balance = borrowed - paid;
                    const isStaff = entry.sourceType === 'Company Staff';
                    return (
                      <tr key={entry.id} className="hover:bg-purple-50/50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{entry.source || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isStaff ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {entry.sourceType || 'Other Party'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.purpose || '-'}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                          MVR {borrowed.toLocaleString()}
                          <p className="text-xs text-gray-400">{entry.borrowedDate}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 font-medium">
                          {paid > 0 ? `MVR ${paid.toLocaleString()}` : '-'}
                          {entry.paidDate && <p className="text-xs text-gray-400">{entry.paidDate}</p>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {entry.hasInterest ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          <span className={balance > 0 ? 'text-orange-600' : 'text-green-600'}>
                            MVR {balance.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditCapitalModal(entry)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCapitalDelete(entry.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-purple-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-700">
                      Totals:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      MVR {filteredCapital.reduce((sum, e) => sum + (parseFloat(e.paidAmount) || 0), 0).toLocaleString()}
                    </td>
                    <td></td>
                    <td className="px-4 py-3 text-right font-bold text-orange-700">
                      MVR {filteredCapital.reduce((sum, e) => sum + ((parseFloat(e.borrowedAmount) || 0) - (parseFloat(e.paidAmount) || 0)), 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
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

      {/* Capital Modal */}
      {showCapitalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCapital ? 'Edit Capital Entry' : 'Add Capital Entry'}
                </h2>
                <button
                  onClick={() => setShowCapitalModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCapitalSubmit} className="space-y-4">
                {/* Source Type Selection */}
                <div>
                  <label className="label">Source Type</label>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sourceType"
                        value="Company Staff"
                        checked={capitalFormData.sourceType === 'Company Staff'}
                        onChange={(e) => setCapitalFormData(prev => ({ ...prev, sourceType: e.target.value, source: '' }))}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm">Company Staff</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sourceType"
                        value="Other Party"
                        checked={capitalFormData.sourceType === 'Other Party'}
                        onChange={(e) => setCapitalFormData(prev => ({ ...prev, sourceType: e.target.value, source: '' }))}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-sm">Other Party</span>
                    </label>
                  </div>
                </div>

                {/* Source - Conditional based on type */}
                <div>
                  <label className="label">
                    {capitalFormData.sourceType === 'Company Staff' ? 'Select Staff' : 'Source Name'}
                  </label>
                  {capitalFormData.sourceType === 'Company Staff' ? (
                    <select
                      value={capitalFormData.source}
                      onChange={(e) => setCapitalFormData(prev => ({ ...prev, source: e.target.value }))}
                      className="input"
                      required
                    >
                      <option value="">Select a staff member...</option>
                      {companyStaff.map((staff) => (
                        <option key={staff.name} value={staff.name}>
                          {staff.name} - {staff.position}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={capitalFormData.source}
                      onChange={(e) => setCapitalFormData(prev => ({ ...prev, source: e.target.value }))}
                      placeholder="e.g., Bank Loan, External Investor"
                      className="input"
                      required
                    />
                  )}
                </div>

                {/* Purpose */}
                <div>
                  <label className="label">Purpose</label>
                  <input
                    type="text"
                    value={capitalFormData.purpose}
                    onChange={(e) => setCapitalFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="e.g., Tender bid security, Office renovation"
                    className="input"
                    required
                  />
                </div>

                {/* Borrowed Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Borrowed Amount (MVR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">MVR</span>
                      <input
                        type="number"
                        value={capitalFormData.borrowedAmount}
                        onChange={(e) => setCapitalFormData(prev => ({ ...prev, borrowedAmount: e.target.value }))}
                        placeholder="0.00"
                        className="input pl-12"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Borrowed Date</label>
                    <input
                      type="date"
                      value={capitalFormData.borrowedDate}
                      onChange={(e) => setCapitalFormData(prev => ({ ...prev, borrowedDate: e.target.value }))}
                      className="input"
                      required
                    />
                  </div>
                </div>

                {/* Paid Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Paid Back (MVR)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">MVR</span>
                      <input
                        type="number"
                        value={capitalFormData.paidAmount}
                        onChange={(e) => setCapitalFormData(prev => ({ ...prev, paidAmount: e.target.value }))}
                        placeholder="0.00"
                        className="input pl-12"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Paid Date (if any)</label>
                    <input
                      type="date"
                      value={capitalFormData.paidDate}
                      onChange={(e) => setCapitalFormData(prev => ({ ...prev, paidDate: e.target.value }))}
                      className="input"
                    />
                  </div>
                </div>

                {/* Interest Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hasInterest"
                    checked={capitalFormData.hasInterest}
                    onChange={(e) => setCapitalFormData(prev => ({ ...prev, hasInterest: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <label htmlFor="hasInterest" className="text-sm text-gray-700">
                    Includes interest charges
                  </label>
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    value={capitalFormData.notes}
                    onChange={(e) => setCapitalFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information..."
                    className="input h-20"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCapitalModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary bg-purple-600 hover:bg-purple-700 flex-1"
                  >
                    {editingCapital ? 'Update' : 'Add'} Entry
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
