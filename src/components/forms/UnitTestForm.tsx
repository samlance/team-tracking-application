import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface UnitTestFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const UnitTestForm: React.FC<UnitTestFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    componentName: '',
    assigneeId: '',
    startDate: '',
    endDate: '',
    currentCoverage: '',
    improvedCoverage: '',
    remarks: '',
    status: 'not-started'
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('unit_test_improvements')
        .insert({
          ...formData,
          currentCoverage: parseFloat(formData.currentCoverage),
          improvedCoverage: parseFloat(formData.improvedCoverage)
        });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding unit test improvement:', error);
      alert('Failed to add unit test improvement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Component Name"
        value={formData.componentName}
        onChange={(value) => handleChange('componentName', value)}
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Current Coverage (%)"
          type="number"
          min="0"
          max="100"
          value={formData.currentCoverage}
          onChange={(value) => handleChange('currentCoverage', value)}
          required
        />
        <Input
          label="Improved Coverage (%)"
          type="number"
          min="0"
          max="100"
          value={formData.improvedCoverage}
          onChange={(value) => handleChange('improvedCoverage', value)}
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
          { value: 'not-started', label: 'Not Started' },
          { value: 'in-progress', label: 'In Progress' },
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
          {loading ? 'Saving...' : 'Add Unit Test Improvement'}
        </Button>
      </div>
    </form>
  );
};

export default UnitTestForm;