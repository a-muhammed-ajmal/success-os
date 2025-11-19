export interface User {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  category: "finance" | "business" | "relationship" | "personal" | "health";
  color: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  project?: Project;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface Affirmation {
  id: string;
  user_id: string;
  text: string;
  category: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Motivation {
  id: string;
  user_id: string;
  quote: string;
  author: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
}

// Business & Sales CRM Types
export type LeadStage = 'new' | 'contacted' | 'meeting' | 'submitted' | 'approved' | 'rejected';

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'follow-up';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  product_interest: string | null;
  stage: LeadStage;
  next_step: string | null;
  value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  lead_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  user_id: string;
  lead_id: string | null;
  client_id: string | null;
  type: InteractionType;
  subject: string | null;
  content: string;
  interaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  description: string | null;
  eligibility: string | null;
  required_documents: string[];
  interest_rate: string | null;
  features: Record<string, string>;
  brochure_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalesProject {
  id: string;
  user_id: string;
  lead_id: string | null;
  client_id: string | null;
  name: string;
  description: string | null;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  value: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessStore {
  leads: Lead[];
  clients: Client[];
  services: Service[];
  interactions: Interaction[];
  salesProjects: SalesProject[];
  selectedLead: Lead | null;
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;

  // Actions - Leads
  fetchLeads: () => Promise<void>;
  addLead: (lead: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStage: (leadId: string, stage: LeadStage) => Promise<void>;
  convertLeadToClient: (leadId: string) => Promise<void>;

  // Actions - Clients
  fetchClients: () => Promise<void>;
  addClient: (client: Partial<Client>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  // Actions - Interactions
  fetchInteractions: (leadId?: string, clientId?: string) => Promise<void>;
  addInteraction: (interaction: Partial<Interaction>) => Promise<void>;
  deleteInteraction: (id: string) => Promise<void>;

  // Actions - Services
  fetchServices: () => Promise<void>;
  addService: (service: Partial<Service>) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;

  // Actions - Sales Projects
  fetchSalesProjects: () => Promise<void>;
  addSalesProject: (project: Partial<SalesProject>) => Promise<void>;

  // Selection
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedClient: (client: Client | null) => void;

  // Computed
  getLeadsByStage: (stage: LeadStage) => Lead[];
  getLeadCountByStage: () => Record<LeadStage, number>;
  getTotalPipelineValue: () => number;
  getRecentInteractions: (limit: number) => Interaction[];
  getActiveServices: () => Service[];
}
