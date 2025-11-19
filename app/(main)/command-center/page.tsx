// app/(main)/command-center/page.tsx
'use client';

import { DailyDisciplineBank } from '@/components/command-center/DailyDisciplineBank';
import { DailyMotivation } from '@/components/command-center/DailyMotivation';
import { PrioritiesBlock } from '@/components/command-center/PrioritiesBlock';
import { QuickAddTransaction } from '@/components/command-center/QuickAddTransaction';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

// Assuming seedUserData exists in '@/lib/seedData'
// import { seedUserData } from '@/lib/seedData'; // Uncomment if you implement seed data logic

export default function CommandCenterPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setIsReady(true);
        // Seed data on first load if necessary (logic to be implemented in seedData.ts)
        // try {
        //   await seedUserData(user.id);
        // } catch (err) {
        //   console.error('Failed to seed data:', err);
        // }
      } else {
        // Sign in anonymously if no user
        const { data } = await supabase.auth.signInAnonymously();
        if (data.user) {
          setUserId(data.user.id);
          setIsReady(true);
          // Seed data for new user if necessary
          // try {
          //   await seedUserData(data.user.id);
          // } catch (err) {
          //   console.error('Failed to seed data:', err);
          // }
        }
      }
    };

    initializeUser();
  }, []);

  if (!isReady) {
    return (
      <LoadingSpinner className="h-screen" />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Command Center" description="Your daily overview and quick actions." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priorities Block */}
        <div className="lg:col-span-2">
          <PrioritiesBlock />
        </div>

        {/* Daily Motivation */}
        <DailyMotivation />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Add Transaction */}
        <QuickAddTransaction />

        {/* Daily Discipline Bank */}
        <DailyDisciplineBank />
      </div>

      {/* Placeholder for other Command Center widgets */}
      {/* Example structure, uncomment and implement as needed */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Events</h2>
          <p className="text-foreground-muted">No upcoming events.</p>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Health Metrics</h2>
          <p className="text-foreground-muted">No health data.</p>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">Learning Progress</h2>
          <p className="text-foreground-muted">No learning data.</p>
        </div>
      </div> */}
    </div>
  );
}
