import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface SprintFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SprintForm: React.FC<SprintFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    status: 'planning'
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('sprints')
        .insert(formData);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding sprint:', error);
      alert('Failed to add sprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Sprint Name"
        value={formData.name}
        onChange={(value) => handleChange('name', value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(value) => handleChange('startDate', value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(value) => handleChange('endDate', value)}
          required
        />
      </div>

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={[
          { value: 'planning', label: 'Planning' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' }
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
          {loading ? 'Saving...' : 'Add Sprint'}
        </Button>
      </div>
    </form>
  );
};

export default SprintForm;