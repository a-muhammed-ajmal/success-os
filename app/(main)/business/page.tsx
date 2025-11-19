'use client';

import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { AddClientModal } from '../../components/business/AddClientModal';
import { AddLeadModal } from '../../components/business/AddLeadModal';
import { AddServiceModal } from '../../components/business/AddServiceModal';
import { ClientList } from '../../components/business/ClientList';
import { KanbanBoard } from '../../components/business/KanbanBoard';
import { LeadsWidgetGrid } from '../../components/business/LeadsWidgetGrid';
import { ServicesLibrary } from '../../components/business/ServicesLibrary';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';
import { SectionHeader } from '../../components/shared/SectionHeader';
import { Button } from '../../components/ui/button';
import { useBusinessStore } from '../../store/businessStore';

export default function BusinessPage() {
  const {
    leads,
    clients,
    services,
    fetchLeads,
    fetchClients,
    fetchServices,
    updateLeadStage,
    isLoading,
    error,
    selectedLead,
    setSelectedLead,
    selectedClient,
    setSelectedClient,
  } = useBusinessStore();

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchClients();
    fetchServices();
  }, [fetchLeads, fetchClients, fetchServices]);

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsAddLeadModalOpen(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsAddClientModalOpen(true);
  };

  const handleEditService = (service) => {
    // Implement service editing logic, possibly via a separate modal
    console.log('Edit service:', service);
  };

  if (isLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Business & Sales CRM"
        description="Manage your leads, clients, sales pipeline, and services."
        actions={
          <div className="flex gap-2">
            <Button onClick={() => { setSelectedLead(null); setIsAddLeadModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
            <Button variant="secondary" onClick={() => { setSelectedClient(null); setIsAddClientModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
            <Button variant="secondary" onClick={() => { setIsAddServiceModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Service
            </Button>
          </div>
        }
      />

      <LeadsWidgetGrid />

      <div>
        <SectionHeader title="Sales Pipeline" description="Track your leads through different stages." />
        <KanbanBoard
          leads={leads}
          onUpdateStage={updateLeadStage}
          onEditLead={handleEditLead}
          onDeleteLead={() => { /* Implement delete logic */ }}
        />
      </div>

      <div>
        <SectionHeader title="Your Clients" description="Manage your existing clients and their details." />
        <ClientList clients={clients} onEditClient={handleEditClient} />
      </div>

      <div>
        <SectionHeader title="Services Library" description="Catalog your products or services." />
        <ServicesLibrary services={services} onEditService={handleEditService} />
      </div>

      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => { setIsAddLeadModalOpen(false); setSelectedLead(null); fetchLeads(); }}
        lead={selectedLead}
      />
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => { setIsAddClientModalOpen(false); setSelectedClient(null); fetchClients(); }}
        client={selectedClient}
      />
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => { setIsAddServiceModalOpen(false); fetchServices(); }}
        service={null} // For now, only add new services
      />
    </div>
  );
}
