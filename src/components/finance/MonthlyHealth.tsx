'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

export function MonthlyHealth() {
  // Mock data - replace with real data
  const stats = {
    totalIncome: 5000,
    totalExpense: 3200,
    netCashFlow: 1800,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-foreground-secondary">
            Total Income
          </CardTitle>
          <TrendingUp className="w-4 h-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            ${stats.totalIncome.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-foreground-secondary">
            Total Expense
          </CardTitle>
          <TrendingDown className="w-4 h-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">
            ${stats.totalExpense.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-foreground-secondary">
            Net Cash Flow
          </CardTitle>
          <DollarSign className="w-4 h-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${stats.netCashFlow.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}