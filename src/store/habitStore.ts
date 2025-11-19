import { habitService } from '@/services/habitService';
import { Habit, HabitStore } from '@/types';
import { eachDayOfInterval, endOfWeek, format } from 'date-fns';
import { create } from 'zustand';

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  completions: {}, // Store as Record<string, boolean> for easy lookup: `${habitId}-${dateString}`
  selectedDate: new Date(), // Used for daily views or filtering
  isLoading: false,
  error: null,

  fetchHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await habitService.getHabits();
      set({ habits: data });
    } catch (err: any) {
      set({ error: err.message, habits: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addHabit: async (habit: Partial<Habit>) => {
    set({ isLoading: true, error: null });
    try {
      const newHabit = await habitService.createHabit(habit);
      set((state) => ({
        habits: [...state.habits, newHabit],
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateHabit: async (id: string, updates: Partial<Habit>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedHabit = await habitService.updateHabit(id, updates);
      set((state) => ({
        habits: state.habits.map((h) =>
          h.id === id ? { ...h, ...updatedHabit } : h
        ),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteHabit: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await habitService.deleteHabit(id);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
      }));
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reorderHabits: async (habitIds: string[]) => {
    // Optimistic update
    set((state) => ({
      habits: habitIds.map((id, index) => {
        const habit = state.habits.find((h) => h.id === id)!;
        return { ...habit, order_index: index };
      }),
    }));
    try {
      await habitService.reorderHabits(habitIds);
    } catch (err: any) {
      set({ error: err.message });
      // Revert if error (optional)
      get().fetchHabits();
    }
  },

  fetchCompletions: async (startDate: Date, endDate: Date) => {
    set({ isLoading: true, error: null });
    try {
      const data = await habitService.getCompletions(startDate, endDate);
      const completionsMap = data.reduce((acc, comp) => {
        acc[`${comp.habit_id}-${format(new Date(comp.date), 'yyyy-MM-dd')}`] = comp.completed;
        return acc;
      }, {} as Record<string, boolean>);
      set({ completions: completionsMap });
    } catch (err: any) {
      set({ error: err.message, completions: {} });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleHabitCompletion: async (habitId: string, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const completionKey = `${habitId}-${dateString}`;
    const currentCompletionStatus = get().completions[completionKey] || false;

    // Optimistic update
    set((state) => ({
      completions: {
        ...state.completions,
        [completionKey]: !currentCompletionStatus,
      },
    }));

    try {
      if (currentCompletionStatus) {
        await habitService.deleteCompletion(habitId, date);
      } else {
        await habitService.createCompletion(habitId, date);
      }
    } catch (err: any) {
      set({ error: err.message });
      // Revert optimistic update on error
      set((state) => ({
        completions: {
          ...state.completions,
          [completionKey]: currentCompletionStatus,
        },
      }));
    }
  },

  addHabitNote: async (habitId: string, date: Date, note: string) => {
    set({ isLoading: true, error: null });
    try {
      await habitService.updateCompletionNote(habitId, date, note);
      // No direct state update for note in completions map, just refresh if needed
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  // Computed - These will access state directly
  getHabitsByRoutine: (routineType: string) => {
    return get().habits.filter((h) => h.routine_type === routineType).sort((a, b) => a.order_index - b.order_index);
  },
  getCompletionStatus: (habitId: string, date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return get().completions[`${habitId}-${dateString}`] || false;
  },
  getWeeklyProgress: (habitId: string, weekStart: Date) => {
    const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) });
    const completedCount = weekDays.filter(day => get().getCompletionStatus(habitId, day)).length;
    return completedCount; // Returns count, not percentage
  },
  getMonthlyProgress: (habitId: string, month: Date) => {
    // Simplified: count completions in month. More complex logic for target_days_per_week needed for accurate %
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const daysInMonth = eachDayOfInterval({ start, end });
    const completedCount = daysInMonth.filter(day => get().getCompletionStatus(habitId, day)).length;
    return completedCount; // Returns count
  },
  getCurrentStreak: (habitId: string) => {
    // This is a complex calculation, simplified for now
    let streak = 0;
    let currentDate = new Date();
    while (get().getCompletionStatus(habitId, currentDate)) {
      streak++;
      currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    }
    return streak;
  },
  getLongestStreak: (habitId: string) => {
    // This requires historical data, simplified for now
    return 0; // Placeholder
  },
}));
