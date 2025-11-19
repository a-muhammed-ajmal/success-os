'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

export function WeeklyReview() {
  const [wins, setWins] = useState<string[]>(['']);
  const [challenges, setChallenges] = useState<string[]>(['']);

  const addWin = () => setWins([...wins, '']);
  const removeWin = (index: number) => setWins(wins.filter((_, i) => i !== index));
  const updateWin = (index: number, value: string) => {
    const updated = [...wins];
    updated[index] = value;
    setWins(updated);
  };

  const addChallenge = () => setChallenges([...challenges, '']);
  const removeChallenge = (index: number) => setChallenges(challenges.filter((_, i) => i !== index));
  const updateChallenge = (index: number, value: string) => {
    const updated = [...challenges];
    updated[index] = value;
    setChallenges(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Weekly Review</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-400">Wins This Week</CardTitle>
              <Button variant="ghost" size="icon" onClick={addWin}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {wins.map((win, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="What went well?"
                  value={win}
                  onChange={(e) => updateWin(index, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background-tertiary text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {wins.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeWin(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-400">Challenges</CardTitle>
              <Button variant="ghost" size="icon" onClick={addChallenge}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {challenges.map((challenge, index) => (
              <div key={index} className="flex gap-2">
                <input
                  placeholder="What didn't go well?"
                  value={challenge}
                  onChange={(e) => updateChallenge(index, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background-tertiary text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {challenges.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChallenge(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Learnings</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-32 p-3 rounded-lg border border-border bg-background-tertiary text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What did you learn this week?"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Week Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full min-h-32 p-3 rounded-lg border border-border bg-background-tertiary text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="What are your priorities for next week?"
          />
        </CardContent>
      </Card>

      <Button className="w-full">Save Weekly Review</Button>
    </div>
  );
}