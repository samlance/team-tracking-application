import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { useAppContext } from '../context/AppContext';
import { DailyStatus, Task, User } from '../types';
import { Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';

const DailyStatusPage: React.FC = () => {
  const { state, updateState } = useAppContext();
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const filteredStatuses = state.dailyStatuses.filter(status => {
    if (selectedUser !== 'all' && status.userId !== selectedUser) {
      return false;
    }
    
    if (selectedDate && status.date !== selectedDate) {
      return false;
    }
    
    return true;
  });
  
  // Get all tasks from filtered daily statuses
  const allTasks = filteredStatuses.flatMap(status => {
    return status.tasks.map(task => ({
      ...task,
      user: state.users.find(user => user.id === status.userId)?.name || 'Unknown',
    }));
  });
  
  // Filter tasks by status if needed
  const filteredTasks = selectedStatus === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.status === selectedStatus);
  
  const getUserById = (id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  };
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const taskStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'not-started', label: 'Not Started' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'blocked', label: 'Blocked' },
  ];
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'not-started': 'info',
      'in-progress': 'primary',
      'completed': 'success',
      'blocked': 'danger',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };
  
  return (
    <Layout title="Daily Status Tracker" subtitle="Track team's daily tasks and progress">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select
            label="Team Member"
            value={selectedUser}
            onChange={setSelectedUser}
            options={[
              { value: 'all', label: 'All Team Members' },
              ...state.users.map(user => ({ value: user.id, label: user.name })),
            ]}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center h-9 mt-7"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'More Filters'}
          </Button>
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Status Report
        </Button>
      </div>
      
      {showFilters && (
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Select
              label="Task Status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={taskStatusOptions}
            />
            
            <Input
              label="Search by Description"
              value=""
              onChange={() => {}}
              placeholder="Type to search..."
            />
          </div>
        </Card>
      )}
      
      <Card title="Task Overview">
        <Table
          columns={[
            { 
              header: 'Task ID', 
              accessor: 'id', 
              sortable: true 
            },
            { 
              header: 'Developer', 
              accessor: 'user', 
              sortable: true 
            },
            { 
              header: 'Description', 
              accessor: 'description', 
              sortable: true 
            },
            { 
              header: 'Start Date', 
              accessor: (item) => formatDate(item.startDate),
              sortable: true 
            },
            { 
              header: 'End Date', 
              accessor: (item) => formatDate(item.endDate),
              sortable: true 
            },
            { 
              header: 'Status', 
              accessor: (item) => getStatusBadge(item.status),
              sortable: false 
            },
            { 
              header: 'Dependency', 
              accessor: 'dependency', 
              sortable: true 
            },
          ]}
          data={filteredTasks}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6">
        <Card title="Team Member's Planned Leaves">
          <Table
            columns={[
              { 
                header: 'Team Member', 
                accessor: (item) => {
                  const user = getUserById(item.userId);
                  return user?.name || 'Unknown';
                },
                sortable: true 
              },
              { 
                header: 'Date', 
                accessor: 'date', 
                sortable: true 
              },
              { 
                header: 'Leaves Planned', 
                accessor: 'leavesPlanned', 
                sortable: true 
              },
              { 
                header: 'Tasks Count', 
                accessor: (item) => item.tasks.length.toString(),
                sortable: false 
              },
            ]}
            data={filteredStatuses.filter(status => status.leavesPlanned !== '')}
            keyExtractor={(item) => item.id}
          />
        </Card>
      </div>
    </Layout>
  );
};

export default DailyStatusPage;