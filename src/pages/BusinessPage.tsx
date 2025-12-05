import { useState } from 'react';
import LeadsPage from '../components/business/LeadsPage';
import DealsPage from '../components/business/DealsPage';
import ConnectionsPage from '../components/business/ConnectionsPage';

type TabType = 'leads' | 'deals' | 'connections';

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState<TabType>('leads');

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'leads', label: 'Leads' },
    { id: 'deals', label: 'Deals' },
    { id: 'connections', label: 'Connections' },
  ];

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto pb-20 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Business & Sales</h1>
        <p className="text-gray-600 text-sm">Manage your leads, deals, and professional connections</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'leads' && <LeadsPage />}
        {activeTab === 'deals' && <DealsPage />}
        {activeTab === 'connections' && <ConnectionsPage />}
      </div>
    </div>
  );
}
