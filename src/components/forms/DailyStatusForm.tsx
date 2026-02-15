import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

interface DailyStatusFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const DailyStatusForm: React.FC<DailyStatusFormProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [leavesPlanned, setLeavesPlanned] = useState('');
  const [tasks, setTasks] = useState([{
    description: '',
    startDate: '',
    endDate: '',
    dependency: '',
    remarks: '',
    status: 'not-started'
  }]);

  const handleAddTask = () => {
    setTasks([...tasks, {
      description: '',
      startDate: '',
      endDate: '',
      dependency: '',
      remarks: '',
      status: 'not-started'
    }]);
  };

  const handleTaskChange = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Insert daily status
      const { data: dailyStatus, error: dailyStatusError } = await supabase
        .from('daily_statuses')
        .insert({
          user_id: user.id,
          date,
          leaves_planned: leavesPlanned
        })
        .select()
        .single();

      if (dailyStatusError) throw dailyStatusError;

      // Insert tasks
      const tasksToInsert = tasks.map(task => ({
        daily_status_id: dailyStatus.id,
        developer_id: user.id,
        ...task
      }));

      const { error: tasksError } = await supabase
        .from('tasks')
        .insert(tasksToInsert);

      if (tasksError) throw tasksError;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding daily status:', error);
      alert('Failed to add daily status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={setDate}
          required
        />
        <Input
          label="Leaves Planned"
          value={leavesPlanned}
          onChange={setLeavesPlanned}
          placeholder="Enter planned leaves"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Tasks</h3>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>

        {tasks.map((task, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <Input
              label="Description"
              value={task.description}
              onChange={(value) => handleTaskChange(index, 'description', value)}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={task.startDate}
                onChange={(value) => handleTaskChange(index, 'startDate', value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={task.endDate}
                onChange={(value) => handleTaskChange(index, 'endDate', value)}
                required
              />
            </div>

            <Input
              label="Dependency"
              value={task.dependency}
              onChange={(value) => handleTaskChange(index, 'dependency', value)}
              placeholder="Enter any dependencies"
            />

            <Input
              label="Remarks"
              value={task.remarks}
              onChange={(value) => handleTaskChange(index, 'remarks', value)}
              placeholder="Enter remarks"
            />

            <Select
              label="Status"
              value={task.status}
              onChange={(value) => handleTaskChange(index, 'status', value)}
              options={[
                { value: 'not-started', label: 'Not Started' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'blocked', label: 'Blocked' }
              ]}
            />
          </div>
        ))}
      </div>

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
          {loading ? 'Saving...' : 'Save Daily Status'}
        </Button>
      </div>
    </form>
  );
};

export default DailyStatusForm;