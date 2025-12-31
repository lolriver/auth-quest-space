import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
