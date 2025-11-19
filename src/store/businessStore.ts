import { create } from 'zustand';
import { businessService } from '../services/businessService';
import { BusinessStore, Client, Interaction, Lead, LeadStage, SalesProject, Service } from '../types';

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  leads: [],
  clients: [],
  services: [],
  interactions: [],
  salesProjects: [],
  selectedLead: null,
  selectedClient: null,
  isLoading: false,
  error: null,

  // Actions - Leads
  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await businessService.getLeads();
      set({ leads: data });
    } catch (err: any) {
      set({ error: err.message, leads: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addLead: async (lead: Partial<Lead>) => {
    set({ isLoading: true, error: null });
    try {
      const newLead = await businessService.createLead(lead);
      set((state) => ({
        leads: [newLead, ...state.leads],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLead: async (id: string, updates: Partial<Lead>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await businessService.updateLead(id, updates);
      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === id ? { ...l, ...updatedLead } : l
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLead: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await businessService.deleteLead(id);
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateLeadStage: async (leadId: string, stage: LeadStage) => {
    set({ isLoading: true, error: null });
    try {
      const updatedLead = await businessService.updateLeadStage(leadId, stage);
      set((state) => ({
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, ...updatedLead } : l
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  convertLeadToClient: async (leadId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newClient = await businessService.convertLeadToClient(leadId);
      set((state) => ({
        clients: [...state.clients, newClient],
        leads: state.leads.map((l) =>
          l.id === leadId ? { ...l, stage: 'approved' } : l
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Actions - Clients
  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await businessService.getClients();
      set({ clients: data });
    } catch (err: any) {
      set({ error: err.message, clients: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addClient: async (client: Partial<Client>) => {
    set({ isLoading: true, error: null });
    try {
      const newClient = await businessService.createClient(client);
      set((state) => ({
        clients: [...state.clients, newClient],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateClient: async (id: string, updates: Partial<Client>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedClient = await businessService.updateClient(id, updates);
      set((state) => ({
        clients: state.clients.map((c) =>
          c.id === id ? { ...c, ...updatedClient } : c
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteClient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await businessService.deleteClient(id);
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Actions - Interactions
  fetchInteractions: async (leadId?: string, clientId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await businessService.getInteractions(leadId, clientId);
      set({ interactions: data });
    } catch (err: any) {
      set({ error: err.message, interactions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addInteraction: async (interaction: Partial<Interaction>) => {
    set({ isLoading: true, error: null });
    try {
      const newInteraction = await businessService.createInteraction(interaction);
      set((state) => ({
        interactions: [newInteraction, ...state.interactions],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteInteraction: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await businessService.deleteInteraction(id);
      set((state) => ({
        interactions: state.interactions.filter((i) => i.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Actions - Services
  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await businessService.getServices();
      set({ services: data });
    } catch (err: any) {
      set({ error: err.message, services: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addService: async (service: Partial<Service>) => {
    set({ isLoading: true, error: null });
    try {
      const newService = await businessService.createService(service);
      set((state) => ({
        services: [...state.services, newService],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateService: async (id: string, updates: Partial<Service>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedService = await businessService.updateService(id, updates);
      set((state) => ({
        services: state.services.map((s) =>
          s.id === id ? { ...s, ...updatedService } : s
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await businessService.deleteService(id);
      set((state) => ({
        services: state.services.filter((s) => s.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Actions - Sales Projects
  fetchSalesProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await businessService.getSalesProjects();
      set({ salesProjects: data });
    } catch (err: any) {
      set({ error: err.message, salesProjects: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addSalesProject: async (project: Partial<SalesProject>) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await businessService.createSalesProject(project);
      set((state) => ({
        salesProjects: [...state.salesProjects, newProject],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Selection
  setSelectedLead: (lead: Lead | null) => set({ selectedLead: lead }),
  setSelectedClient: (client: Client | null) => set({ selectedClient: client }),

  // Computed
  getLeadsByStage: (stage: LeadStage) => {
    return get().leads.filter((lead) => lead.stage === stage);
  },
  getLeadCountByStage: () => {
    return get().leads.reduce((acc, lead) => {
      acc[lead.stage] = (acc[lead.stage] || 0) + 1;
      return acc;
    }, {} as Record<LeadStage, number>);
  },
  getTotalPipelineValue: () => {
    return get().leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
  },
  getRecentInteractions: (limit: number) => {
    return get().interactions
      .sort((a, b) => new Date(b.interaction_date).getTime() - new Date(a.interaction_date).getTime())
      .slice(0, limit);
  },
  getActiveServices: () => {
    return get().services.filter((s) => s.is_active);
  },
}));
