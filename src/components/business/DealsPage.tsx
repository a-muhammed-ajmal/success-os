import { useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import KanbanBoard from '../ui/KanbanBoard';
import DealCard from './DealCard';
import AddDealModal from './AddDealModal';
import DealDetailModal from './DealDetailModal';
import { getDealsByStage, createDeal, updateDeal, deleteDeal, duplicateDeal, convertDealToConnection } from '../../services/dealsService';
import type { Deal, DealStage } from '../../types/database';

const STAGES: DealStage[] = ['Application Processing', 'Verification Needed', 'Activation Needed', 'Completed', 'Unsuccessful'];

export default function DealsPage() {
  const [dealsByStage, setDealsByStage] = useState<Record<DealStage, Deal[]>>({
    'Application Processing': [],
    'Verification Needed': [],
    'Activation Needed': [],
    'Completed': [],
    'Unsuccessful': [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    try {
      const dealsData: Record<DealStage, Deal[]> = {
        'Application Processing': [],
        'Verification Needed': [],
        'Activation Needed': [],
        'Completed': [],
        'Unsuccessful': [],
      };

      for (const stage of STAGES) {
        dealsData[stage] = await getDealsByStage(stage);
      }

      setDealsByStage(dealsData);
    } catch (error) {
      console.error('Error loading deals:', error);
      alert('Failed to load deals. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = async (dealData: Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingDeal) {
      await updateDeal(editingDeal.id, dealData);
      setEditingDeal(null);
    } else {
      await createDeal(dealData);
    }
    await loadDeals();
    setShowAddModal(false);
  };

  const handleEdit = () => {
    setEditingDeal(selectedDeal);
    setShowDetailModal(false);
    setShowAddModal(true);
  };

  const handleDelete = async () => {
    if (selectedDeal) {
      await deleteDeal(selectedDeal.id);
      await loadDeals();
    }
  };

  const handleDuplicate = async () => {
    if (selectedDeal) {
      await duplicateDeal(selectedDeal.id);
      await loadDeals();
      setShowDetailModal(false);
    }
  };

  const handleConvertToConnection = async () => {
    if (selectedDeal) {
      try {
        await convertDealToConnection(selectedDeal.id);
        setShowDetailModal(false);
        alert('Deal successfully converted to connection!');
      } catch (error) {
        console.error('Error converting to connection:', error);
        alert('Failed to convert deal to connection.');
      }
    }
  };

  const filterDeals = (dealsArray: Deal[]) => {
    if (!searchQuery) return dealsArray;
    return dealsArray.filter(deal =>
      deal.application_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.bpm_id_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const kanbanColumns = STAGES.map(stage => ({
    id: stage,
    title: stage,
    items: filterDeals(dealsByStage[stage]),
    renderCard: (deal: Deal) => (
      <DealCard
        key={deal.id}
        deal={deal}
        onClick={() => {
          setSelectedDeal(deal);
          setShowDetailModal(true);
        }}
      />
    ),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading deals...</p>
      </div>
    );
  }

  return (
    <div>
      <SearchBar
        placeholder="Search deals..."
        onSearch={setSearchQuery}
        onAdd={() => {
          setEditingDeal(null);
          setShowAddModal(true);
        }}
        addButtonText="Add Deal"
      />

      {/* Kanban Board */}
<KanbanBoard
        columns={kanbanColumns}
        onCardClick={(deal) => {
          setSelectedDeal(deal);
          setShowDetailModal(true);
        }}
      />

      {/* Modals */}
      <AddDealModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingDeal(null);
        }}
        onSave={handleAddDeal}
        initialData={editingDeal}
      />

      <DealDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        deal={selectedDeal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onConvertToConnection={handleConvertToConnection}
      />
    </div>
  );
}
