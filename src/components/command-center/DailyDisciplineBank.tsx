// src/components/command-center/DailyDisciplineBank.tsx
'use client';

import { LoadingSpinner } from '@/components/shared/LoadingSpinner'; // CORRECTED
import { Button } from '@/components/ui/button'; // CORRECTED
import { commandCenterService } from '@/services/commandCenterService'; // CORRECTED
import type { Affirmation } from '@/types'; // CORRECTED
import { useEffect, useState } from 'react';

interface DailyDisciplineBankProps {
  // Add any props if needed
}

export function DailyDisciplineBank({}: DailyDisciplineBankProps) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedAffirmation, setGeneratedAffirmation] = useState<string | null>(null);

  const fetchAffirmations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commandCenterService.getAffirmations();
      setAffirmations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAffirmations();
  }, []);

  const handleNextAffirmation = () => {
    setCurrentAffirmationIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
  };

  const handleGenerateAffirmation = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedAffirmation(null);
    try {
      const response = await fetch('/api/generate-affirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusTheme: 'Financial Discipline' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate affirmation');
      }

      const data = await response.json();
      setGeneratedAffirmation(data.affirmation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-background-secondary p-6 rounded-lg shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-semibold text-foreground mb-4">Daily Discipline Bank</h2>
      {affirmations.length === 0 ? (
        <p className="text-foreground-muted flex-grow">No affirmations loaded.</p>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-foreground mb-4">
            "{affirmations[currentAffirmationIndex].text}"
          </p>
          <Button variant="secondary" onClick={handleNextAffirmation} className="mb-4">
            Next Affirmation
          </Button>
        </div>
      )}
      <Button onClick={handleGenerateAffirmation} disabled={isLoading}>
        {isLoading ? <LoadingSpinner className="h-4 w-4" /> : 'Generate AI Affirmation'}
      </Button>
      {generatedAffirmation && (
        <p className="text-sm text-green-400 mt-2 text-center">Generated: "{generatedAffirmation}"</p>
      )}
    </div>
  );
}
