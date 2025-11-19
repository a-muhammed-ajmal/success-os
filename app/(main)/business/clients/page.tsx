// app/(main)/business/clients/page.tsx
'use client';

import { AddClientModal } from '@/components/business/AddClientModal';
import { ClientDetailView } from '@/components/business/ClientDetailView';
import { ClientList } from '@/components/business/ClientList';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { useBusinessStore } from '@/store/businessStore';
import { Client } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ClientsPage() {
  const { clients, fetchClients, isLoading, error, selectedClient, setSelectedClient } = useBusinessStore();
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsAddClientModalOpen(true);
  };

  if (isLoading) return <LoadingSpinner className="h-screen" />;
  if (error) return <div className="text-red-500 text-center py-12">Error: {error}</div>;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Your Clients"
        description="Manage your existing clients and their details."
        actions={
          <Button onClick={() => { setSelectedClient(null); setIsAddClientModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add New Client
          </Button>
        }
      />
      {selectedClient ? (
        <ClientDetailView client={selectedClient} onClose={() => setSelectedClient(null)} />
      ) : (
        <ClientList clients={clients} onViewDetails={handleViewDetails} />
      )}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => { setIsAddClientModalOpen(false); setSelectedClient(null); fetchClients(); }}
        client={selectedClient}
      />
    </div>
  );
}
