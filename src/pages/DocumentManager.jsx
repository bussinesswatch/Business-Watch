import React, { useState, useRef } from 'react';
import { Upload, File, Trash2, Download, Eye, Folder, Plus, Search, FileText, Image, FileSpreadsheet, X } from 'lucide-react';

const mockDocuments = [
  { id: 1, name: 'Tender_Specifications_2026.pdf', type: 'pdf', size: '2.4 MB', tender: 'IT Equipment Supply', uploaded: '2026-03-15', category: 'Specifications' },
  { id: 2, name: 'Bid_Proposal_Template.docx', type: 'doc', size: '856 KB', tender: 'General', uploaded: '2026-03-10', category: 'Templates' },
  { id: 3, name: 'Price_Quotation_Q1.xlsx', type: 'xls', size: '1.2 MB', tender: 'Office Supplies', uploaded: '2026-03-12', category: 'Quotations' },
  { id: 4, name: 'Contract_Agreement.pdf', type: 'pdf', size: '3.1 MB', tender: 'Construction Project', uploaded: '2026-03-08', category: 'Contracts' },
  { id: 5, name: 'Project_Timeline.png', type: 'image', size: '450 KB', tender: 'Infrastructure', uploaded: '2026-03-20', category: 'Planning' },
];

const fileIcons = {
  pdf: <FileText className="w-8 h-8 text-red-500" />,
  doc: <FileText className="w-8 h-8 text-blue-500" />,
  docx: <FileText className="w-8 h-8 text-blue-500" />,
  xls: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />,
  xlsx: <FileSpreadsheet className="w-8 h-8 text-emerald-500" />,
  image: <Image className="w-8 h-8 text-purple-500" />,
  default: <File className="w-8 h-8 text-gray-500" />
};

export default function DocumentManager() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ['All', 'Specifications', 'Templates', 'Quotations', 'Contracts', 'Planning', 'Other'];

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newDocs = files.map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.name.split('.').pop().toLowerCase(),
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        tender: 'New Tender',
        uploaded: new Date().toISOString().split('T')[0],
        category: 'Other'
      }));
      
      setDocuments([...newDocs, ...documents]);
      setUploading(false);
    }, 1500);
  };

  const deleteDocument = (id) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const getFileIcon = (type) => {
    return fileIcons[type] || fileIcons.default;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-500 mt-1">Upload, organize, and manage tender documents</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-primary flex items-center gap-2"
          disabled={uploading}
        >
          <Upload className="w-5 h-5" />
          {uploading ? 'Uploading...' : 'Upload Documents'}
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileUpload}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-700">{documents.length}</p>
            <p className="text-sm text-gray-600">Total Documents</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-700">
              {documents.filter(d => d.type === 'pdf').length}
            </p>
            <p className="text-sm text-gray-600">PDFs</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-700">
              {documents.filter(d => ['xls', 'xlsx'].includes(d.type)).length}
            </p>
            <p className="text-sm text-gray-600">Spreadsheets</p>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-700">
              {(documents.reduce((acc, d) => acc + parseFloat(d.size), 0) / 1024).toFixed(1)} GB
            </p>
            <p className="text-sm text-gray-600">Storage Used</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input w-full pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input w-48"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Documents Grid */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3">
                {getFileIcon(doc.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                  <p className="text-sm text-gray-500">{doc.tender}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{doc.category}</span>
                    <span className="text-xs text-gray-500">{doc.size}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{doc.uploaded}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setPreviewDoc(doc)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Preview"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => deleteDocument(doc.id)}
                  className="p-2 hover:bg-red-50 rounded-lg ml-auto"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents found</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(previewDoc.type)}
                <div>
                  <h3 className="font-semibold">{previewDoc.name}</h3>
                  <p className="text-sm text-gray-500">{previewDoc.size} • {previewDoc.category}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                {getFileIcon(previewDoc.type)}
                <p className="mt-4 text-gray-600">Preview not available</p>
                <p className="text-sm text-gray-500">Download to view this document</p>
                <button className="btn btn-primary mt-4 flex items-center gap-2 mx-auto">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
