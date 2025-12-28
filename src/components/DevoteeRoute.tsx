import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface DevoteeRouteProps {
  children: React.ReactNode;
}

export const DevoteeRoute = ({ children }: DevoteeRouteProps) => {
  const { user, loading, hasProfile } = useAuth();

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

  // User must create a profile to access protected pages
  if (!hasProfile) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
