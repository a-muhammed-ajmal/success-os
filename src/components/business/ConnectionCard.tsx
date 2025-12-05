import SlimCard from '../ui/SlimCard';
import QuickActions from '../ui/QuickActions';
import type { Connection } from '../../types/database';

interface ConnectionCardProps {
  connection: Connection;
  onClick: () => void;
}

export default function ConnectionCard({ connection, onClick }: ConnectionCardProps) {
  const line1 = connection.full_name;
  const line2 = `${connection.designation || 'N/A'} | ${connection.employment_status || 'N/A'}`;
  const line3 = connection.company_name || 'No company';

  return (
    <SlimCard
      line1={line1}
      line2={line2}
      line3={line3}
      onClick={onClick}
      quickActions={
        <QuickActions
          mobile={connection.mobile_number}
          whatsapp={connection.whatsapp_number}
          email={connection.email}
        />
      }
    />
  );
}
