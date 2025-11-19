import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Motivation } from '@/types';
import { ExternalLink, Play } from 'lucide-react';
import React from 'react';

interface MotivationCardProps {
  motivation: Motivation;
  onEdit?: (motivation: Motivation) => void;
  onDelete?: (id: string) => void;
}

export const MotivationCard: React.FC<MotivationCardProps> = ({
  motivation,
  onEdit,
  onDelete,
}) => {
  const handlePlay = () => {
    if (motivation.url) {
      window.open(motivation.url, '_blank');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {motivation.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2">
            {motivation.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {motivation.content}
        </p>

        {motivation.url && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlay}
              className="flex items-center gap-2"
            >
              {motivation.type === 'video' ? (
                <Play className="h-4 w-4" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {motivation.type === 'video' ? 'Watch' : 'View'}
            </Button>
          </div>
        )}

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(motivation)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(motivation.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
