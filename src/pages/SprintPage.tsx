import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const SprintPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedSprint, setSelectedSprint] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  
  const filteredItems = state.sprintItems.filter(item => {
    if (selectedSprint !== 'all' && item.sprintId !== selectedSprint) {
      return false;
    }
    
    if (selectedType !== 'all' && item.type !== selectedType) {
      return false;
    }
    
    if (selectedStatus !== 'all' && item.status !== selectedStatus) {
      return false;
    }
    
    if (selectedAssignee !== 'all' && item.assigneeId !== selectedAssignee) {
      return false;
    }
    
    return true;
  });
  
  const getUserById = (id: string) => {
    return state.users.find(user => user.id === id)?.name || 'Unknown';
  };
  
  const getSprintById = (id: string) => {
    return state.sprints.find(sprint => sprint.id === id)?.name || 'Unknown';
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'todo': 'info',
      'in-progress': 'primary',
      'review': 'warning',
      'done': 'success',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };
  
  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'task': 'primary',
      'sub-task': 'info',
      'defect': 'danger',
    };
    
    return (
      <Badge variant={typeMap[type] || 'secondary'} className="capitalize">
        {type.replace('-', ' ')}
      </Badge>
    );
  };
  
  const getSprintStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'planning': 'info',
      'active': 'primary',
      'completed': 'success',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <Layout title="Sprint Tracker" subtitle="Track work items sprint-wise">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select
            label="Sprint"
            value={selectedSprint}
            onChange={setSelectedSprint}
            options={[
              { value: 'all', label: 'All Sprints' },
              ...state.sprints.map(sprint => ({ value: sprint.id, label: sprint.name })),
            ]}
          />
          
          <Select
            label="Type"
            value={selectedType}
            onChange={setSelectedType}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'task', label: 'Task' },
              { value: 'sub-task', label: 'Sub-task' },
              { value: 'defect', label: 'Defect' },
            ]}
          />
          
          <Select
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'todo', label: 'To Do' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'review', label: 'Review' },
              { value: 'done', label: 'Done' },
            ]}
          />
          
          <Select
            label="Assignee"
            value={selectedAssignee}
            onChange={setSelectedAssignee}
            options={[
              { value: 'all', label: 'All Assignees' },
              ...state.users.map(user => ({ value: user.id, label: user.name })),
            ]}
          />
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sprint Item
        </Button>
      </div>
      
      <div className="mb-6">
        <Card title="Sprints">
          <Table
            columns={[
              { 
                header: 'Sprint', 
                accessor: 'name',
                sortable: true 
              },
              { 
                header: 'Start Date', 
                accessor: 'startDate', 
                sortable: true 
              },
              { 
                header: 'End Date', 
                accessor: 'endDate', 
                sortable: true 
              },
              { 
                header: 'Status', 
                accessor: (item) => getSprintStatusBadge(item.status),
                sortable: true 
              },
              { 
                header: 'Items', 
                accessor: (item) => {
                  const totalItems = state.sprintItems.filter(i => i.sprintId === item.id).length;
                  const completedItems = state.sprintItems.filter(
                    i => i.sprintId === item.id && i.status === 'done'
                  ).length;
                  return `${completedItems}/${totalItems}`;
                },
                sortable: false 
              },
            ]}
            data={state.sprints}
            keyExtractor={(item) => item.id}
          />
        </Card>
      </div>
      
      <Card title="Sprint Items">
        <Table
          columns={[
            { 
              header: 'Type', 
              accessor: (item) => getTypeBadge(item.type),
              sortable: true 
            },
            { 
              header: 'Title', 
              accessor: 'title',
              sortable: true 
            },
            { 
              header: 'Sprint', 
              accessor: (item) => getSprintById(item.sprintId),
              sortable: true 
            },
            { 
              header: 'Assignee', 
              accessor: (item) => getUserById(item.assigneeId),
              sortable: true 
            },
            { 
              header: 'Status', 
              accessor: (item) => getStatusBadge(item.status),
              sortable: true 
            },
          ]}
          data={filteredItems}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tasks</h3>
            <div className="text-3xl font-bold text-blue-500">
              {state.sprintItems.filter(item => item.type === 'task').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.sprintItems.filter(
                item => item.type === 'task' && item.status === 'done'
              ).length} completed
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sub-tasks</h3>
            <div className="text-3xl font-bold text-teal-500">
              {state.sprintItems.filter(item => item.type === 'sub-task').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.sprintItems.filter(
                item => item.type === 'sub-task' && item.status === 'done'
              ).length} completed
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Defects</h3>
            <div className="text-3xl font-bold text-red-500">
              {state.sprintItems.filter(item => item.type === 'defect').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.sprintItems.filter(
                item => item.type === 'defect' && item.status === 'done'
              ).length} resolved
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SprintPage;