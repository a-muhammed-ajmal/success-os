'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Zap } from 'lucide-react';

interface VisionItem {
  id: string;
  title: string;
  content: string;
  category: string;
  type: '1y' | '5y' | '10y';
}

const mockVisionItems: VisionItem[] = [
  {
    id: '1',
    title: 'Financial Freedom',
    content: 'Build passive income streams generating $10k/month',
    category: 'Finance',
    type: '1y',
  },
  {
    id: '2',
    title: 'Business Growth',
    content: 'Scale business to $1M annual revenue',
    category: 'Business',
    type: '5y',
  },
  {
    id: '3',
    title: 'Personal Development',
    content: 'Master 3 new skills and become an industry expert',
    category: 'Growth',
    type: '10y',
  },
];

const typeConfig = {
  '1y': { label: '1 Year', icon: Zap, color: 'text-yellow-400' },
  '5y': { label: '5 Year', icon: TrendingUp, color: 'text-blue-400' },
  '10y': { label: '10 Year', icon: Target, color: 'text-purple-400' },
};

export function VisionBoard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Vision Board</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockVisionItems.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground-secondary">
                  {item.content}
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">{item.category}</Badge>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}