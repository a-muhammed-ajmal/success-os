'use client';

import { DailyDisciplineBank } from 'components/command-center/DailyDisciplineBank';
import { DailyMotivation } from 'components/command-center/DailyMotivation';
import { PrioritiesBlock } from 'components/command-center/PrioritiesBlock';
import { QuickAddTransaction } from 'components/command-center/QuickAddTransaction';
import { supabase } from 'lib/supabase/client';
import { BookOpen, Database, DollarSign, LayoutDashboard, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const ACCENT_COLORS = {
  CommandCenter: 'text-indigo-400',
  MindGrowth: 'text-blue-400',
  FinancialDashboard: 'text-green-400',
  LifeHealth: 'text-red-400',
};

// PageCard Component
const PageCard = ({ 
  title, 
  children, 
  Icon = LayoutDashboard, 
  titleClass = 'text-indigo-400' 
}: any) => (
  <div className="bg-gray-800/70 p-4 sm:p-5 rounded-xl shadow-lg border border-gray-700/50 transition-all duration-300">
    <h3 className={`text-md sm:text-lg font-semibold mb-3 flex items-center ${titleClass}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
      {title}
    </h3>
    <div className="text-sm text-gray-300">
      {children}
    </div>
  </div>
);

export default function CommandCenterPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [isLoadingAffirmation, setIsLoadingAffirmation] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setIsReady(true);
      } else {
        // Sign in anonymously if no user
        const { data } = await supabase.auth.signInAnonymously();
        if (data.user) {
          setUserId(data.user.id);
          setIsReady(true);
        }
      }
    };

    getUser();
  }, []);

  const handleGenerateAffirmation = async () => {
    setIsLoadingAffirmation(true);
    setError('');
    setGeneratedAffirmation('');

    try {
      // TODO: Integrate with Gemini API
      // For now, just show a placeholder
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGeneratedAffirmation('I am focused, disciplined, and financially abundant.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingAffirmation(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center text-indigo-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mr-3"></div>
          <span className="font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      {/* Database Status Indicator */}
      <div className="mb-4 p-2 bg-indigo-900/30 rounded-lg text-xs flex items-center space-x-2 border border-indigo-700/50">
        <Database className="w-3 h-3 text-indigo-400 flex-shrink-0" />
        <span className="text-indigo-300 font-medium">Supabase Ready. User ID:</span>
        <span className="text-gray-300 truncate font-mono" title={userId || ''}>
          {userId}
        </span>
      </div>

      {/* Page Title */}
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-white tracking-tight">
        Command Center
      </h2>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Priorities Block - 2/3 width on desktop */}
        <div className="lg:col-span-2">
          <PageCard 
            title="Priorities Block (Urgent Tasks)" 
            Icon={LayoutDashboard} 
            titleClass={ACCENT_COLORS.CommandCenter}
          >
            <PrioritiesBlock />
          </PageCard>
        </div>

        {/* Right Column Stack */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Daily Motivation */}
          <PageCard 
            title="Daily Motivation" 
            Icon={BookOpen} 
            titleClass={ACCENT_COLORS.MindGrowth}
          >
            <DailyMotivation />
          </PageCard>

          {/* Quick Add */}
          <PageCard 
            title="Quick Add" 
            Icon={DollarSign} 
            titleClass={ACCENT_COLORS.FinancialDashboard}
          >
            <p className="mb-3 text-gray-400 text-xs">Log your transaction:</p>
            <QuickAddTransaction />
          </PageCard>

          {/* Daily Discipline Bank */}
          <PageCard 
            title="Daily Discipline Bank (AI Powered)" 
            Icon={Zap} 
            titleClass={ACCENT_COLORS.LifeHealth}
          >
            <DailyDisciplineBank 
              focusTheme="Financial Discipline"
              onGenerateAffirmation={handleGenerateAffirmation}
            />
            
            {/* Generated Affirmation Display */}
            {generatedAffirmation && (
              <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 font-semibold text-xs">
                  ✨ {generatedAffirmation}
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
          </PageCard>
        </div>
      </div>
    </div>
  );
}
