import React from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import Badge from '../components/common/Badge';
import { User, SonarFix, MergeRequest, Deployment, UnitTestImprovement } from '../types';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  
  // Calculate statistics
  const totalTasks = state.dailyStatuses.reduce((acc, status) => acc + status.tasks.length, 0);
  const completedTasks = state.dailyStatuses.reduce(
    (acc, status) => acc + status.tasks.filter(task => task.status === 'completed').length, 
    0
  );
  
  const pendingMRs = state.mergeRequests.filter(
    mr => mr.status !== 'merged' && mr.status !== 'approved'
  ).length;
  
  const openSonarIssues = state.sonarFixes.filter(
    fix => fix.status !== 'resolved'
  ).length;
  
  const getUserById = (id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  };
  
  const getStatusVariant = (status: string): 'primary' | 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case 'open':
      case 'in-progress':
      case 'active':
        return 'primary';
      case 'completed':
      case 'resolved':
      case 'approved':
      case 'merged':
        return 'success';
      case 'failed':
      case 'blocked':
        return 'danger';
      case 'changes-requested':
      case 'under-review':
        return 'warning';
      default:
        return 'info';
    }
  };
  
  const recentSonarFixes: SonarFix[] = [...state.sonarFixes]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5);
    
  const recentMergeRequests: MergeRequest[] = [...state.mergeRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
    
  const recentDeployments: Deployment[] = [...state.deployments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const testCoverageProgress: UnitTestImprovement[] = [...state.unitTestImprovements]
    .sort((a, b) => (b.improvedCoverage - b.currentCoverage) - (a.improvedCoverage - a.currentCoverage))
    .slice(0, 3);

  return (
    <Layout title="Dashboard" subtitle="Overview of team activities">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <div className="text-3xl font-bold">{totalTasks}</div>
            <div className="text-sm mt-2">{completedTasks} completed</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Active Sprints</h3>
            <div className="text-3xl font-bold">
              {state.sprints.filter(sprint => sprint.status === 'active').length}
            </div>
            <div className="text-sm mt-2">
              {state.sprintItems.filter(item => item.status === 'done').length} items completed
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Pending Merge Requests</h3>
            <div className="text-3xl font-bold">{pendingMRs}</div>
            <div className="text-sm mt-2">{state.mergeRequests.length} total MRs</div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Open Sonar Issues</h3>
            <div className="text-3xl font-bold">{openSonarIssues}</div>
            <div className="text-sm mt-2">{state.sonarFixes.length} total issues</div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card title="Recent Deployments">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Squad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Environment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDeployments.map(deployment => (
                  <tr key={deployment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deployment.squadNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{deployment.environment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deployment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(deployment.status)} className="capitalize">
                        {deployment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card title="Recent Merge Requests">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MR ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requestor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentMergeRequests.map(mr => (
                  <tr key={mr.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mr.mrId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserById(mr.requestorId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserById(mr.reviewerId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(mr.status)} className="capitalize">
                        {mr.status.replace('-', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Recent Sonar Issues">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSonarFixes.map(fix => (
                  <tr key={fix.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          fix.severity === 'blocker' || fix.severity === 'critical' 
                            ? 'danger' 
                            : fix.severity === 'major' 
                              ? 'warning' 
                              : 'info'
                        } 
                        className="capitalize"
                      >
                        {fix.severity}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserById(fix.assigneeId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fix.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(fix.status)} className="capitalize">
                        {fix.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card title="Test Coverage Improvements">
          <div className="space-y-4">
            {testCoverageProgress.map(test => (
              <div key={test.id} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{test.componentName}</span>
                  <span className="text-sm text-gray-500">
                    {getUserById(test.assigneeId)?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs">{test.currentCoverage}% → {test.improvedCoverage}%</span>
                  <Badge variant={getStatusVariant(test.status)} className="capitalize">
                    {test.status}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${test.improvedCoverage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;