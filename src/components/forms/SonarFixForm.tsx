import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface SonarFixFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const SonarFixForm: React.FC<SonarFixFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    severity: 'major',
    assigneeId: '',
    startDate: '',
    endDate: '',
    remarks: '',
    status: 'open'
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('sonar_fixes')
        .insert(formData);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding sonar fix:', error);
      alert('Failed to add sonar fix');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Severity"
        value={formData.severity}
        onChange={(value) => handleChange('severity', value)}
        options={[
          { value: 'blocker', label: 'Blocker' },
          { value: 'critical', label: 'Critical' },
          { value: 'major', label: 'Major' },
          { value: 'minor', label: 'Minor' },
          { value: 'info', label: 'Info' }
        ]}
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

      <Input
        label="Remarks"
        value={formData.remarks}
        onChange={(value) => handleChange('remarks', value)}
        placeholder="Enter any remarks"
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={[
          { value: 'open', label: 'Open' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'resolved', label: 'Resolved' }
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
          {loading ? 'Saving...' : 'Add Sonar Fix'}
        </Button>
      </div>
    </form>
  );
};

export default SonarFixForm;