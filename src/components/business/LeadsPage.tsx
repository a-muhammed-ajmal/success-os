import { useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import LeadCard from './LeadCard';
import AddLeadModal from './AddLeadModal';
import LeadDetailModal from './LeadDetailModal';
import { getLeadsByStatus, createLead, updateLead, deleteLead, duplicateLead, convertLeadToDeal } from '../../services/leadsService';
import type { Lead, LeadStatus } from '../../types/database';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Record<LeadStatus, Lead[]>>({
    'New Lead': [],
    'Qualified Lead': [],
    'Appointment Booked': [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const statuses: LeadStatus[] = ['New Lead', 'Qualified Lead', 'Appointment Booked'];
      const leadsData: Record<LeadStatus, Lead[]> = {
        'New Lead': [],
        'Qualified Lead': [],
        'Appointment Booked': [],
      };

      for (const status of statuses) {
        leadsData[status] = await getLeadsByStatus(status);
      }

      setLeads(leadsData);
    } catch (error) {
      console.error('Error loading leads:', error);
      alert('Failed to load leads. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingLead) {
      await updateLead(editingLead.id, leadData);
      setEditingLead(null);
    } else {
      await createLead(leadData);
    }
    await loadLeads();
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setEditingLead(selectedLead);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (selectedLead) {
      await deleteLead(selectedLead.id);
      await loadLeads();
    }
  };

  const handleDuplicate = async () => {
    if (selectedLead) {
      await duplicateLead(selectedLead.id);
      await loadLeads();
      setShowDetailModal(false);
    }
  };

  const handleConvertToDeal = async () => {
    if (selectedLead) {
      try {
        await convertLeadToDeal(selectedLead.id);
        await loadLeads();
        setShowDetailModal(false);
        alert('Lead successfully converted to deal!');
      } catch (error) {
        console.error('Error converting to deal:', error);
        alert('Failed to convert lead to deal.');
      }
    }
  };

  const filterLeads = (leadsArray: Lead[]) => {
    if (!searchQuery) return leadsArray;
    return leadsArray.filter(lead =>
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const pipelines: Array<{ title: string; status: LeadStatus }> = [
    { title: 'New Lead', status: 'New Lead' },
    { title: 'Qualified Lead', status: 'Qualified Lead' },
    { title: 'Appointment Booked', status: 'Appointment Booked' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading leads...</p>
      </div>
    );
  }

  return (
    <div>
      <SearchBar
        placeholder="Search leads..."
        onSearch={setSearchQuery}
        onAdd={() => {
          setEditingLead(null);
          setShowAddModal(true);
        }}
        addButtonText="Add Lead"
      />

      {/* Pipeline View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pipelines.map((pipeline) => (
          <div key={pipeline.status} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{pipeline.title}</h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {filterLeads(leads[pipeline.status]).length}
              </span>
            </div>
            <div className="space-y-2">
              {filterLeads(leads[pipeline.status]).map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowDetailModal(true);
                  }}
                />
              ))}
              {filterLeads(leads[pipeline.status]).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No leads
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingLead(null);
        }}
        onSave={handleAddLead}
        initialData={editingLead}
      />

      <LeadDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        lead={selectedLead}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onConvertToDeal={handleConvertToDeal}
      />
    </div>
  );
}
