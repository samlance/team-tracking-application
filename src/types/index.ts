// Common types
export interface User {
  id: string;
  name: string;
}

// Daily Status Types
export interface Task {
  id: string;
  developerId: string;
  startDate: string;
  endDate: string;
  dependency: string;
  description: string;
  remarks: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

export interface DailyStatus {
  id: string;
  userId: string;
  date: string;
  tasks: Task[];
  leavesPlanned: string;
}

// Deployment Types
export interface Deployment {
  id: string;
  squadNumber: string;
  details: string;
  environment: 'dev' | 'qa' | 'uat' | 'prod' | 'other';
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
}

// Sonar Types
export interface SonarFix {
  id: string;
  severity: 'blocker' | 'critical' | 'major' | 'minor' | 'info';
  assigneeId: string;
  startDate: string;
  endDate: string;
  remarks: string;
  status: 'open' | 'in-progress' | 'resolved';
}

// Unit Test Types
export interface UnitTestImprovement {
  id: string;
  componentName: string;
  assigneeId: string;
  startDate: string;
  endDate: string;
  currentCoverage: number;
  improvedCoverage: number;
  remarks: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

// Sprint Types
export interface SprintItem {
  id: string;
  type: 'task' | 'sub-task' | 'defect';
  title: string;
  assigneeId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  sprintId: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
}

// MR Types
export interface MergeRequest {
  id: string;
  mrId: string;
  requestorId: string;
  reviewerId: string;
  description: string;
  status: 'open' | 'under-review' | 'changes-requested' | 'approved' | 'merged';
  createdAt: string;
  updatedAt: string;
}

// App State Types
export interface AppState {
  users: User[];
  dailyStatuses: DailyStatus[];
  deployments: Deployment[];
  sonarFixes: SonarFix[];
  unitTestImprovements: UnitTestImprovement[];
  sprints: Sprint[];
  sprintItems: SprintItem[];
  mergeRequests: MergeRequest[];
}