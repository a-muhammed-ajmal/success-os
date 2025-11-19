'use client';

import { ImportantDateCard } from '@/components/relationship/ImportantDateCard';
import { RelationshipExpenseCard } from '@/components/relationship/RelationshipExpenseCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRelationshipStore } from '@/store/relationshipStore';
import { Calendar, DollarSign, Heart, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RelationshipPage() {
  const {
    importantDates,
    futurePlans,
    relationshipExpenses,
    isLoading,
    error,
    fetchImportantDates,
    fetchFuturePlans,
    fetchRelationshipExpenses,
  } = useRelationshipStore();

  const [activeTab, setActiveTab] = useState('dates');

  useEffect(() => {
    fetchImportantDates();
    fetchFuturePlans();
    fetchRelationshipExpenses();
  }, [fetchImportantDates, fetchFuturePlans, fetchRelationshipExpenses]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  const upcomingDates = importantDates.filter(date => {
    const dateObj = new Date(date.date);
    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SectionHeader
        title="Relationships"
        description="Manage important dates, future plans, and relationship expenses"
        actions={
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Date
            </Button>
            <Button variant="outline">
              <Heart className="mr-2 h-4 w-4" />
              Add Plan
            </Button>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dates" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Important Dates
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Future Plans
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Expenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              {importantDates.length === 0 ? (
                <EmptyState
                  title="No Important Dates"
                  description="Add birthdays, anniversaries, and other important dates to stay connected."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {importantDates.map((date) => (
                    <ImportantDateCard key={date.id} date={date} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {upcomingDates.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upcoming (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingDates.map((date) => (
                    <ImportantDateCard key={date.id} date={date} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Future Plans</CardTitle>
            </CardHeader>
            <CardContent>
              {futurePlans.length === 0 ? (
                <EmptyState
                  title="No Future Plans"
                  description="Plan for vacations, events, and special moments with loved ones."
                />
              ) : (
                <div className="space-y-4">
                  {futurePlans.map((plan) => (
                    <Card key={plan.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{plan.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {plan.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-muted-foreground">
                                Target: {new Date(plan.target_date).toLocaleDateString()}
                              </span>
                              <span className={`font-medium ${
                                plan.priority === 'high' ? 'text-red-500' :
                                plan.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                              }`}>
                                {plan.priority} priority
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Relationship Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {relationshipExpenses.length === 0 ? (
                <EmptyState
                  title="No Relationship Expenses"
                  description="Track gifts, dates, and other expenses related to relationships."
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relationshipExpenses.map((expense) => (
                    <RelationshipExpenseCard key={expense.id} expense={expense} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
