import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Server, AlertCircle, Beaker, Footprints as Sprint, GitMerge } from 'lucide-react';

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const items: SidebarItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      path: '/daily-status',
      label: 'Daily Status',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: '/deployments',
      label: 'Deployments',
      icon: <Server className="w-5 h-5" />,
    },
    {
      path: '/sonar',
      label: 'Sonar Fixes',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      path: '/unit-tests',
      label: 'Unit Tests',
      icon: <Beaker className="w-5 h-5" />,
    },
    {
      path: '/sprints',
      label: 'Sprints',
      icon: <Sprint className="w-5 h-5" />,
    },
    {
      path: '/merge-requests',
      label: 'Merge Requests',
      icon: <GitMerge className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Team Tracker</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm transition-colors ${
                  location.pathname === item.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-2">
            <span className="text-white font-medium">US</span>
          </div>
          <div>
            <p className="text-sm font-medium">User Session</p>
            <p className="text-xs text-gray-400">Local Storage</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;