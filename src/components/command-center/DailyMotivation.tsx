// src/components/command-center/DailyMotivation.tsx
'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // CORRECTED
import { Button } from '@/components/ui/button'; // CORRECTED
import { commandCenterService } from '@/services/commandCenterService'; // CORRECTED
import type { Motivation } from '@/types'; // CORRECTED
import { RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DailyMotivationProps {
  // Add any props if needed
}

export function DailyMotivation({}: DailyMotivationProps) {
  const [motivation, setMotivation] = useState<Motivation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomMotivation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commandCenterService.getRandomMotivation();
      setMotivation(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMotivation();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm h-full flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-semibold text-foreground mb-4">Daily Motivation</h2>
      {motivation ? (
        <>
          <p className="text-lg font-medium text-foreground mb-4">
            "{motivation.quote}"
          </p>
          {motivation.author && (
            <p className="text-sm text-foreground-muted mb-4">
              - {motivation.author}
            </p>
          )}
          <Button onClick={fetchRandomMotivation} disabled={isLoading}>
            {isLoading ? <LoadingSpinner className="h-4 w-4" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
            Refresh Quote
          </Button>
        </>
      ) : (
        <p className="text-foreground-muted">No motivation available.</p>
      )}
    </div>
  );
}
