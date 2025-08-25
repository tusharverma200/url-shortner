import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import UrlShortener from './components/UrlShortener';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin-login' | 'admin-dashboard'>('home');

  const renderView = () => {
    switch (currentView) {
      case 'admin-login':
        return <AdminLogin onLoginSuccess={() => setCurrentView('admin-dashboard')} />;
      case 'admin-dashboard':
        return <AdminDashboard onLogout={() => setCurrentView('home')} />;
      default:
        return <UrlShortener />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">URL Shortener</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'home'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentView('admin-login')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'admin-login' || currentView === 'admin-dashboard'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderView()}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;