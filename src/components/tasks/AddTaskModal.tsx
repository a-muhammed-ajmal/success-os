import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Modal from '../ui/Modal';
import FormSelect from '../ui/FormSelect';
import FormToggle from '../ui/FormToggle';
import { getConnections } from '../../services/connectionsService';
import type { Task, TaskPriority, TaskStatus, Connection } from '../../types/database';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Task | null;
}

const PRIORITIES: TaskPriority[] = ['P1', 'P2', 'P3', 'P4'];

export default function AddTaskModal({ isOpen, onClose, onSave, initialData }: AddTaskModalProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    due_date: initialData?.due_date || '',
    due_time: initialData?.due_time || '',
    priority: (initialData?.priority || 'P2') as TaskPriority,
    status: (initialData?.status || 'Todo') as TaskStatus,
    is_focus_task: initialData?.is_focus_task || false,
    relation_id: initialData?.relation_id ? String(initialData.relation_id) : '',
    project: initialData?.project || '',
    tags: initialData?.tags ? initialData.tags.join(', ') : '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadConnections();
    }
  }, [isOpen]);

  const loadConnections = async () => {
    try {
      const data = await getConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        relation_id: formData.relation_id ? parseInt(formData.relation_id) : null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : null,
        subtasks: initialData?.subtasks || [], // Keep existing subtasks if editing
        focus_date: formData.is_focus_task ? new Date().toISOString().split('T')[0] : null,
      });
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      alert(error instanceof Error ? error.message : 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Task' : 'Add New Task'} size="lg">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Main Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="What needs to be done?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority & Project */}
            <div className="flex gap-4">
              <div className="w-1/3">
                 <FormSelect
                  label="Priority"
                  value={formData.priority}
                  onChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                  options={PRIORITIES}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Website Launch"
                />
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.due_time}
                  onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Relation (Connection) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Related To (Connection)</label>
            <select
              value={formData.relation_id}
              onChange={(e) => setFormData({ ...formData, relation_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-white"
            >
              <option value="">Select Connection...</option>
              {connections.map(conn => (
                <option key={conn.id} value={conn.id}>{conn.full_name} ({conn.company_name || 'No Company'})</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Add details..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="design, urgent, review"
            />
          </div>

          {/* Today's Focus Toggle */}
          <FormToggle
            label="Make this a Focus Task for Today"
            enabled={formData.is_focus_task}
            onChange={(enabled) => setFormData({ ...formData, is_focus_task: enabled })}
            description="Focus tasks appear on your dashboard. Maximum 3 allowed."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
