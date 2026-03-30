import React, { useState } from 'react';
import { Star, Building2, Phone, Mail, MapPin, TrendingUp, TrendingDown, MoreVertical, Plus, Search, Filter } from 'lucide-react';

const initialSuppliers = [
  {
    id: 1,
    name: "Tech Solutions Maldives",
    category: "IT Equipment",
    contact: "Ahmed Hassan",
    phone: "+960 999-1234",
    email: "ahmed@techsolutions.mv",
    address: "Male, Maldives",
    rating: 4.5,
    totalBids: 12,
    wonBids: 8,
    totalValue: 850000,
    status: "active",
    performance: [
      { month: "Jan", bids: 2, won: 1 },
      { month: "Feb", bids: 3, won: 2 },
      { month: "Mar", bids: 1, won: 1 },
      { month: "Apr", bids: 2, won: 1 },
    ]
  },
  {
    id: 2,
    name: "Office Supplies Co.",
    category: "Office Supplies",
    contact: "Mohamed Ali",
    phone: "+960 777-5678",
    email: "mohamed@officesupplies.mv",
    address: "Hulhumale, Maldives",
    rating: 4.0,
    totalBids: 8,
    wonBids: 5,
    totalValue: 320000,
    status: "active",
    performance: [
      { month: "Jan", bids: 1, won: 1 },
      { month: "Feb", bids: 2, won: 1 },
      { month: "Mar", bids: 2, won: 1 },
      { month: "Apr", bids: 1, won: 1 },
    ]
  },
  {
    id: 3,
    name: "Construction Materials Ltd",
    category: "Construction",
    contact: "Ibrahim Rasheed",
    phone: "+960 666-9012",
    email: "ibrahim@cml.mv",
    address: "Male, Maldives",
    rating: 3.5,
    totalBids: 15,
    wonBids: 6,
    totalValue: 1200000,
    status: "active",
    performance: [
      { month: "Jan", bids: 3, won: 1 },
      { month: "Feb", bids: 4, won: 2 },
      { month: "Mar", bids: 3, won: 1 },
      { month: "Apr", bids: 2, won: 1 },
    ]
  },
  {
    id: 4,
    name: "Medical Equipment Suppliers",
    category: "Medical",
    contact: "Fathimath Naha",
    phone: "+960 555-3456",
    email: "fathimath@medical.mv",
    address: "Male, Maldives",
    rating: 5.0,
    totalBids: 6,
    wonBids: 5,
    totalValue: 2100000,
    status: "active",
    performance: [
      { month: "Jan", bids: 1, won: 1 },
      { month: "Feb", bids: 1, won: 1 },
      { month: "Mar", bids: 2, won: 2 },
      { month: "Apr", bids: 1, won: 1 },
    ]
  },
  {
    id: 5,
    name: "Furniture World",
    category: "Furniture",
    contact: "Hussain Shafeeu",
    phone: "+960 444-7890",
    email: "hussain@furniture.mv",
    address: "Male, Maldives",
    rating: 3.0,
    totalBids: 4,
    wonBids: 1,
    totalValue: 150000,
    status: "inactive",
    performance: [
      { month: "Jan", bids: 1, won: 0 },
      { month: "Feb", bids: 1, won: 0 },
      { month: "Mar", bids: 1, won: 1 },
      { month: "Apr", bids: 0, won: 0 },
    ]
  },
];

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${
            i < fullStars 
              ? 'text-amber-400 fill-amber-400' 
              : i === fullStars && hasHalfStar 
                ? 'text-amber-400 fill-amber-400/50' 
                : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function EnhancedSuppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = ['All', ...new Set(suppliers.map(s => s.category))];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || supplier.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: suppliers.length,
    active: suppliers.filter(s => s.status === 'active').length,
    avgRating: (suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1),
    totalValue: suppliers.reduce((sum, s) => sum + s.totalValue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-500 mt-1">Manage suppliers, ratings, and performance</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Supplier
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.active}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-amber-700">{stats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-700">MVR {(stats.totalValue / 1000000).toFixed(1)}M</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input w-48"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Suppliers Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Supplier</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-center">Rating</th>
                <th className="px-4 py-3 text-center">Bids Won/Total</th>
                <th className="px-4 py-3 text-right">Total Value</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr 
                  key={supplier.id} 
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedSupplier(supplier)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-sm text-gray-500">{supplier.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{supplier.contact}</div>
                    <div className="text-sm text-gray-500">{supplier.email}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StarRating rating={supplier.rating} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${
                      supplier.wonBids / supplier.totalBids > 0.5 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {supplier.wonBids}/{supplier.totalBids}
                    </span>
                    <div className="text-xs text-gray-500">
                      {((supplier.wonBids / supplier.totalBids) * 100).toFixed(0)}% win rate
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    MVR {supplier.totalValue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      supplier.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedSupplier.name}</h2>
                  <p className="text-gray-500">{selectedSupplier.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedSupplier(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedSupplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedSupplier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedSupplier.address}</p>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-emerald-600">{selectedSupplier.wonBids}</p>
                  <p className="text-sm text-gray-600">Bids Won</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedSupplier.totalBids}</p>
                  <p className="text-sm text-gray-600">Total Bids</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    MVR {(selectedSupplier.totalValue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-gray-600">Total Value</p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm text-gray-500 mb-2">Overall Rating</p>
                <StarRating rating={selectedSupplier.rating} />
              </div>

              {/* Monthly Performance */}
              <div>
                <p className="font-medium mb-3">Monthly Performance</p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedSupplier.performance.map((month) => (
                    <div key={month.month} className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">{month.month}</p>
                      <p className="font-medium">{month.won}/{month.bids}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
