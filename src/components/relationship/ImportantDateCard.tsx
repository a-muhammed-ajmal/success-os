import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImportantDate } from '@/types';
import { Calendar, Heart } from 'lucide-react';
import React from 'react';

interface ImportantDateCardProps {
  date: ImportantDate;
  onEdit?: (date: ImportantDate) => void;
  onDelete?: (id: string) => void;
}

export const ImportantDateCard: React.FC<ImportantDateCardProps> = ({
  date,
  onEdit,
  onDelete,
}) => {
  const dateObj = new Date(date.date);
  const today = new Date();
  const isToday = dateObj.toDateString() === today.toDateString();
  const isPast = dateObj < today;
  const daysUntil = Math.ceil((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`h-full ${isToday ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {date.person_name}
          </CardTitle>
          <Badge variant={date.type === 'birthday' ? 'default' : 'secondary'}>
            {date.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>

        {date.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {date.notes}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm">
            {isToday ? (
              <Badge variant="default" className="bg-green-500">
                <Heart className="h-3 w-3 mr-1" />
                Today!
              </Badge>
            ) : isPast ? (
              <span className="text-muted-foreground">
                {Math.abs(daysUntil)} days ago
              </span>
            ) : (
              <span className="text-muted-foreground">
                In {daysUntil} days
              </span>
            )}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(date)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(date.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
