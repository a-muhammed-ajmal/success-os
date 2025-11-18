'use client';

import { Button } from 'components/ui/button';
import { useEffect, useState } from 'react';
import { commandCenterService } from 'src/services/commandCenterService';
import type { Affirmation } from 'src/types';

export function DisciplineBankBlock() {
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
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Discipline Bank</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Discipline Bank</h3>

      {/* Add new affirmation */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newAffirmation}
          onChange={(e) => setNewAffirmation(e.target.value)}
          placeholder="Add a new affirmation..."
          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          onKeyPress={(e) => e.key === 'Enter' && handleAddAffirmation()}
        />
        <Button onClick={handleAddAffirmation} size="sm">
          Add
        </Button>
      </div>

      {/* Affirmations list */}
      {affirmations.length === 0 ? (
        <p className="text-foreground-muted text-sm">
          No affirmations yet. Add your first one above!
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {affirmations.map((affirmation) => (
            <div key={affirmation.id} className="p-3 bg-background border border-border rounded-lg">
              <p className="text-foreground">{affirmation.text}</p>
              {affirmation.category && (
                <span className="text-xs text-foreground-muted mt-1 inline-block">
                  {affirmation.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
