import { supabase } from '../lib/supabase/client';
import type { Client, Interaction, Lead, LeadStage, SalesProject, Service } from '../types';

export const businessService = {
  // ====================================================================
  // LEADS
  // ====================================================================
  async getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLeadStage(id: string, stage: LeadStage): Promise<Lead> {
    return this.updateLead(id, { stage });
  },

  async deleteLead(id: string): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ====================================================================
  // CLIENTS
  // ====================================================================
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createClient(client: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async convertLeadToClient(leadId: string): Promise<Client> {
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError) throw leadError;
    if (!lead) throw new Error('Lead not found');

    const client = await this.createClient({
      lead_id: leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
    });

    // Update lead stage to approved
    await this.updateLeadStage(leadId, 'approved');

    return client;
  },

  // ====================================================================
  // INTERACTIONS
  // ====================================================================
  async getInteractions(leadId?: string, clientId?: string): Promise<Interaction[]> {
    let query = supabase
      .from('interactions')
      .select('*')
      .order('interaction_date', { ascending: false });

    if (leadId) {
      query = query.eq('lead_id', leadId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async createInteraction(interaction: Partial<Interaction>): Promise<Interaction> {
    const { data, error } = await supabase
      .from('interactions')
      .insert([interaction])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteInteraction(id: string): Promise<void> {
    const { error } = await supabase
      .from('interactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ====================================================================
  // SERVICES
  // ====================================================================
  async getServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async createService(service: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadBrochure(serviceId: string, file: File): Promise<string> {
    const fileName = `${serviceId}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('service-brochures') // Ensure this bucket exists in Supabase Storage
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('service-brochures')
      .getPublicUrl(fileName);

    // Update service with brochure URL
    await this.updateService(serviceId, {
      brochure_url: urlData.publicUrl,
    });

    return urlData.publicUrl;
  },

  // ====================================================================
  // SALES PROJECTS
  // ====================================================================
  async getSalesProjects(): Promise<SalesProject[]> {
    const { data, error } = await supabase
      .from('sales_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSalesProject(project: Partial<SalesProject>): Promise<SalesProject> {
    const { data, error } = await supabase
      .from('sales_projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
