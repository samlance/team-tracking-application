import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const UnitTestPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const uniqueComponents = Array.from(new Set(state.unitTestImprovements.map(test => test.componentName)));
  
  const filteredTests = state.unitTestImprovements.filter(test => {
    if (selectedComponent !== 'all' && test.componentName !== selectedComponent) {
      return false;
    }
    
    if (selectedAssignee !== 'all' && test.assigneeId !== selectedAssignee) {
      return false;
    }
    
    if (selectedStatus !== 'all' && test.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });
  
  const getUserById = (id: string) => {
    return state.users.find(user => user.id === id)?.name || 'Unknown';
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'not-started': 'info',
      'in-progress': 'primary',
      'completed': 'success',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };
  
  const getCoverageChangeClass = (current: number, improved: number) => {
    const difference = improved - current;
    if (difference >= 10) return 'text-green-600 font-medium';
    if (difference >= 5) return 'text-blue-600';
    return 'text-gray-700';
  };

  // Calculate average coverage
  const calculateAverageCoverage = () => {
    if (state.unitTestImprovements.length === 0) return 0;
    
    const totalCoverage = state.unitTestImprovements.reduce(
      (sum, test) => sum + test.currentCoverage, 
      0
    );
    
    return Math.round(totalCoverage / state.unitTestImprovements.length);
  };
  
  // Calculate potential average coverage
  const calculatePotentialCoverage = () => {
    if (state.unitTestImprovements.length === 0) return 0;
    
    const totalImprovedCoverage = state.unitTestImprovements.reduce(
      (sum, test) => sum + test.improvedCoverage, 
      0
    );
    
    return Math.round(totalImprovedCoverage / state.unitTestImprovements.length);
  };

  return (
    <Layout title="Unit Test Cases Tracker" subtitle="Monitor test coverage improvements">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select
            label="Component"
            value={selectedComponent}
            onChange={setSelectedComponent}
            options={[
              { value: 'all', label: 'All Components' },
              ...uniqueComponents.map(comp => ({ value: comp, label: comp })),
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
              { value: 'not-started', label: 'Not Started' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Test Improvement
        </Button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current Average Coverage</h3>
            <div className="text-3xl font-bold text-blue-500">
              {calculateAverageCoverage()}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Across {state.unitTestImprovements.length} components
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Potential Coverage</h3>
            <div className="text-3xl font-bold text-green-500">
              {calculatePotentialCoverage()}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              After all improvements
            </div>
          </div>
        </Card>
      </div>
      
      <Card title="Test Coverage Improvements">
        <Table
          columns={[
            { 
              header: 'Component', 
              accessor: 'componentName',
              sortable: true 
            },
            { 
              header: 'Developer', 
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
              header: 'Current', 
              accessor: (item) => `${item.currentCoverage}%`,
              sortable: true 
            },
            { 
              header: 'Target', 
              accessor: (item) => (
                <span className={getCoverageChangeClass(item.currentCoverage, item.improvedCoverage)}>
                  {item.improvedCoverage}%
                </span>
              ),
              sortable: true 
            },
            { 
              header: 'Status', 
              accessor: (item) => getStatusBadge(item.status),
              sortable: true 
            },
          ]}
          data={filteredTests}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6">
        <Card title="Coverage Progress">
          <div className="space-y-6">
            {filteredTests.map(test => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{test.componentName}</span>
                  <span className="text-gray-500">
                    {getUserById(test.assigneeId)}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {test.currentCoverage}% → {test.improvedCoverage}%
                  </span>
                  {getStatusBadge(test.status)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="bg-blue-600 h-4 rounded-l-full" 
                    style={{ width: `${test.currentCoverage}%` }}
                  ></div>
                  <div 
                    className="bg-green-400 h-4 absolute top-0" 
                    style={{ 
                      left: `${test.currentCoverage}%`,
                      width: `${test.improvedCoverage - test.currentCoverage}%` 
                    }}
                  ></div>
                </div>
                {test.remarks && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span> {test.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default UnitTestPage;