import { Clock, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-full px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ISO Manager
                </h1>
                <p className="text-xs text-gray-500">
                  Certificate Management System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#dashboard"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </a>
            <a
              href="#clients"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Clients
            </a>
            <a
              href="#notifications"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Notifications
            </a>
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Clock */}
            <div className="hidden sm:flex items-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              <div className="text-right">
                <div className="font-medium">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;