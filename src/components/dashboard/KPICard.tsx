interface KPICardProps {
  title: string;
  value: string | number;
  color: 'blue' | 'red' | 'green';
}

export default function KPICard({ title, value, color }: KPICardProps) {
  const colorMap = {
    blue: 'bg-deals-processing',
    red: 'bg-days-remaining',
    green: 'bg-done-successfully',
  };

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className={`h-1.5 ${colorMap[color]}`} />
      <div className="p-3 md:p-4">
        <p className="text-[10px] md:text-xs text-gray-600 mb-1.5">{title}</p>
        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
