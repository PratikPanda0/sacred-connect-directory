import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface DevoteeRouteProps {
  children: React.ReactNode;
}

export const DevoteeRoute = ({ children }: DevoteeRouteProps) => {
  const { user, loading, isDevotee } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isDevotee) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
