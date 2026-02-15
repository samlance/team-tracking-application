import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface DeploymentFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    squadNumber: '',
    details: '',
    environment: 'dev',
    date: '',
    status: 'scheduled'
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('deployments')
        .insert(formData);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding deployment:', error);
      alert('Failed to add deployment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Squad Number"
        value={formData.squadNumber}
        onChange={(value) => handleChange('squadNumber', value)}
        required
      />

      <Input
        label="Details"
        value={formData.details}
        onChange={(value) => handleChange('details', value)}
        required
      />

      <Select
        label="Environment"
        value={formData.environment}
        onChange={(value) => handleChange('environment', value)}
        options={[
          { value: 'dev', label: 'Development' },
          { value: 'qa', label: 'QA' },
          { value: 'uat', label: 'UAT' },
          { value: 'prod', label: 'Production' },
          { value: 'other', label: 'Other' }
        ]}
      />

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(value) => handleChange('date', value)}
        required
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={[
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'failed', label: 'Failed' }
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
          {loading ? 'Saving...' : 'Add Deployment'}
        </Button>
      </div>
    </form>
  );
};

export default DeploymentForm;