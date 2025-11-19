import { VisionBoard } from '@/components/planning/VisionBoard';
import { WeeklyReview } from '@/components/planning/WeeklyReview';

export default function PlanningPage() {
  return (
    <div className="space-y-8">
      <VisionBoard />
      <WeeklyReview />
    </div>
  );
}