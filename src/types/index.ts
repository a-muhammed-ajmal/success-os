// src/types/index.ts

// ============================================================================
// USER & AUTH
// ============================================================================
export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PROJECTS & TASKS
// ============================================================================
export interface Project {
  id: string;
  user_id: string;
  name: string;
  category: 'finance' | 'business' | 'relationship' | 'personal' | 'health';
  color: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  project?: Project; // Joined project data
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string | null; // ISO date string
  due_date: string | null;   // ISO date string
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  projectId?: string;
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// ============================================================================
// BUSINESS & SALES
// ============================================================================
export type LeadStage = 'new' | 'contacted' | 'meeting' | 'submitted' | 'approved' | 'rejected';

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
  notes: string | null;
  value: number | null;
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
  contact_details: Record<string, any> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'follow-up';

export interface Interaction {
  id: string;
  user_id: string;
  lead_id: string | null;
  client_id: string | null;
  type: InteractionType;
  subject: string | null;
  content: string;
  interaction_date: string; // ISO date string
  created_at: string;
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
  features: Record<string, any> | null;
  brochure_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SalesProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  goal: string | null;
  target_revenue: number | null;
  start_date: string | null; // ISO date string
  end_date: string | null;   // ISO date string
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FINANCE
// ============================================================================
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string | null;
  description: string | null;
  date: string; // ISO date string
  payment_method: string | null;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export type SavingGoalPriority = 'low' | 'medium' | 'high';

export interface SavingGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null; // ISO date string
  category: string | null;
  priority: SavingGoalPriority;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  month: string; // ISO date string (first day of month)
  category: string;
  allocated_amount: number;
  spent_amount: number;
  created_at: string;
  updated_at: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netCashFlow: number;
  incomeByCategory: Record<string, number>;
  expenseByCategory: Record<string, number>;
}

export interface FinanceStore {
  transactions: Transaction[];
  savingGoals: SavingGoal[];
  budgets: Budget[];
  monthlyStats: MonthlyStats;
  selectedMonth: Date;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (month?: Date) => Promise<void>;
  addTransaction: (transaction: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchSavingGoals: () => Promise<void>;
  addSavingGoal: (goal: Partial<SavingGoal>) => Promise<void>;
  updateSavingGoal: (id: string, updates: Partial<SavingGoal>) => Promise<void>;
  deleteSavingGoal: (id: string) => Promise<void>;
  fetchBudgets: (month: Date) => Promise<void>;
  setBudget: (category: string, amount: number, month: Date) => Promise<void>;
  setSelectedMonth: (month: Date) => void;
  calculateMonthlyStats: (month: Date) => Promise<void>;
}


// ============================================================================
// HABITS
// ============================================================================
export type RoutineType = 'morning' | 'work' | 'evening' | 'daily' | 'custom';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  routine_type: RoutineType | null;
  description: string | null;
  frequency: 'daily' | 'weekly' | 'custom';
  target_days_per_week: number;
  is_active: boolean;
  color: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  date: string; // ISO date string
  completed: boolean;
  notes: string | null;
  created_at: string;
}

export interface HabitProgress {
  habitId: string;
  weeklyProgress: number;
  monthlyProgress: number;
  currentStreak: number;
  longestStreak: number;
}

export interface HabitStore {
  habits: Habit[];
  completions: Record<string, boolean>;
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  addHabit: (habit: Partial<Habit>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  reorderHabits: (habitIds: string[]) => Promise<void>;
  fetchCompletions: (startDate: Date, endDate: Date) => Promise<void>;
  toggleHabitCompletion: (habitId: string, date: Date) => Promise<void>;
  addHabitNote: (habitId: string, date: Date, note: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  getHabitsByRoutine: (routineType: RoutineType) => Habit[];
  getCompletionStatus: (habitId: string, date: Date) => boolean;
  getWeeklyProgress: (habitId: string, weekStart: Date) => number;
  getMonthlyProgress: (habitId: string, month: Date) => number;
  getCurrentStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
}

// ============================================================================
// MINDSET & GROWTH
// ============================================================================
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

export interface MindsetStore {
  affirmations: Affirmation[];
  motivations: Motivation[];
  currentMotivation: Motivation | null;
  isLoading: boolean;
  error: string | null;
  fetchAffirmations: () => Promise<void>;
  addAffirmation: (affirmation: Partial<Affirmation>) => Promise<void>;
  updateAffirmation: (id: string, updates: Partial<Affirmation>) => Promise<void>;
  deleteAffirmation: (id: string) => Promise<void>;
  reorderAffirmations: (affirmationIds: string[]) => Promise<void>;
  fetchMotivations: () => Promise<void>;
  addMotivation: (motivation: Partial<Motivation>) => Promise<void>;
  getRandomMotivation: (category?: string) => void;
  getActiveAffirmations: () => Affirmation[];
  getAffirmationsByCategory: (category: string) => Affirmation[];
}

// ============================================================================
// RELATIONSHIP
// ============================================================================
export type ImportantDateType = 'birthday' | 'anniversary' | 'celebration' | 'other';

export interface ImportantDate {
  id: string;
  user_id: string;
  person_name: string;
  relationship: string | null;
  type: ImportantDateType;
  date: string; // ISO date string
  recurring: boolean;
  reminder_days_before: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type FuturePlanType = 'trip' | 'celebration' | 'family_goal' | 'other';

export interface FuturePlan {
  id: string;
  user_id: string;
  title: string;
  type: FuturePlanType | null;
  description: string | null;
  target_date: string | null; // ISO date string
  estimated_cost: number | null;
  status: 'planning' | 'booked' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RelationshipExpense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string | null;
  person_name: string | null;
  date: string; // ISO date string
  notes: string | null;
  created_at: string;
}

export interface RelationshipStore {
  importantDates: ImportantDate[];
  futurePlans: FuturePlan[];
  relationshipExpenses: RelationshipExpense[];
  upcomingDates: ImportantDate[];
  isLoading: boolean;
  error: string | null;
  fetchImportantDates: () => Promise<void>;
  addImportantDate: (date: Partial<ImportantDate>) => Promise<void>;
  updateImportantDate: (id: string, updates: Partial<ImportantDate>) => Promise<void>;
  deleteImportantDate: (id: string) => Promise<void>;
  fetchFuturePlans: () => Promise<void>;
  addFuturePlan: (plan: Partial<FuturePlan>) => Promise<void>;
  updateFuturePlan: (id: string, updates: Partial<FuturePlan>) => Promise<void>;
  deleteFuturePlan: (id: string) => Promise<void>;
  fetchRelationshipExpenses: (startDate?: Date, endDate?: Date) => Promise<void>;
  addRelationshipExpense: (expense: Partial<RelationshipExpense>) => Promise<void>;
  deleteRelationshipExpense: (id: string) => Promise<void>;
  updateUpcomingDates: () => void;
  getDatesByType: (type: string) => ImportantDate[];
  getExpensesByCategory: () => Record<string, number>;
  getTotalExpenses: (startDate?: Date, endDate?: Date) => number;
}


// ============================================================================
// PLANNING & REFLECTION
// ============================================================================
export type VisionItemType = 'vision' | 'goal_1y' | 'goal_5y' | 'goal_10y';

export interface VisionItem {
  id: string;
  user_id: string;
  type: VisionItemType;
  category: string | null;
  title: string;
  content: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start: string; // ISO date string
  week_end: string;   // ISO date string
  what_went_well: string | null;
  what_didnt: string | null;
  learnings: string | null;
  key_metrics: Record<string, any> | null;
  wins: string[];
  challenges: string[];
  next_week_focus: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlyPlan {
  id: string;
  user_id: string;
  month: string; // ISO date string (first day of month)
  goals: string[];
  focus_categories: string[];
  key_objectives: string | null;
  success_criteria: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanningStore {
  visionItems: VisionItem[];
  weeklyReviews: WeeklyReview[];
  monthlyPlans: MonthlyPlan[];
  currentWeekReview: WeeklyReview | null;
  currentMonthPlan: MonthlyPlan | null;
  isLoading: boolean;
  error: string | null;
  fetchVisionItems: () => Promise<void>;
  addVisionItem: (item: Partial<VisionItem>) => Promise<void>;
  updateVisionItem: (id: string, updates: Partial<VisionItem>) => Promise<void>;
  deleteVisionItem: (id: string) => Promise<void>;
  reorderVisionItems: (itemIds: string[]) => Promise<void>;
  fetchWeeklyReviews: (limit?: number) => Promise<void>;
  getWeeklyReview: (weekStart: Date) => Promise<void>;
  saveWeeklyReview: (review: Partial<WeeklyReview>) => Promise<void>;
  fetchMonthlyPlans: (limit?: number) => Promise<void>;
  getMonthlyPlan: (month: Date) => Promise<void>;
  saveMonthlyPlan: (plan: Partial<MonthlyPlan>) => Promise<void>;
  getVisionByType: (type: string) => VisionItem[];
  getVisionByCategory: (category: string) => VisionItem[];
  getRecentReviews: (limit: number) => WeeklyReview[];
}


// ============================================================================
// UI Store & General
// ============================================================================
export interface UIStore {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
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
  fetchLeads: () => Promise<void>;
  addLead: (lead: Partial<Lead>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStage: (leadId: string, stage: LeadStage) => Promise<void>;
  convertLeadToClient: (leadId: string) => Promise<void>;
  fetchClients: () => Promise<void>;
  addClient: (client: Partial<Client>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  fetchInteractions: (leadId?: string, clientId?: string) => Promise<void>;
  addInteraction: (interaction: Partial<Interaction>) => Promise<void>;
  deleteInteraction: (id: string) => Promise<void>;
  fetchServices: () => Promise<void>;
  addService: (service: Partial<Service>) => Promise<void>;
  updateService: (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  uploadBrochure: (serviceId: string, file: File) => Promise<string>;
  fetchSalesProjects: () => Promise<void>;
  addSalesProject: (project: Partial<SalesProject>) => Promise<void>;
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedClient: (client: Client | null) => void;
  getLeadsByStage: (stage: LeadStage) => Lead[];
  getLeadCountByStage: () => Record<LeadStage, number>;
  getTotalPipelineValue: () => number;
  getRecentInteractions: (limit: number) => Interaction[];
  getActiveServices: () => Service[];
}
