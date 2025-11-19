'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { formatCurrency } from '../../lib/utils';
import { useFinanceStore } from '../../store/financeStore';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function IncomeExpenseBreakdown() {
  const { monthlyStats, isLoading, error, selectedMonth, calculateMonthlyStats } = useFinanceStore();

  useEffect(() => {
    calculateMonthlyStats(selectedMonth);
  }, [selectedMonth, calculateMonthlyStats]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const incomeCategories = Object.entries(monthlyStats.incomeByCategory).sort(([, a], [, b]) => b - a);
  const expenseCategories = Object.entries(monthlyStats.expenseByCategory).sort(([, a], [, b]) => b - a);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="mt-4">
            {incomeCategories.length === 0 ? (
              <EmptyState title="No Income Recorded" description="Add some income transactions to see a breakdown." />
            ) : (
              <div className="space-y-3">
                {incomeCategories.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-foreground">{category}</span>
                    </div>
                    <span className="text-green-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="expenses" className="mt-4">
            {expenseCategories.length === 0 ? (
              <EmptyState title="No Expenses Recorded" description="Add some expense transactions to see a breakdown." />
            ) : (
              <div className="space-y-3">
                {expenseCategories.map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-400" />
                      <span className="font-medium text-foreground">{category}</span>
                    </div>
                    <span className="text-red-400 font-semibold">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
