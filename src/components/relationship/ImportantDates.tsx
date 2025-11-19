'use client';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useRelationshipStore } from '@/store/relationshipStore';
import { ImportantDate } from '@/types';
import { format, isPast, isToday } from 'date-fns';
import { Calendar, Edit, Heart, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ImportantDates() {
  const {
    importantDates,
    fetchImportantDates,
    addImportantDate,
    updateImportantDate,
    deleteImportantDate,
    isLoading,
    error,
  } = useRelationshipStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    description: '',
    type: 'anniversary' as const,
  });

  useEffect(() => {
    fetchImportantDates();
  }, [fetchImportantDates]);

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date(),
      description: '',
      type: 'anniversary',
    });
    setEditingDate(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDate) {
        await updateImportantDate(editingDate.id, formData);
      } else {
        await addImportantDate(formData);
      }
      setIsDialogOpen(false);
      resetForm();
      fetchImportantDates();
    } catch (err) {
      console.error('Error saving important date:', err);
    }
  };

  const handleEdit = (date: ImportantDate) => {
    setEditingDate(date);
    setFormData({
      title: date.title,
      date: new Date(date.date),
      description: date.description || '',
      type: date.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this important date?')) {
      try {
        await deleteImportantDate(id);
        fetchImportantDates();
      } catch (err) {
        console.error('Error deleting important date:', err);
      }
    }
  };

  const getDateStatus = (date: Date) => {
    if (isToday(date)) return 'today';
    if (isPast(date)) return 'past';
    return 'future';
  };

  const sortedDates = [...importantDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Important Dates</h2>
          <p className="text-muted-foreground">Track anniversaries, birthdays, and special occasions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Date
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDate ? 'Edit' : 'Add'} Important Date</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(formData.date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="anniversary">Anniversary</option>
                  <option value="birthday">Birthday</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingDate ? 'Update' : 'Add'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedDates.map((date) => {
          const status = getDateStatus(new Date(date.date));
          return (
            <Card key={date.id} className={cn(
              'transition-all hover:shadow-md',
              status === 'today' && 'ring-2 ring-primary',
              status === 'past' && 'opacity-75'
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <CardTitle className="text-lg">{date.title}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(date)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(date.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(date.date), 'PPP')}
                  </div>
                  {date.description && (
                    <p className="text-sm text-muted-foreground">{date.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                      {date.type}
                    </span>
                    {status === 'today' && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Today!
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedDates.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No important dates yet</h3>
          <p className="text-muted-foreground mb-4">Add anniversaries, birthdays, and special occasions to keep track of them.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Date
          </Button>
        </div>
      )}
    </div>
  );
}
