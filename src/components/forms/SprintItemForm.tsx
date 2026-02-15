import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface SprintItemFormProps {
  sprintId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SprintItemForm: React.FC<SprintItemFormProps> = ({ sprintId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'task',
    title: '',
    assigneeId: '',
    status: 'todo',
    sprintId
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('sprint_items')
        .insert(formData);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding sprint item:', error);
      alert('Failed to add sprint item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Type"
        value={formData.type}
        onChange={(value) => handleChange('type', value)}
        options={[
          { value: 'task', label: 'Task' },
          { value: 'sub-task', label: 'Sub-task' },
          { value: 'defect', label: 'Defect' }
        ]}
      />

      <Input
        label="Title"
        value={formData.title}
        onChange={(value) => handleChange('title', value)}
        required
      />

      <Select
        label="Assignee"
        value={formData.assigneeId}
        onChange={(value) => handleChange('assigneeId', value)}
        options={[
          { value: '', label: 'Select Assignee' },
          // We'll populate this with actual users from the database
        ]}
        required
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={[
          { value: 'todo', label: 'To Do' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'review', label: 'Review' },
          { value: 'done', label: 'Done' }
        ]}
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Sprint Item'}
        </Button>
      </div>
    </form>
  );
};

export default SprintItemForm;