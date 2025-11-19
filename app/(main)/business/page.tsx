// app/(main)/business/page.tsx
'use client';

import { AddClientModal } from '@/components/business/AddClientModal';
import { AddLeadModal } from '@/components/business/AddLeadModal';
import { AddServiceModal } from '@/components/business/AddServiceModal';
import { ClientDetailView } from '@/components/business/ClientDetailView';
import { ClientList } from '@/components/business/ClientList';
import { KanbanBoard } from '@/components/business/KanbanBoard';
import { LeadsWidgetGrid } from '@/components/business/LeadsWidgetGrid';
import { ServicesLibrary } from '@/components/business/ServicesLibrary';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { useBusinessStore } from '@/store/businessStore';
import { Client, Lead, Service } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    setSelectedLead,
    setSelectedClient,
  } = useBusinessStore();

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null); // For ClientList to open ClientDetailView
  const [editingClient, setEditingClient] = useState<Client | null>(null); // For AddClientModal
  const [editingService, setEditingService] = useState<Service | null>(null); // For AddServiceModal

  useEffect(() => {
    fetchLeads();
    fetchClients();
    fetchServices();
  }, [fetchLeads, fetchClients, fetchServices]);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsAddLeadModalOpen(true);
  };

  const handleViewClientDetails = (client: Client) => {
    setViewingClient(client);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsAddClientModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsAddServiceModalOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">Error: {error}</div>;
  }

  // If viewing a client's details, render that component instead
  if (viewingClient) {
    return <ClientDetailView client={viewingClient} onClose={() => setViewingClient(null)} />;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Business & Sales CRM"
        description="Manage your leads, clients, sales pipeline, and services."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => { setEditingLead(null); setIsAddLeadModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
            <Button variant="secondary" onClick={() => { setEditingClient(null); setIsAddClientModalOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
            <Button variant="secondary" onClick={() => { setEditingService(null); setIsAddServiceModalOpen(true); }}>
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
          onDeleteLead={() => { /* Implement delete logic here or in LeadCard */ }}
        />
      </div>

      <div>
        <SectionHeader title="Your Clients" description="Manage your existing clients and their details." />
        <ClientList clients={clients} onViewDetails={handleViewClientDetails} />
      </div>

      <div>
        <SectionHeader title="Services Library" description="Catalog your products or services." />
        <ServicesLibrary services={services} onViewService={() => { /* Implement view service logic */ }} onEditService={handleEditService} />
      </div>

      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => { setIsAddLeadModalOpen(false); setEditingLead(null); fetchLeads(); }}
        lead={editingLead}
      />
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => { setIsAddClientModalOpen(false); setEditingClient(null); fetchClients(); }}
        client={editingClient}
      />
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => { setIsAddServiceModalOpen(false); setEditingService(null); fetchServices(); }}
        service={editingService}
      />
    </div>
  );
}
