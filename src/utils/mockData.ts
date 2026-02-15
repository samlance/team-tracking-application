import { 
  AppState, 
  User, 
  DailyStatus, 
  Deployment, 
  SonarFix, 
  UnitTestImprovement, 
  Sprint,
  SprintItem,
  MergeRequest 
} from '../types';

// Generate random ID
const generateId = (): string => Math.random().toString(36).substring(2, 10);

// Generate random date within range
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

// Generate mock users
const generateMockUsers = (): User[] => {
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emma Wilson', 
    'David Rodriguez', 'Lisa Brown', 'Ahmed Khan', 'Priya Patel'
  ];
  
  return names.map((name) => ({
    id: generateId(),
    name,
  }));
};

// Generate mock daily statuses
const generateMockDailyStatuses = (users: User[]): DailyStatus[] => {
  const statuses: DailyStatus[] = [];
  
  users.forEach(user => {
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const tasks = [];
      const taskCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < taskCount; j++) {
        const statuses = ['not-started', 'in-progress', 'completed', 'blocked'];
        tasks.push({
          id: generateId(),
          developerId: user.id,
          startDate: randomDate(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000), date),
          endDate: randomDate(date, new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)),
          dependency: Math.random() > 0.7 ? 'Depends on API integration' : '',
          description: `Task ${j + 1} for ${user.name}`,
          remarks: Math.random() > 0.7 ? 'Making good progress' : '',
          status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        });
      }
      
      statuses.push({
        id: generateId(),
        userId: user.id,
        date: dateString,
        tasks,
        leavesPlanned: Math.random() > 0.9 ? '2023-05-15 to 2023-05-20' : '',
      });
    }
  });
  
  return statuses;
};

// Generate mock deployments
const generateMockDeployments = (): Deployment[] => {
  const environments = ['dev', 'qa', 'uat', 'prod', 'other'];
  const statuses = ['scheduled', 'in-progress', 'completed', 'failed'];
  
  const deployments = [];
  
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    deployments.push({
      id: generateId(),
      squadNumber: `Squad ${Math.floor(Math.random() * 5) + 1}`,
      details: `Deploy v1.${i} with new feature X`,
      environment: environments[Math.floor(Math.random() * environments.length)] as any,
      date: date.toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    });
  }
  
  return deployments;
};

// Generate mock Sonar fixes
const generateMockSonarFixes = (users: User[]): SonarFix[] => {
  const severities = ['blocker', 'critical', 'major', 'minor', 'info'];
  const statuses = ['open', 'in-progress', 'resolved'];
  
  const fixes = [];
  
  for (let i = 0; i < 15; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 10));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    fixes.push({
      id: generateId(),
      severity: severities[Math.floor(Math.random() * severities.length)] as any,
      assigneeId: users[Math.floor(Math.random() * users.length)].id,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      remarks: Math.random() > 0.7 ? 'Fixing code duplication' : '',
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    });
  }
  
  return fixes;
};

// Generate mock unit test improvements
const generateMockUnitTestImprovements = (users: User[]): UnitTestImprovement[] => {
  const components = [
    'Authentication', 'User Profile', 'Dashboard', 'Reporting', 
    'API Integration', 'Payment Processing', 'Notifications'
  ];
  
  const statuses = ['not-started', 'in-progress', 'completed'];
  
  const improvements = [];
  
  for (let i = 0; i < 12; i++) {
    const currentCoverage = Math.floor(Math.random() * 60) + 20;
    const improvedCoverage = Math.min(100, currentCoverage + Math.floor(Math.random() * 30));
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 10));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 7) + 1);
    
    improvements.push({
      id: generateId(),
      componentName: components[Math.floor(Math.random() * components.length)],
      assigneeId: users[Math.floor(Math.random() * users.length)].id,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      currentCoverage,
      improvedCoverage,
      remarks: Math.random() > 0.7 ? 'Added tests for edge cases' : '',
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    });
  }
  
  return improvements;
};

// Generate mock sprints
const generateMockSprints = (): Sprint[] => {
  const sprints = [];
  
  for (let i = 1; i <= 3; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (i * 14));
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);
    
    let status: 'planning' | 'active' | 'completed';
    if (i === 1) status = 'active';
    else if (i === 2) status = 'completed';
    else status = 'planning';
    
    sprints.push({
      id: generateId(),
      name: `Sprint ${i}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status,
    });
  }
  
  return sprints;
};

// Generate mock sprint items
const generateMockSprintItems = (sprints: Sprint[], users: User[]): SprintItem[] => {
  const types = ['task', 'sub-task', 'defect'];
  const statuses = ['todo', 'in-progress', 'review', 'done'];
  
  const items = [];
  
  sprints.forEach(sprint => {
    const itemCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < itemCount; i++) {
      items.push({
        id: generateId(),
        type: types[Math.floor(Math.random() * types.length)] as any,
        title: `${types[Math.floor(Math.random() * types.length)]} ${i + 1} for ${sprint.name}`,
        assigneeId: users[Math.floor(Math.random() * users.length)].id,
        status: statuses[Math.floor(Math.random() * statuses.length)] as any,
        sprintId: sprint.id,
      });
    }
  });
  
  return items;
};

// Generate mock merge requests
const generateMockMergeRequests = (users: User[]): MergeRequest[] => {
  const statuses = ['open', 'under-review', 'changes-requested', 'approved', 'merged'];
  
  const mergeRequests = [];
  
  for (let i = 0; i < 20; i++) {
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 10));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setDate(createdDate.getDate() + Math.floor(Math.random() * 3));
    
    const requestor = users[Math.floor(Math.random() * users.length)];
    let reviewer = users[Math.floor(Math.random() * users.length)];
    
    // Make sure reviewer is different from requestor
    while (reviewer.id === requestor.id) {
      reviewer = users[Math.floor(Math.random() * users.length)];
    }
    
    mergeRequests.push({
      id: generateId(),
      mrId: `MR-${Math.floor(Math.random() * 1000) + 1}`,
      requestorId: requestor.id,
      reviewerId: reviewer.id,
      description: `Implement feature X for project Y`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
    });
  }
  
  return mergeRequests;
};

// Generate all mock data
export const generateMockData = (): AppState => {
  const users = generateMockUsers();
  const sprints = generateMockSprints();
  
  return {
    users,
    dailyStatuses: generateMockDailyStatuses(users),
    deployments: generateMockDeployments(),
    sonarFixes: generateMockSonarFixes(users),
    unitTestImprovements: generateMockUnitTestImprovements(users),
    sprints,
    sprintItems: generateMockSprintItems(sprints, users),
    mergeRequests: generateMockMergeRequests(users),
  };
};