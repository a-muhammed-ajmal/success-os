// src/components/business/LeadsWidgetGrid.tsx
'use client';

import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useBusinessStore } from '@/store/businessStore';
import { LeadStage } from '@/types';
import { CalendarCheck, CheckCircle, FileText, Phone, Plus, XCircle } from 'lucide-react'; // Changed 'New' to 'Plus'
import { useRouter } from 'next/navigation';
import { LeadsWidget } from './LeadsWidget';

const stageConfig = {
  new: { icon: Plus, color: 'text-gray-500', title: 'New Leads' }, // Changed icon from New to Plus
  contacted: { icon: Phone, color: 'text-blue-500', title: 'Contacted' },
  meeting: { icon: CalendarCheck, color: 'text-yellow-500', title: 'Meetings' },
  submitted: { icon: FileText, color: 'text-purple-500', title: 'Proposals' },
  approved: { icon: CheckCircle, color: 'text-green-500', title: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-500', title: 'Rejected' },
};

export function LeadsWidgetGrid() {
  const { leads, isLoading, error, getLeadCountByStage } = useBusinessStore();
  const router = useRouter();
  const leadCounts = getLeadCountByStage();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const totalLeads = leads.length;

  if (totalLeads === 0) {
    return <EmptyState description="No leads added yet. Start by adding a new lead!" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Object.entries(stageConfig).map(([stage, config]) => (
        <LeadsWidget
          key={stage}
          title={config.title}
          count={leadCounts[stage as LeadStage] || 0}
          icon={config.icon}
          color={config.color}
          onClick={() => router.push('/business/leads')}
        />
      ))}
    </div>
  );
}
