import SlimCard from '../ui/SlimCard';
import QuickActions from '../ui/QuickActions';
import type { Deal } from '../../types/database';
import { getLeadById } from '../../services/leadsService';
import { useState, useEffect } from 'react';

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export default function DealCard({ deal, onClick }: DealCardProps) {
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    if (deal.lead_id) {
      getLeadById(deal.lead_id).then(setLeadData);
    }
  }, [deal.lead_id]);

  const line1 = leadData?.full_name || 'Unknown';
  const line2 = `${leadData?.designation || 'N/A'} | ${deal.application_number || 'No App #'}`;
  const line3 = leadData?.company_name || 'No company';

  return (
    <SlimCard
      line1={line1}
      line2={line2}
      line3={line3}
      onClick={onClick}
      quickActions={
        leadData && (
          <QuickActions
            mobile={leadData.mobile_number}
            whatsapp={leadData.whatsapp_number}
            email={leadData.email}
          />
        )
      }
    />
  );
}
