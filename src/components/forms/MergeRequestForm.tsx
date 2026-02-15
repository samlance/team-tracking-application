import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface MergeRequestFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const MergeRequestForm: React.FC<MergeRequestFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mrId: '',
    requestorId: '',
    reviewerId: '',
    description: '',
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
        .from('merge_requests')
        .insert({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding merge request:', error);
      alert('Failed to add merge request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="MR ID"
        value={formData.mrId}
        onChange={(value) => handleChange('mrId', value)}
        required
      />

      <Select
        label="Requestor"
        value={formData.requestorId}
        onChange={(value) => handleChange('requestorId', value)}
        options={[
          { value: '', label: 'Select Requestor' },
          // We'll populate this with actual users from the database
        ]}
        required
      />

      <Select
        label="Reviewer"
        value={formData.reviewerId}
        onChange={(value) => handleChange('reviewerId', value)}
        options={[
          { value: '', label: 'Select Reviewer' },
          // We'll populate this with actual users from the database
        ]}
        required
      />

      <Input
        label="Description"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        required
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(value) => handleChange('status', value)}
        options={[
          { value: 'open', label: 'Open' },
          { value: 'under-review', label: 'Under Review' },
          { value: 'changes-requested', label: 'Changes Requested' },
          { value: 'approved', label: 'Approved' },
          { value: 'merged', label: 'Merged' }
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
          {loading ? 'Saving...' : 'Add Merge Request'}
        </Button>
      </div>
    </form>
  );
};

export default MergeRequestForm;