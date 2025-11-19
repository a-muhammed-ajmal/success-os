import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VisionItem } from '@/types';
import { Calendar, CheckCircle, Circle, Target, TrendingUp } from 'lucide-react';
import React from 'react';

interface VisionItemCardProps {
  item: VisionItem;
  onEdit?: (item: VisionItem) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: VisionItem['status']) => void;
}

export const VisionItemCard: React.FC<VisionItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusIcon = (status: VisionItem['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'goal':
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: VisionItem['status']) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800';
      case 'goal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2 flex items-center gap-2">
            {getStatusIcon(item.status)}
            {item.title}
          </CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline">{item.category}</Badge>
            <Badge className={getStatusColor(item.status)}>
              {item.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary">{item.priority}</Badge>
          {item.target_date && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(item.target_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {onStatusChange && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextStatus = item.status === 'dream' ? 'goal' :
                                 item.status === 'goal' ? 'achieved' : 'dream';
                onStatusChange(item.id, nextStatus);
              }}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Progress
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(item)}
            >
              Edit
            </Button>
          )}

          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
