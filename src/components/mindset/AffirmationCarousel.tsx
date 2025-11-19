'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const affirmations = [
  'I am focused and disciplined',
  'I am a master of my finances',
  'I execute flawlessly',
  'I am confident in my abilities',
  'I close deals with ease',
  'I am productive and efficient',
  'Money flows to me naturally',
  'I am unstoppable',
  'I create value for my clients',
  'I am building wealth daily',
];

export function AffirmationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
      <CardContent className="p-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center space-y-4 flex-1">
            <p className="text-2xl font-bold text-foreground leading-relaxed">
              "{affirmations[currentIndex]}"
            </p>
            <div className="flex justify-center gap-2">
              {affirmations.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-6'
                      : 'bg-border hover:bg-border-hover'
                  }`}
                />
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}