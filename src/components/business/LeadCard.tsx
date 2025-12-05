import SlimCard from '../ui/SlimCard';
import QuickActions from '../ui/QuickActions';
import type { Lead } from '../../types/database';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const line1 = lead.full_name;
  const line2 = `${lead.designation || 'N/A'} | AED ${lead.salary_amount?.toLocaleString() || 'N/A'}`;
  const line3 = lead.company_name || 'No company';

  return (
    <SlimCard
      line1={line1}
      line2={line2}
      line3={line3}
      onClick={onClick}
      quickActions={
        <QuickActions
          mobile={lead.mobile_number}
          whatsapp={lead.whatsapp_number}
          email={lead.email}
        />
      }
    />
  );
}
