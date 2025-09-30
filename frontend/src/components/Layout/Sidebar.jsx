import { BarChart3, Users, Bell, FileText } from 'lucide-react';

const Sidebar = ({ activeView, onViewChange }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & Statistics'
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      description: 'Manage Certificates'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Alerts & Reminders'
    }
  ];

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                }`}
              >
                <Icon
                  size={20}
                  className={`mr-3 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                  }`}
                />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div
                    className={`text-xs ${
                      isActive ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;