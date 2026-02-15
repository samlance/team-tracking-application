import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import { Plus, Filter } from 'lucide-react';

const DeploymentPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const uniqueSquads = Array.from(new Set(state.deployments.map(dep => dep.squadNumber)));
  
  const filteredDeployments = state.deployments.filter(deployment => {
    if (selectedSquad !== 'all' && deployment.squadNumber !== selectedSquad) {
      return false;
    }
    
    if (selectedEnvironment !== 'all' && deployment.environment !== selectedEnvironment) {
      return false;
    }
    
    if (selectedStatus !== 'all' && deployment.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'scheduled': 'info',
      'in-progress': 'primary',
      'completed': 'success',
      'failed': 'danger',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };
  
  const getEnvironmentBadge = (env: string) => {
    const envMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'dev': 'info',
      'qa': 'primary',
      'uat': 'warning',
      'prod': 'danger',
      'other': 'secondary',
    };
    
    return (
      <Badge variant={envMap[env] || 'secondary'} className="capitalize">
        {env}
      </Badge>
    );
  };

  return (
    <Layout title="Deployment Tracker" subtitle="Track squad-wise deployments across environments">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select
            label="Squad"
            value={selectedSquad}
            onChange={setSelectedSquad}
            options={[
              { value: 'all', label: 'All Squads' },
              ...uniqueSquads.map(squad => ({ value: squad, label: squad })),
            ]}
          />
          
          <Select
            label="Environment"
            value={selectedEnvironment}
            onChange={setSelectedEnvironment}
            options={[
              { value: 'all', label: 'All Environments' },
              { value: 'dev', label: 'Development' },
              { value: 'qa', label: 'QA' },
              { value: 'uat', label: 'UAT' },
              { value: 'prod', label: 'Production' },
              { value: 'other', label: 'Other' },
            ]}
          />
          
          <Select
            label="Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Deployment
        </Button>
      </div>
      
      <Card title="Deployments">
        <Table
          columns={[
            { 
              header: 'Squad', 
              accessor: 'squadNumber', 
              sortable: true 
            },
            { 
              header: 'Details', 
              accessor: 'details', 
              sortable: true 
            },
            { 
              header: 'Environment', 
              accessor: (item) => getEnvironmentBadge(item.environment),
              sortable: true 
            },
            { 
              header: 'Date', 
              accessor: 'date', 
              sortable: true 
            },
            { 
              header: 'Status', 
              accessor: (item) => getStatusBadge(item.status),
              sortable: true 
            },
          ]}
          data={filteredDeployments}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Development</h3>
            <div className="text-3xl font-bold text-blue-500">
              {state.deployments.filter(d => d.environment === 'dev').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.deployments.filter(d => d.environment === 'dev' && d.status === 'completed').length} successful
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">QA</h3>
            <div className="text-3xl font-bold text-indigo-500">
              {state.deployments.filter(d => d.environment === 'qa').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.deployments.filter(d => d.environment === 'qa' && d.status === 'completed').length} successful
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">UAT</h3>
            <div className="text-3xl font-bold text-amber-500">
              {state.deployments.filter(d => d.environment === 'uat').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.deployments.filter(d => d.environment === 'uat' && d.status === 'completed').length} successful
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Production</h3>
            <div className="text-3xl font-bold text-red-500">
              {state.deployments.filter(d => d.environment === 'prod').length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {state.deployments.filter(d => d.environment === 'prod' && d.status === 'completed').length} successful
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DeploymentPage;