import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ClientList from './components/Clients/ClientList';
import NotificationsList from './components/Notifications/NotificationsList';
import { healthCheck } from './services/api';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await healthCheck();
      setIsConnected(true);
    } catch (error) {
      console.error('Backend connection failed:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading ISO Manager...
          </h2>
          <p className="text-gray-600">Connecting to server</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the backend server. Please ensure the backend is running on port 5000.
          </p>
          <button
            onClick={checkConnection}
            className="btn-primary"
          >
            Retry Connection
          </button>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
            <p className="font-medium text-gray-900 mb-2">To start the backend:</p>
            <code className="text-gray-700">
              cd backend && npm run dev
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {(activeView, handleViewChange) => {
        switch (activeView) {
          case 'clients':
            return <ClientList />;
          case 'notifications':
            return <NotificationsList />;
          default:
            return <Dashboard onViewChange={handleViewChange} />;
        }
      }}
    </Layout>
  );
}

export default App;