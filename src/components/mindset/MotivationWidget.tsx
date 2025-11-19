import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMindsetStore } from '@/store/mindsetStore';
import { Motivation } from '@/types';
import { ExternalLink, Play, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const MotivationWidget: React.FC = () => {
  const { getRandomMotivation, isLoading } = useMindsetStore();
  const [currentMotivation, setCurrentMotivation] = useState<Motivation | null>(null);

  const loadRandomMotivation = () => {
    const motivation = getRandomMotivation();
    setCurrentMotivation(motivation);
  };

  useEffect(() => {
    loadRandomMotivation();
  }, []);

  const handlePlay = () => {
    if (currentMotivation?.url) {
      window.open(currentMotivation.url, '_blank');
    }
  };

  if (!currentMotivation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Daily Motivation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No motivations available. Add some to get inspired!
            </p>
            <Button onClick={loadRandomMotivation} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Daily Motivation</span>
            <Badge variant="secondary">{currentMotivation.type}</Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRandomMotivation}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">{currentMotivation.title}</h3>
        <p className="text-muted-foreground">{currentMotivation.content}</p>

        {currentMotivation.url && (
          <Button
            variant="outline"
            onClick={handlePlay}
            className="flex items-center gap-2"
          >
            {currentMotivation.type === 'video' ? (
              <Play className="h-4 w-4" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            {currentMotivation.type === 'video' ? 'Watch Video' : 'View Link'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
