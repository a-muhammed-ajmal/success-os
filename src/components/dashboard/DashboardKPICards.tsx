interface DashboardKPICardsProps {
  dealsProcessing: number;
  daysRemaining: number;
  doneSuccessfully: number;
}

import KPICard from './KPICard';

export default function DashboardKPICards({
  dealsProcessing,
  daysRemaining,
  doneSuccessfully
}: DashboardKPICardsProps) {
  return (
    <div className="grid grid-cols-3 gap-1.5 md:gap-4 mb-4">
      <KPICard
        title="Deals Processing"
        value={dealsProcessing}
        color="blue"
      />
      <KPICard
        title="Days Remaining"
        value={daysRemaining}
        color="red"
      />
      <KPICard
        title="Done Successfully"
        value={doneSuccessfully}
        color="green"
      />
    </div>
  );
}
