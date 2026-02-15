import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import { Plus, Filter } from 'lucide-react';

const SonarPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const filteredSonarFixes = state.sonarFixes.filter(fix => {
    if (selectedSeverity !== 'all' && fix.severity !== selectedSeverity) {
      return false;
    }
    
    if (selectedAssignee !== 'all' && fix.assigneeId !== selectedAssignee) {
      return false;
    }
    
    if (selectedStatus !== 'all' && fix.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });
  
  const getUserById = (id: string) => {
    return state.users.find(user => user.id === id)?.name || 'Unknown';
  };
  
  const getSeverityBadge = (severity: string) => {
    const severityMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'blocker': 'danger',
      'critical': 'danger',
      'major': 'warning',
      'minor': 'info',
      'info': 'primary',
    };
    
    return (
      <Badge variant={severityMap[severity] || 'secondary'} className="capitalize">
        {severity}
      </Badge>
    );
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'open': 'danger',
      'in-progress': 'primary',
      'resolved': 'success',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <Layout title="Sonar Fixes Monitoring" subtitle="Track code quality improvements from Sonar analysis">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select
            label="Severity"
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            options={[
              { value: 'all', label: 'All Severities' },
              { value: 'blocker', label: 'Blocker' },
              { value: 'critical', label: 'Critical' },
              { value: 'major', label: 'Major' },
              { value: 'minor', label: 'Minor' },
              { value: 'info', label: 'Info' },
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
          
          <Select
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
            ]}
          />
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sonar Issue
        </Button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Issues</h3>
            <div className="text-3xl font-bold text-blue-500">
              {state.sonarFixes.length}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Open Issues</h3>
            <div className="text-3xl font-bold text-amber-500">
              {state.sonarFixes.filter(fix => fix.status === 'open').length}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Resolved</h3>
            <div className="text-3xl font-bold text-green-500">
              {state.sonarFixes.filter(fix => fix.status === 'resolved').length}
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Sonar Issues">
        <Table
          columns={[
            { 
              header: 'Severity', 
              accessor: (item) => getSeverityBadge(item.severity),
              sortable: true 
            },
            { 
              header: 'Assignee', 
              accessor: (item) => getUserById(item.assigneeId),
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
              accessor: (item) => getStatusBadge(item.status),
              sortable: true 
            },
            { 
              header: 'Remarks', 
              accessor: 'remarks', 
              sortable: false 
            },
          ]}
          data={filteredSonarFixes}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6">
        <Card title="Issues by Severity">
          <div className="flex flex-wrap justify-around">
            {['blocker', 'critical', 'major', 'minor', 'info'].map(severity => {
              const count = state.sonarFixes.filter(fix => fix.severity === severity).length;
              const resolvedCount = state.sonarFixes.filter(
                fix => fix.severity === severity && fix.status === 'resolved'
              ).length;
              
              return (
                <div key={severity} className="p-4 text-center">
                  {getSeverityBadge(severity)}
                  <div className="mt-2 text-2xl font-bold">{count}</div>
                  <div className="text-sm text-gray-500">{resolvedCount} resolved</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SonarPage;