'use client';

import { Button } from 'components/ui/button';
import { useEffect, useState } from 'react';
import { commandCenterService } from 'src/services/commandCenterService';
import type { Affirmation } from 'src/types';

interface DailyDisciplineBankProps {
  focusTheme?: string;
  onGenerateAffirmation?: () => void;
}

export function DailyDisciplineBank({ focusTheme, onGenerateAffirmation }: DailyDisciplineBankProps) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAffirmation, setNewAffirmation] = useState('');

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = async () => {
    try {
      const data = await commandCenterService.getActiveAffirmations();
      setAffirmations(data);
    } catch (error) {
      console.error('Error loading affirmations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAffirmation = async () => {
    if (!newAffirmation.trim()) return;

    try {
      await commandCenterService.addAffirmation(newAffirmation.trim());
      setNewAffirmation('');
      await loadAffirmations();
    } catch (error) {
      console.error('Error adding affirmation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add new affirmation */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newAffirmation}
          onChange={(e) => setNewAffirmation(e.target.value)}
          placeholder="Add a new affirmation..."
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyPress={(e) => e.key === 'Enter' && handleAddAffirmation()}
        />
        <Button onClick={handleAddAffirmation} size="sm">
          Add
        </Button>
      </div>

      {/* Affirmations list */}
      {affirmations.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No affirmations yet. Add your first one above!
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {affirmations.map((affirmation) => (
            <div key={affirmation.id} className="p-3 bg-gray-900 border border-gray-700 rounded-lg">
              <p className="text-gray-200">{affirmation.text}</p>
              {affirmation.category && (
                <span className="text-xs text-gray-500 mt-1 inline-block">
                  {affirmation.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Generate AI Affirmation Button */}
      {onGenerateAffirmation && (
        <Button
          onClick={onGenerateAffirmation}
          variant="outline"
          className="w-full"
        >
          Generate AI Affirmation
        </Button>
      )}
    </div>
  );
}
