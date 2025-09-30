import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');

  const handleViewChange = (viewId) => {
    setActiveView(viewId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />
        <main className="flex-1 p-6">
          <div className="max-w-full">
            {/* Pass activeView to children so they know which view to show */}
            {typeof children === 'function'
              ? children(activeView, handleViewChange)
              : children
            }
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;