import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAppContext } from '../context/AppContext';
import { Plus } from 'lucide-react';

const MergeRequestPage: React.FC = () => {
  const { state } = useAppContext();
  const [selectedRequestor, setSelectedRequestor] = useState<string>('all');
  const [selectedReviewer, setSelectedReviewer] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const filteredMRs = state.mergeRequests.filter(mr => {
    if (selectedRequestor !== 'all' && mr.requestorId !== selectedRequestor) {
      return false;
    }
    
    if (selectedReviewer !== 'all' && mr.reviewerId !== selectedReviewer) {
      return false;
    }
    
    if (selectedStatus !== 'all' && mr.status !== selectedStatus) {
      return false;
    }
    
    return true;
  });
  
  const getUserById = (id: string) => {
    return state.users.find(user => user.id === id)?.name || 'Unknown';
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'primary' | 'success' | 'danger' | 'warning' | 'info'> = {
      'open': 'info',
      'under-review': 'primary',
      'changes-requested': 'warning',
      'approved': 'success',
      'merged': 'success',
    };
    
    return (
      <Badge variant={statusMap[status] || 'secondary'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Layout title="Merge Request Tracker" subtitle="Track GitLab merge requests">
      <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4">
          <Select
            label="Requestor"
            value={selectedRequestor}
            onChange={setSelectedRequestor}
            options={[
              { value: 'all', label: 'All Requestors' },
              ...state.users.map(user => ({ value: user.id, label: user.name })),
            ]}
          />
          
          <Select
            label="Reviewer"
            value={selectedReviewer}
            onChange={setSelectedReviewer}
            options={[
              { value: 'all', label: 'All Reviewers' },
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
              { value: 'under-review', label: 'Under Review' },
              { value: 'changes-requested', label: 'Changes Requested' },
              { value: 'approved', label: 'Approved' },
              { value: 'merged', label: 'Merged' },
            ]}
          />
        </div>
        
        <Button 
          variant="primary" 
          className="flex items-center h-9 mt-7"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Merge Request
        </Button>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {['open', 'under-review', 'changes-requested', 'approved', 'merged'].map(status => {
          const count = state.mergeRequests.filter(mr => mr.status === status).length;
          
          return (
            <Card key={status}>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                  {status.replace('-', ' ')}
                </h3>
                <div className="text-2xl font-bold text-blue-500">
                  {count}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      <Card title="Merge Requests">
        <Table
          columns={[
            { 
              header: 'MR ID', 
              accessor: 'mrId',
              sortable: true 
            },
            { 
              header: 'Requestor', 
              accessor: (item) => getUserById(item.requestorId),
              sortable: true 
            },
            { 
              header: 'Reviewer', 
              accessor: (item) => getUserById(item.reviewerId),
              sortable: true 
            },
            { 
              header: 'Description', 
              accessor: 'description',
              sortable: true 
            },
            { 
              header: 'Created', 
              accessor: (item) => formatDate(item.createdAt),
              sortable: true 
            },
            { 
              header: 'Updated', 
              accessor: (item) => formatDate(item.updatedAt),
              sortable: true 
            },
            { 
              header: 'Status', 
              accessor: (item) => getStatusBadge(item.status),
              sortable: true 
            },
          ]}
          data={filteredMRs}
          keyExtractor={(item) => item.id}
        />
      </Card>
      
      <div className="mt-6">
        <Card title="MR Activity by User">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Developer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reviewing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Merged
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.users.map(user => {
                  const created = state.mergeRequests.filter(mr => mr.requestorId === user.id).length;
                  const reviewing = state.mergeRequests.filter(mr => mr.reviewerId === user.id).length;
                  const merged = state.mergeRequests.filter(
                    mr => mr.requestorId === user.id && mr.status === 'merged'
                  ).length;
                  
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {created}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reviewing}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {merged}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default MergeRequestPage;