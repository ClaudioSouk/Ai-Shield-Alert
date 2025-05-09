
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserHistory from '@/components/UserHistory';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const History = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth" replace />;
  }
  
  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">Loading history...</div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Your Phishing Detection History</h1>
            </div>
          </div>
          <UserHistory />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
