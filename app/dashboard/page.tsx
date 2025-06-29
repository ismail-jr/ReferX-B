'use client';

import Sidebar from '@/components/Sidebar';
import Main from '@/components/Main';
import ProtectedRoute from '@/components/ProtectedRoute'; 

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex ">
        <Sidebar />
        <div className="flex-1 md:ml-62 pt-4">
          <div className="p-4 md:p-6">
            <Main />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
