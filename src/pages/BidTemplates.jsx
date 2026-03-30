import React, { useState } from 'react';
import { FileText, Copy, Plus, Trash2, Save, Edit3, CheckCircle, Clock, DollarSign, Building2 } from 'lucide-react';

const defaultTemplates = [
  {
    id: 1,
    name: 'Standard IT Tender',
    category: 'IT',
    description: 'Standard template for IT equipment tenders',
    sections: [
      { title: 'Company Profile', content: 'Business Watch - IT Solutions Provider\nEstablished: 2015\nEmployees: 25\nCertifications: ISO 9001' },
      { title: 'Technical Specifications', content: 'All equipment meets international standards\nWarranty: 3 years minimum\nSupport: 24/7 available' },
      { title: 'Pricing', content: 'Itemized pricing with detailed breakdown\nValid for 30 days from submission' },
      { title: 'Delivery', content: 'Delivery within 30 days of PO\nInstallation and training included' },
      { title: 'References', content: 'Ministry of Education - 2025\nMale City Council - 2024\nState Electric Company - 2024' }
    ],
    lastUsed: '2026-03-15',
    usageCount: 12
  },
  {
    id: 2,
    name: 'Office Supplies Bid',
    category: 'Office',
    description: 'For general office supplies and stationery',
    sections: [
      { title: 'Vendor Information', content: 'Business Watch - Office Solutions\nVAT Registered\nLocal supplier since 2015' },
      { title: 'Product Catalog', content: 'Complete range of office supplies\nStationery, furniture, equipment\nEco-friendly options available' },
      { title: 'Pricing Structure', content: 'Competitive wholesale pricing\nVolume discounts available\nFixed pricing for 6 months' },
      { title: 'Delivery Terms', content: 'Weekly delivery schedule\nFree delivery for orders >MVR 5000\nSame-day delivery available' }
    ],
    lastUsed: '2026-03-10',
    usageCount: 8
  },
  {
    id: 3,
    name: 'Construction Project',
    category: 'Construction',
    description: 'For construction and renovation tenders',
    sections: [
      { title: 'Company Credentials', content: 'Licensed contractor\nInsurance: Comprehensive\nSafety record: Excellent' },
      { title: 'Project Team', content: 'Certified project manager\nLicensed engineers\nExperienced workforce' },
      { title: 'Timeline', content: 'Detailed project schedule\nMilestone-based payments\nPenalty clauses for delays' },
      { title: 'Quality Assurance', content: 'Material testing included\nThird-party inspections\nWarranty: 5 years structural' }
    ],
    lastUsed: '2026-02-28',
    usageCount: 5
  }
];

export default function BidTemplates() {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const createFromTemplate = (template) => {
    const newBid = {
      id: Date.now(),
      ...template,
      name: `${template.name} - Copy`,
      created: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    
    // Update usage count
    setTemplates(templates.map(t => 
      t.id === template.id 
        ? { ...t, usageCount: t.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : t
    ));
    
    alert(`Created new bid from template: ${template.name}`);
  };

  const deleteTemplate = (id) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    }
  };

  const saveTemplate = (template) => {
    if (editing) {
      setTemplates(templates.map(t => t.id === template.id ? template : t));
      setEditing(false);
    } else {
      setTemplates([...templates, { ...template, id: Date.now(), usageCount: 0 }]);
      setShowCreate(false);
    }
    setSelectedTemplate(null);
  };

  const addSection = () => {
    const updated = { 
      ...selectedTemplate, 
      sections: [...selectedTemplate.sections, { title: 'New Section', content: '' }] 
    };
    setSelectedTemplate(updated);
  };

  const updateSection = (index, field, value) => {
    const updated = { ...selectedTemplate };
    updated.sections[index][field] = value;
    setSelectedTemplate(updated);
  };

  const removeSection = (index) => {
    const updated = { ...selectedTemplate };
    updated.sections = updated.sections.filter((_, i) => i !== index);
    setSelectedTemplate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bid Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage reusable bid templates</p>
        </div>
        <button 
          onClick={() => {
            setShowCreate(true);
            setSelectedTemplate({
              name: '',
              category: 'General',
              description: '',
              sections: [{ title: 'Section 1', content: '' }]
            });
            setEditing(false);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-3xl font-bold text-blue-700">{templates.length}</p>
          <p className="text-sm text-gray-600">Total Templates</p>
        </div>
        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100">
          <p className="text-3xl font-bold text-emerald-700">
            {templates.reduce((sum, t) => sum + t.usageCount, 0)}
          </p>
          <p className="text-sm text-gray-600">Times Used</p>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-3xl font-bold text-purple-700">
            {templates.filter(t => t.category === 'IT').length}
          </p>
          <p className="text-sm text-gray-600">IT Templates</p>
        </div>
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100">
          <p className="text-3xl font-bold text-amber-700">
            {new Set(templates.map(t => t.category)).size}
          </p>
          <p className="text-sm text-gray-600">Categories</p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id}
            className="card hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => {
              setSelectedTemplate(template);
              setEditing(false);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {template.category}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{template.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                {template.sections.length} sections
              </span>
              <span className="flex items-center gap-1">
                <Copy className="w-4 h-4" />
                Used {template.usageCount} times
              </span>
            </div>
            
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  createFromTemplate(template);
                }}
                className="flex-1 btn btn-primary text-sm py-2"
              >
                <Copy className="w-4 h-4" />
                Use Template
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTemplate(template.id);
                }}
                className="p-2 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Editor Modal */}
      {(selectedTemplate || showCreate) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editing || showCreate ? (showCreate ? 'Create Template' : 'Edit Template') : 'Template Details'}
                </h2>
                <div className="flex gap-2">
                  {!editing && !showCreate && (
                    <button 
                      onClick={() => setEditing(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedTemplate(null);
                      setShowCreate(false);
                      setEditing(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Template Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    disabled={!editing && !showCreate}
                    className="input w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedTemplate.category}
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, category: e.target.value})}
                      disabled={!editing && !showCreate}
                      className="input w-full"
                    >
                      <option>IT</option>
                      <option>Office</option>
                      <option>Construction</option>
                      <option>Medical</option>
                      <option>General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={selectedTemplate.description}
                      onChange={(e) => setSelectedTemplate({...selectedTemplate, description: e.target.value})}
                      disabled={!editing && !showCreate}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Sections</h3>
                  {(editing || showCreate) && (
                    <button 
                      onClick={addSection}
                      className="btn btn-secondary text-sm py-1 px-3"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {selectedTemplate.sections?.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                            disabled={!editing && !showCreate}
                            className="input w-full font-medium"
                            placeholder="Section Title"
                          />
                          <textarea
                            value={section.content}
                            onChange={(e) => updateSection(index, 'content', e.target.value)}
                            disabled={!editing && !showCreate}
                            rows={3}
                            className="input w-full"
                            placeholder="Section content..."
                          />
                        </div>
                        {(editing || showCreate) && (
                          <button 
                            onClick={() => removeSection(index)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {(editing || showCreate) && (
                <div className="flex gap-3 pt-4 border-t">
                  <button 
                    onClick={() => saveTemplate(selectedTemplate)}
                    className="btn btn-primary flex-1"
                  >
                    <Save className="w-5 h-5" />
                    {showCreate ? 'Create Template' : 'Save Changes'}
                  </button>
                  <button 
                    onClick={() => {
                      setEditing(false);
                      setShowCreate(false);
                      setSelectedTemplate(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
