// app/(main)/command-center/page.tsx
'use client';

import { DailyDisciplineBank } from '@/components/command-center/DailyDisciplineBank';
import { DailyMotivation } from '@/components/command-center/DailyMotivation';
import { PrioritiesBlock } from '@/components/command-center/PrioritiesBlock';
import { QuickAddTransaction } from '@/components/command-center/QuickAddTransaction';
import { supabase } from '@/lib/supabase/client'; // Corrected import
import { useEffect, useState } from 'react';

// Assuming these components and services exist and are functional
// This page primarily orchestrates the display of Command Center widgets.

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground-muted">Loading Command Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Command Center</h1>

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
