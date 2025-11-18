'use client';

import { useEffect, useState } from 'react';
import { commandCenterService } from 'src/services/commandCenterService';
import type { Motivation } from 'src/types';

export function DailyMotivation() {
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
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (!motivation) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">No motivations yet. Add some inspiring quotes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <blockquote className="text-gray-200 italic text-lg">
        "{motivation.quote}"
      </blockquote>
      {motivation.author && (
        <cite className="text-gray-500 text-sm">— {motivation.author}</cite>
      )}
    </div>
  );
}
