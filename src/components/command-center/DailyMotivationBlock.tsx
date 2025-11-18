'use client';

import { useEffect, useState } from 'react';
import { commandCenterService } from 'src/services/commandCenterService';
import type { Motivation } from 'src/types';

export function DailyMotivationBlock() {
  const [motivation, setMotivation] = useState<Motivation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomMotivation();
  }, []);

  const loadRandomMotivation = async () => {
    try {
      const data = await commandCenterService.getRandomMotivation();
      setMotivation(data);
    } catch (error) {
      console.error('Error loading motivation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Daily Motivation</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-secondary border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Daily Motivation</h3>
      {motivation ? (
        <div className="space-y-3">
          <blockquote className="text-foreground italic text-lg">
            "{motivation.quote}"
          </blockquote>
          {motivation.author && (
            <cite className="text-foreground-muted text-sm">— {motivation.author}</cite>
          )}
        </div>
      ) : (
        <p className="text-foreground-muted text-sm">
          Add some motivational quotes to inspire your day!
        </p>
      )}
    </div>
  );
}
